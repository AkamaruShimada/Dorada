// backend/src/controllers/remboursement.controller.ts
import type { Request, Response } from 'express';
import { createRemboursementSchema } from '../schemas/remboursement.schema';
import { demanderRemboursement, RemboursementError } from '../services/remboursement.service';

export const rembourserCommande = async (req: Request, res: Response) => {
  const commandeId = Number(req.params.id);
  if (!Number.isInteger(commandeId)) return res.status(400).json({ message: 'ID invalide' });

  try {
    // req.user vient de votre middleware d'auth existant
    const remboursement = await demanderRemboursement(commandeId, req.body, req.user!.id);
    res.status(202).json({ ...remboursement, montant: Number(remboursement.montant) }); // 202 : demande acceptée, confirmation à venir via webhook
  } catch (err) {
    if (err instanceof RemboursementError) {
      return res.status(422).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};