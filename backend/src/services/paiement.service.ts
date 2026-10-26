// backend/src/services/paiement.service.ts

import type Stripe from 'stripe';
import prisma from '../prisma/client';
import { envoyerConfirmationCommande } from './email.service';
import { calculerTtcUnitaire } from '../utils/pricing';

export const traiterPaiementReussi = async (
  eventId: string,
  session: Stripe.Checkout.Session,
) => {
  const commandeValidee = await prisma.$transaction(async (tx) => {
    // Idempotence : Stripe peut envoyer le même événement plusieurs fois
    const dejaTraite = await tx.stripeEvenement.findUnique({ where: { id: eventId } });
    if (dejaTraite) return;
    
    const commandeId = session.metadata?.commandeId
      ? Number(session.metadata.commandeId)
      : null;

    const commande = await tx.commande.findFirst({
      where: commandeId
        ? { OR: [{ stripeSessionId: session.id }, { id: commandeId }] }
        : { stripeSessionId: session.id },
      include: { empanadas: true, extras: true },
    });

    if (!commande) {
      throw new Error(`Commande introuvable pour la session ${session.id}`);
    }

    if (commande.statut === 'VALIDEE') return; // déjà traité, c'est normal
    if (commande.statut !== 'EN_ATTENTE_PAIEMENT') {
      throw new Error(`Statut inattendu ${commande.statut} pour ${commande.reference}`);
    }

    // Décrémenter le stock de façon atomique (échoue si stock insuffisant)
    for (const l of commande.empanadas) {
      const res = await tx.empanada.updateMany({
        where: { id: l.empanadaId, stock: { gte: l.quantite } },
        data: { stock: { decrement: l.quantite } },
      });
      if (res.count === 0) {
        // Payé mais plus de stock : à traiter manuellement (remboursement)
        console.error(`STOCK INSUFFISANT après paiement, commande ${commande.reference}`);
      }
    }
    for (const l of commande.extras) {
      await tx.extra.updateMany({
        where: { id: l.extraId, stock: { gte: l.quantite } },
        data: { stock: { decrement: l.quantite } },
      });
    }

    if (commande.codePromoId) {
      await tx.codePromo.update({
        where: { id: commande.codePromoId },
        data: { usagesActuels: { increment: 1 } },
      });
    }

    const commandeMaj = await tx.commande.update({
      where: { id: commande.id },
      data: {
        statut: 'VALIDEE',
        payeeLe: new Date(),
        stripePaymentIntentId:
          typeof session.payment_intent === 'string' ? session.payment_intent : null,
      },
    });

    await tx.stripeEvenement.create({ data: { id: eventId, type: 'checkout.session.completed' } });

    // On recharge la commande avec ses lignes pour le mail
    return tx.commande.findUnique({
      where: { id: commande.id },
      include: {
        empanadas: { include: { empanada: true } },
        extras: { include: { extra: true } },
        formules: {
          include: {
            formule: true,
            empanadasChoisies: { include: { empanada: true } },
            extrasChoisies: { include: { extra: true } },
          },
        },
      },
    });

  });

  // Hors transaction : un échec d'envoi n'annule pas le paiement
  if (commandeValidee) {

    const lignesEmpanadas = commandeValidee.empanadas
      .filter((l) => l.commandeFormuleId === null)
      .map((l) => ({
        nom: l.empanada.nom,
        quantite: l.quantite,
        prixUnitaire: Number(calculerTtcUnitaire(l.prixUnitaireHt, l.empanada.tauxTva)),
        details: [] as string[],
      }));

    const lignesExtras = commandeValidee.extras
      .filter((l) => l.commandeFormuleId === null)
      .map((l) => ({
        nom: l.extra.nom,
        quantite: l.quantite,
        prixUnitaire: Number(calculerTtcUnitaire(l.prixUnitaireHt, l.extra.tauxTva)),
        details: [] as string[],
      }));

    const lignesFormules = commandeValidee.formules.map((f) => ({
      nom: f.formule.nom,
      quantite: f.quantite,
      prixUnitaire: Number(f.prixUnitaireTtc),
      details: [
        ...f.empanadasChoisies.map((e) => e.empanada.nom),
        ...f.extrasChoisies.map((e) => e.extra.nom),
      ],
    }));

    const lignes = [...lignesFormules, ...lignesEmpanadas, ...lignesExtras];

    envoyerConfirmationCommande(commandeValidee.clientEmail, {
      reference: commandeValidee.reference,
      nom: commandeValidee.clientNom,
      lignes,
      sousTotal: Number(commandeValidee.totalTtc) + Number(commandeValidee.remiseTtc),
      reduction: Number(commandeValidee.remiseTtc) > 0 ? Number(commandeValidee.remiseTtc) : undefined,
      totalTtc: Number(commandeValidee.totalTtc),
      modeRecuperation:
        commandeValidee.modeRecuperation === 'LIVRAISON' ? 'Livraison' : 'Retrait sur place',
      dateRecuperation: commandeValidee.dateSouhaitee
        ? new Date(commandeValidee.dateSouhaitee).toLocaleString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })
        : undefined,
    }).catch((err) => console.error('Échec envoi mail confirmation', err));
  }
};

export const traiterSessionExpiree = async (
  eventId: string,
  session: Stripe.Checkout.Session,
) => {
  await prisma.commande.updateMany({
    where: { stripeSessionId: session.id, statut: 'EN_ATTENTE_PAIEMENT' },
    data: { statut: 'EXPIREE' },
  });
};