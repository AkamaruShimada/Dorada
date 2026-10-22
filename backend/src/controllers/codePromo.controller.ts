//backend/src/controllers/codePromo.controller

import { Request, Response } from 'express';
import * as codePromoService from '../services/codePromo.service';

const serialize = (p: any) => ({ ...p, pourcentage: Number(p.pourcentage) });

// PUBLIC : vérifie un code depuis le panier
export const verifierCodePromo = async (req: Request, res: Response) => {
  try {
    const promo = await codePromoService.verifierCodePromo(req.body.code);
    res.status(200).json({ code: promo.code, pourcentage: Number(promo.pourcentage) });
    } catch (error) {
    if (error instanceof codePromoService.CodePromoError) {
        return res.status(400).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
    }
};

// ADMIN
export const getCodePromo = async (_req: Request, res: Response) => {
  try {
    const codes = await codePromoService.getCodesPromo();
    res.status(200).json(codes.map(serialize));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createCodePromo = async (req: Request, res: Response) => {
  try {
    const promo = await codePromoService.createCodePromo(req.body);
    res.status(201).json(serialize(promo));
  } catch (error: any) {
    if (error instanceof codePromoService.CodePromoError) {
      return res.status(409).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateCodePromo = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'ID invalide' });
    const promo = await codePromoService.updateCodePromo(id, req.body);
    res.status(200).json(serialize(promo));
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Code promo introuvable' });
    }
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteCodePromo = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Id invalide' });
    }

    const promo = await codePromoService.deleteCodePromo(id);
    res.status(200).json(promo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};