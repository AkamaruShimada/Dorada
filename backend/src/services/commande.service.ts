// backend/src/services/commande.service.ts

import { randomBytes } from 'node:crypto';
import { StatutCommande } from '@prisma/client';
import prisma from '../prisma/client';
import { stripe } from '../config/stripe';
import type { CreateCommandeInput } from '../schemas/commande.schema';
import { calculerLigne, calculerFormule, multiplierLigne, dec, type LigneFormule } from '../utils/pricing';
import { verifierCodePromo } from './codePromo.service';

// ---------- Erreurs métier (le controller les reconnaît par classe, pas par texte) ----------
export class CommandeError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

// ---------- Prix : tout en centimes entiers ----------
const cents = (n: unknown) => Math.round(Number(n) * 100);
type Ligne = { ht: number; tva: number; ttc: number};
const euros = (c: number) => (c / 100).toFixed(2);


function genererReference(): string {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const suffixe = randomBytes(3).toString('hex').toUpperCase();
  return `CMD-${date}-${suffixe}`;
}

export const createCommandeAndSession = async (data: CreateCommandeInput) => {
  // 1. Charger tout le catalogue concerné en 3 requêtes
  const empIds = new Set<number>(data.empanadas.map((e) => e.empanadaId));
  const extIds = new Set<number>(data.extras.map((e) => e.extraId));
  data.formules.forEach((f) => {
    f.empanadasChoisies.forEach((id) => empIds.add(id));
    f.extrasChoisies.forEach((id) => extIds.add(id));
  });

  const [empanadas, extras, formules] = await Promise.all([
    prisma.empanada.findMany({ where: { id: { in: [...empIds] }, actif: true } }),
    prisma.extra.findMany({ where: { id: { in: [...extIds] }, actif: true } }),
    prisma.formule.findMany({ where: { id: { in: data.formules.map((f) => f.formuleId) }, actif: true } }),
  ]);
  const empMap = new Map(empanadas.map((e) => [e.id, e]));
  const extMap = new Map(extras.map((e) => [e.id, e]));
  const forMap = new Map(formules.map((f) => [f.id, f]));

  // 2. Demande de stock cumulée (unités + choix de formules x quantité de formule)
  const besoinEmp = new Map<number, number>();
  const besoinExt = new Map<number, number>();
  const add = (m: Map<number, number>, id: number, q: number) => m.set(id, (m.get(id) ?? 0) + q);

  data.empanadas.forEach((l) => add(besoinEmp, l.empanadaId, l.quantite));
  data.extras.forEach((l) => add(besoinExt, l.extraId, l.quantite));
  data.formules.forEach((f) => {
    f.empanadasChoisies.forEach((id) => add(besoinEmp, id, f.quantite));
    f.extrasChoisies.forEach((id) => add(besoinExt, id, f.quantite));
  });

  for (const [id, q] of besoinEmp) {
    const p = empMap.get(id);
    if (!p) throw new CommandeError(`Empanada ${id} indisponible`);
    if (p.stock < q) throw new CommandeError(`Stock insuffisant pour ${p.nom}`, 409);
  }
  for (const [id, q] of besoinExt) {
    const p = extMap.get(id);
    if (!p) throw new CommandeError(`Extra ${id} indisponible`);
    if (p.stock < q) throw new CommandeError(`Stock insuffisant pour ${p.nom}`, 409);
  }

  // 3. Construire les lignes (en mémoire) et les totaux
  let totalHt = 0, totalTva = 0, totalTtc = 0;
  const cumul = (l: Ligne) => { totalHt += l.ht; totalTva += l.tva; totalTtc += l.ttc; };

  const lignesEmp = data.empanadas.map((l) => {
    const p = empMap.get(l.empanadaId)!;
    const c = calculerLigne(dec(p.prixHt), dec(p.tauxTva), l.quantite);
    cumul({ ht: cents(c.totalHt), tva: cents(c.totalTva), ttc: cents(c.totalTtc)});
    return {
      empanadaId: p.id, quantite: l.quantite, nomFige: p.nom,
      prixUnitaireHt: p.prixHt, tauxTva: p.tauxTva, supplementTtc: 0,
      totalHt: c.totalHt.toFixed(2), totalTva: c.totalTva.toFixed(2), totalTtc: c.totalTtc.toFixed(2),
    };
  });

  const lignesExt = data.extras.map((l) => {
    const p = extMap.get(l.extraId)!;
    const c = calculerLigne(dec(p.prixHt), dec(p.tauxTva), l.quantite);
    cumul({ ht: cents(c.totalHt), tva: cents(c.totalTva), ttc: cents(c.totalTtc) });
    return {
      extraId: p.id, quantite: l.quantite, nomFige: p.nom,
      prixUnitaireHt: p.prixHt, tauxTva: p.tauxTva, supplementTtc: 0,
      totalHt: c.totalHt.toFixed(2), totalTva: c.totalTva.toFixed(2), totalTtc: c.totalTtc.toFixed(2),
    };
  });

  const lignesFormules = data.formules.map((l) => {
    const f = forMap.get(l.formuleId);
    if (!f) throw new CommandeError(`Formule ${l.formuleId} indisponible`);
    if (l.empanadasChoisies.length !== f.nombreEmpanadas || l.extrasChoisies.length !== f.nombreExtras) {
      throw new CommandeError(`Composition invalide pour la formule ${f.nom}`);
    }
    const choix = [
      ...l.empanadasChoisies.map((id) => { const p = empMap.get(id)!; return { prixHt: dec(p.prixHt), tauxTva: dec(p.tauxTva), supplementTtc: dec(p.supplementFormuleTtc) }; }),
      ...l.extrasChoisies.map((id) => { const p = extMap.get(id)!; return { prixHt: dec(p.prixHt), tauxTva: dec(p.tauxTva), supplementTtc: dec(p.supplementFormuleTtc) }; }),
    ];

    const lignesUnitaires = calculerFormule(dec(f.prixTtc), choix);
    const lignes = lignesUnitaires.map((x) => multiplierLigne(x, l.quantite));
    const total = lignes.reduce((a, x) => ({
      ht: a.ht + cents(x.totalHt), tva: a.tva + cents(x.totalTva), ttc: a.ttc + cents(x.totalTtc),
    }), { ht: 0, tva: 0, ttc: 0 });
    cumul(total);

    return {
      formule: f, input: l, unitTtc: cents(f.prixTtc) + choix.reduce((a, x) => a + cents(x.supplementTtc), 0),
      lignes, ht: total.ht, tva: total.tva, ttc: total.ttc,
      choixEmp: l.empanadasChoisies.map((id) => empMap.get(id)!),
      choixExt: l.extrasChoisies.map((id) => extMap.get(id)!),
    };
  });

  if (totalTtc <= 0) throw new CommandeError('Commande vide');

  // 3 bis. Code promo : recalculé côté serveur, jamais depuis le front
  const promo = data.codePromo ? await verifierCodePromo(data.codePromo) : null;
  const remisePourcent = promo ? Number(promo.pourcentage) : 0;

  const remiseTtcCents = Math.round(totalTtc * (remisePourcent / 100));
  const totalTtcFinal = totalTtc - remiseTtcCents;

  // HT et TVA recalculés proportionnellement pour rester cohérents avec le TTC
  const ratio = totalTtc > 0 ? totalTtcFinal / totalTtc : 1;
  const totalHtFinal = Math.round(totalHt * ratio);
  const totalTvaFinal = totalTtcFinal - totalHtFinal;

  if (totalTtcFinal < 50) {
    throw new CommandeError('Montant minimum de paiement : 0,50 €');
  }

  // 4. Créer la commande en base (transaction)
  const reference = genererReference();
  const commande = await prisma.$transaction(async (tx) => {
    const c = await tx.commande.create({
      data: {
        reference,
        clientNom: data.clientNom,
        clientEmail: data.clientEmail,
        clientTelephone: data.clientTelephone,
        modeRecuperation: data.modeRecuperation,
        adresseLivraison: data.adresseLivraison ?? null,
        dateSouhaitee: new Date(data.dateSouhaitee),
        totalHt: euros(totalHtFinal),
        totalTva: euros(totalTvaFinal),
        totalTtc: euros(totalTtcFinal),
        codePromoId: promo?.id ?? null,
        codePromoFige: promo?.code ?? null,
        remisePourcent: promo ? promo.pourcentage : null,
        remiseTtc: euros(remiseTtcCents),
        empanadas: { create: lignesEmp },
        extras: { create: lignesExt },
      },
    });

    for (const lf of lignesFormules) {
      const cf = await tx.commandeFormule.create({
        data: {
          commandeId: c.id, formuleId: lf.formule.id, quantite: lf.input.quantite,
          nomFige: lf.formule.nom, prixUnitaireTtc: euros(lf.unitTtc),
          totalHt: euros(lf.ht), totalTva: euros(lf.tva), totalTtc: euros(lf.ttc),
        },
      });
      // Une ligne par choix, quantite = quantite de formule (cohérent avec paiement.service / stock)
      let li = 0;
      await tx.commandeEmpanada.createMany({
        data: lf.choixEmp.map((p) => { const x = lf.lignes[li++]; return {
          commandeId: c.id, commandeFormuleId: cf.id, empanadaId: p.id, quantite: lf.input.quantite, nomFige: p.nom,
          prixUnitaireHt: p.prixHt, tauxTva: x.tauxTva.toFixed(2), supplementTtc: p.supplementFormuleTtc,
          totalHt: x.totalHt.toFixed(2), totalTva: x.totalTva.toFixed(2), totalTtc: x.totalTtc.toFixed(2),
        }; }),
      });
      await tx.commandeExtra.createMany({
        data: lf.choixExt.map((p) => { const x = lf.lignes[li++]; return {
          commandeId: c.id, commandeFormuleId: cf.id, extraId: p.id, quantite: lf.input.quantite, nomFige: p.nom,
          prixUnitaireHt: p.prixHt, tauxTva: x.tauxTva.toFixed(2), supplementTtc: p.supplementFormuleTtc,
          totalHt: x.totalHt.toFixed(2), totalTva: x.totalTva.toFixed(2), totalTtc: x.totalTtc.toFixed(2),
        }; }),
      });
    }
    return c;
  });

  

  // 5. Session Stripe : UNE ligne = total serveur (zéro écart de centimes)
  const frontUrl = process.env.FRONTEND_URL!;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: data.clientEmail,
      client_reference_id: reference,
      metadata: { reference, commandeId: String(commande.id), codePromo: promo?.code ?? '' },
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: totalTtcFinal,
          product_data: { name: `Commande ${reference}` },
        },
      }],
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      success_url: `${frontUrl}/commande/succes?ref=${reference}`,
      cancel_url: `${frontUrl}/panier`,
    });

    await prisma.commande.update({
      where: { id: commande.id },
      data: { stripeSessionId: session.id },
    });

    return { checkoutUrl: session.url!, reference };
  } catch (err) {
    // Session impossible : on ne laisse pas une commande orpheline en attente
    await prisma.commande.update({ where: { id: commande.id }, data: { statut: 'ANNULEE' } });
    throw err;
  }

};

// Inclusion réutilisée : lignes, formules et leurs enfants, remboursements
const includeDetails = {
  empanadas: { where: { commandeFormuleId: null }, include: { empanada: true } },
  extras:    { where: { commandeFormuleId: null }, include: { extra: true } },
  formules: {
    include: {
      formule: true,
      empanadasChoisies: { include: { empanada: true } },
      extrasChoisies: { include: { extra: true } },
    },
  },
  remboursements: true,
};


export const getCommandeByReference = async (reference: string) => {
  return prisma.commande.findUnique({
    where: { reference },
    include: includeDetails,
  });
};

export const getCommandeById = async (id: number) => {
  return prisma.commande.findUnique({
    where: { id },
    include: includeDetails,
  });
};

export const getAllCommandes = async (statut?: StatutCommande) => {
  return prisma.commande.findMany({
    where: statut ? { statut } : {},
    orderBy: { dateSouhaitee: 'asc' },
    include: includeDetails,
  });
};

/**
 * Transitions manuelles autorisées pour l'admin.
 * REMBOURSEE / EXPIREE / VALIDEE ne se posent JAMAIS à la main : ils viennent de Stripe via webhook.
 */
const TRANSITIONS_MANUELLES: Partial<Record<StatutCommande, StatutCommande[]>> = {
  VALIDEE: ['RECUPEREE', 'ANNULEE'],
};

export const updateStatutCommande = async (id: number, nouveauStatut: StatutCommande) => {
  const commande = await prisma.commande.findUniqueOrThrow({ where: { id } });

  const autorises = TRANSITIONS_MANUELLES[commande.statut] ?? [];
  if (!autorises.includes(nouveauStatut)) {
    throw new Error(
      `TRANSITION_INVALIDE: Passage de ${commande.statut} à ${nouveauStatut} non autorisé`,
    );
  }

  return prisma.commande.update({
    where: { id },
    data: { statut: nouveauStatut },
    include: includeDetails,
  });
};