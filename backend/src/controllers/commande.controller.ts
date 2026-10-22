// backend/src/controllers/commande.controller.ts

import { Request, Response } from 'express';
import * as commandeService from '../services/commande.service';
import * as statsService from '../services/stats.service';
import { StatutCommande } from '@prisma/client';
import { CodePromoError } from '../services/codePromo.service';

const serializeFormule = (f: any) => ({
  ...f,
  prixUnitaireTtc: Number(f.prixUnitaireTtc ?? f.prixTtc),
  prixUnitaireHt: Number(f.prixUnitaireHt ?? 0),
  tauxTva: Number(f.tauxTva ?? 0),
  nom: f.formule?.nom,
  empanadas: f.empanadas?.map((e: any) => ({
    id: e.empanada?.id ?? e.empanadaId,
    nom: e.empanada?.nom,
  })),
  extras: f.extras?.map((e: any) => ({
    id: e.extra?.id ?? e.extraId,
    nom: e.extra?.nom,
  })),
});

const serializeCommande = (commande: any) => ({
  ...commande,
  totalHt: Number(commande.totalHt),
  totalTva: Number(commande.totalTva),
  totalTtc: Number(commande.totalTtc),
  remiseTtc: Number(commande.remiseTtc ?? 0),
  remisePourcent: commande.remisePourcent !== null && commande.remisePourcent !== undefined
    ? Number(commande.remisePourcent)
    : null,
  codePromoFige: commande.codePromoFige ?? null,
  empanadas: commande.empanadas?.map((l: any) => ({
    ...l,
    prixUnitaireHt: Number(l.prixUnitaireHt),
    tauxTva: Number(l.tauxTva),
  })),
  extras: commande.extras?.map((l: any) => ({
    ...l,
    prixUnitaireHt: Number(l.prixUnitaireHt),
    tauxTva: Number(l.tauxTva),
  })),
  formules: commande.formules?.map(serializeFormule),
  remboursements: commande.remboursements?.map((r: any) => ({
    ...r,
    montant: Number(r.montant),
  })),
});

/**
 * Vue publique : le client suit sa commande avec sa référence.
 * On ne renvoie QUE le nécessaire, pas d'ids internes ni d'infos Stripe.
 */
const serializeCommandePublique = (commande: any) => {
  const c = serializeCommande(commande);
  return {
    reference: c.reference,
    statut: c.statut,
    modeRecuperation: c.modeRecuperation,
    adresseLivraison: c.adresseLivraison,
    dateSouhaitee: c.dateSouhaitee,
    totalTtc: c.totalTtc,
    empanadas: c.empanadas?.map((l: any) => ({
      nom: l.empanada?.nom,
      quantite: l.quantite,
      prixUnitaireHt: l.prixUnitaireHt,
    })),
    extras: c.extras?.map((l: any) => ({
      nom: l.extra?.nom,
      quantite: l.quantite,
      prixUnitaireHt: l.prixUnitaireHt,
    })),
    formules: c.formules?.map((f: any) => ({
      formule: f.formuleId,
      nom: f.nom,
      quantite: f.quantite,
      prixUnitaireTtc: f.prixUnitaireTtc,
      empanadas: f.empanadas?.map((e: any) => e.nom),
      extras: f.extras?.map((e: any) => e.nom),
    })),
  };
};

export const createCommande = async (req: Request, res: Response) => {
  try {
    // req.body est déjà validé par validate(createCommandeSchema)
    const { checkoutUrl, reference } = await commandeService.createCommandeAndSession(req.body);

    res.status(201).json({ reference, checkoutUrl });
  } catch (error: any) {
    console.error(error);

    // Votre service lance des Error simples : on les reconnaît à leur message
    if (
      error.message?.includes('Stock insuffisant') ||
      error.message?.includes('indisponibles')
    ) {
      return res.status(409).json({ message: error.message });
    }

    if (error instanceof CodePromoError) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getCommandeByReference = async (req: Request, res: Response) => {
  try {
    const reference = String(req.params.reference);

    const commande = await commandeService.getCommandeByReference(reference);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.status(200).json(serializeCommandePublique(commande));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getAllCommandesAdmin = async (req: Request, res: Response) => {
  try {
    // Filtre optionnel : /commandes/admin?statut=VALIDEE
    const statutParam = req.query.statut as string | undefined;

    if (statutParam && !(statutParam in StatutCommande)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const commandes = await commandeService.getAllCommandes(
      statutParam as StatutCommande | undefined
    );
    res.status(200).json(commandes.map(serializeCommande));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getCommandeByIdAdmin = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Id invalide' });
    }

    const commande = await commandeService.getCommandeById(id);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.status(200).json(serializeCommande(commande));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * Changement de statut manuel par l'admin.
 * Uniquement VALIDEE -> RECUPEREE ou ANNULEE (voir le service).
 * Le remboursement passe par remboursement.controller, jamais par ici.
 */
export const updateStatutCommande = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Id invalide' });
    }

    const commande = await commandeService.getCommandeById(id);
    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    const updated = await commandeService.updateStatutCommande(id, req.body.statut);
    res.status(200).json(serializeCommande(updated));
  } catch (error: any) {
    console.error(error);

    if (error.code === 'TRANSITION_INVALIDE') {
      return res.status(409).json({ message: error.message });
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getStatsJour = async (req: Request, res: Response, next: Function) => {
  try {
    const date = req.query.date ? new Date(String(req.query.date)) : new Date();
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Date invalide' });
    }
    res.json(await statsService.getStatsJour(date));
  } catch (err) {
    next(err);
  }
};