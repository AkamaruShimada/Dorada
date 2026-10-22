// backend/src/controllers/empanada.controller.ts

import { Request, Response } from 'express';
import * as empanadaService from '../services/empanada.service';
import { uploadImageBuffer, deleteImageByUrl } from '../services/upload.service';
import { createEmpanadaSchema, updateEmpanadaSchema } from '../schemas/empanada.schema';

/**
 * Petit helper pour convertir les Decimal Prisma en number
 * avant de renvoyer au frontend (sinon JSON.stringify plante ou renvoie une string bizarre)
 */
const serializeEmpanada = (empanada: any) => ({
  ...empanada,
  prixHt: Number(empanada.prixHt),
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
    let imageUrl: string | undefined;

    if (req.file) {
      // Upload de l'image sur Cloudinary
      imageUrl = await uploadImageBuffer(req.file.buffer, '/Dorada/Empanadas');
    }

    const empanada = await empanadaService.createEmpanada({ ...req.body, image_url : imageUrl });
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

    const existingEmpanada = await empanadaService.getEmpanadaById(id);
    if (!existingEmpanada) {
      return res.status(404).json({ message: 'Empanada non trouvée' });
    }

    // On valide et on coerce req.body AVANT de toucher à Prisma
    const parseResult = updateEmpanadaSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { removeImage, ...validatedData } = parseResult.data;

    let imageUrl = existingEmpanada.image_url;

    if (req.file) {
      // Nouvelle image : on supprime l'ancienne et on upload la nouvelle
      if (imageUrl) {
        await deleteImageByUrl(imageUrl);
      }
      imageUrl = await uploadImageBuffer(req.file.buffer, '/Dorada/Empanadas');
    } else if (removeImage && imageUrl) {
      // Suppression demandée sans remplacement
      await deleteImageByUrl(imageUrl);
      imageUrl = null;
    }

    const empanada = await empanadaService.updateEmpanada(id, { ...validatedData, image_url: imageUrl });
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

    const empanada = await empanadaService.deleteEmpanada(id);
    res.status(200).json(empanada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};