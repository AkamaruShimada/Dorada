// backend/src/controllers/empanada.controller.ts

import { Request, Response } from 'express';
import * as empanadaService from '../services/empanada.service';

/**
 * Petit helper pour convertir les Decimal Prisma en number
 * avant de renvoyer au frontend (sinon JSON.stringify plante ou renvoie une string bizarre)
 */
const serializeEmpanada = (empanada: any) => ({
  ...empanada,
  prix: Number(empanada.prix),
});

export const getAllEmpanadas = async (req: Request, res: Response) => {
  try {
    const empanadas = await empanadaService.getAllEmpanadas();
    res.status(200).json(empanadas.map(serializeEmpanada));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getEmpanadaById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Id invalide' });
    }

    const empanada = await empanadaService.getEmpanadaById(id);

    if (!empanada) {
      return res.status(404).json({ message: 'Empanada non trouvée' });
    }

    res.status(200).json(serializeEmpanada(empanada));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createEmpanada = async (req: Request, res: Response) => {
  try {
    const empanada = await empanadaService.createEmpanada(req.body);
    res.status(201).json(serializeEmpanada(empanada));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateEmpanada = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Id invalide' });
    }

    const empanada = await empanadaService.updateEmpanada(id, req.body);
    res.status(200).json(serializeEmpanada(empanada));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteEmpanada = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Id invalide' });
    }

    await empanadaService.deleteEmpanada(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};