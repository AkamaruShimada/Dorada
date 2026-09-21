// backend/src/controllers/extra.controller.ts

import { Request, Response } from 'express';
import * as extraService from '../services/extra.service';

/**
 * Petit helper pour convertir les Decimal Prisma en number
 * avant de renvoyer au frontend (sinon JSON.stringify plante ou renvoie une string bizarre)
 */
const serializeExtra = (extra: any) => ({
  ...extra,
  prix: Number(extra.prix),
});

export const getAllExtras = async (req: Request, res: Response) => {
  try {
    const extras = await extraService.getAllExtras();
    res.status(200).json(extras.map(serializeExtra));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getExtraById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Id invalide' });
    }

    const extra = await extraService.getExtraById(id);

    if (!extra) {
      return res.status(404).json({ message: 'Extra non trouvé' });
    }

    res.status(200).json(serializeExtra(extra));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createExtra = async (req: Request, res: Response) => {
  try {
    const extra = await extraService.createExtra(req.body);
    res.status(201).json(serializeExtra(extra));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateExtra = async (req: Request, res: Response) => {
  try {

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Id invalide' });
    }

    const extra = await extraService.updateExtra(id, req.body);
    res.status(200).json(serializeExtra(extra));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteExtra = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Id invalide' });
    }

    await extraService.deleteExtra(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};