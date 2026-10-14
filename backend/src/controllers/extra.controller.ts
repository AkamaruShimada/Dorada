// backend/src/controllers/extra.controller.ts

import { Request, Response } from 'express';
import * as extraService from '../services/extra.service';
import { uploadImageBuffer, deleteImageByUrl } from '../services/upload.service';
import { createExtraSchema, updateExtraSchema} from '../schemas/extra.schema'


/**
 * Petit helper pour convertir les Decimal Prisma en number
 * avant de renvoyer au frontend (sinon JSON.stringify plante ou renvoie une string bizarre)
 */
const serializeExtra = (extra: any) => ({
  ...extra,
  prixHt: Number(extra.prixHt),
});

export const getAllExtras = async (req: Request, res: Response) => {
  try {
    const extras = await extraService.getAllExtras(false);
    res.status(200).json(extras.map(serializeExtra));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getAllExtrasAdmin = async (req: Request, res: Response) => {
  try {
    const extras = await extraService.getAllExtras(true);
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
    let imageUrl: String | undefined

    if(req.file) {
      imageUrl = await uploadImageBuffer(req.file.buffer, '/Dorada/Extras')
    }

    const extra = await extraService.createExtra( {...req.body, image_url: imageUrl});
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

    const existingExtra = await extraService.getExtraById(id);
    if (!existingExtra) {
      return res.status(404).json({ message: 'Extra non trouvé'});
    }

    const parseResult = updateExtraSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { removeImage, ...validatedData } = parseResult.data;

    let imageUrl = existingExtra.image_url

    if (req.file) {
      if (imageUrl) {
        await deleteImageByUrl(imageUrl);
      }
      imageUrl = await uploadImageBuffer(req.file.buffer, '/Dorada/Extras')
    }else if (removeImage && imageUrl) {
      await deleteImageByUrl(imageUrl)
      imageUrl = null;
    }

    const extra = await extraService.updateExtra(id, { ...validatedData, image_url: imageUrl});
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