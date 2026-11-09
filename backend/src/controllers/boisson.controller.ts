// backend/src/controllers/boisson.controller.ts

import { Request, Response } from 'express';
import * as boissonService from '../services/boisson.service';
import { uploadImageBuffer, deleteImageByUrl } from '../services/upload.service';


/**
 * Petit helper pour convertir les Decimal Prisma en number
 * avant de renvoyer au frontend (sinon JSON.stringify plante ou renvoie une string bizarre)
 */

const messageError = 'Erreur Serveur : '

const serializeBoisson = (boisson: any) => ({
  ...boisson,
  prixHt: Number(boisson.prixHt),
});

export const getAllBoissons = async (req: Request, res: Response) => {
  try {
    const boissons = await boissonService.getAllBoissons();
    res.status(200).json(boissons.map(serializeBoisson));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: messageError + error });
  }
};

export const getBoissonById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Id invalide' });
    }

    const boisson = await boissonService.getBoissonById(id);

    if (!boisson) {
      return res.status(404).json({ message: 'Boisson non trouvé' });
    }

    res.status(200).json(serializeBoisson(boisson));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: messageError + error });
  }
};

export const createBoisson = async (req: Request, res: Response) => {
  try {
    let imageUrl: String | undefined

    if(req.file) {
      imageUrl = await uploadImageBuffer(req.file.buffer, '/Dorada/Boissons')
    }

    const boisson = await boissonService.createBoisson( {...req.body, image_url: imageUrl});
    res.status(201).json(serializeBoisson(boisson));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: messageError + error });
  }
};


export const updateBoisson = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Id invalide' });
    }

    const existingBoisson = await boissonService.getBoissonById(id);
    if (!existingBoisson) {
      return res.status(404).json({ message: 'Extra non trouvé'});
    }

    const { removeImage, ...validatedData } = req.body;

    let imageUrl = existingBoisson.image_url

    if (req.file) {
      if (imageUrl) {
        await deleteImageByUrl(imageUrl);
      }
      imageUrl = await uploadImageBuffer(req.file.buffer, '/Dorada/Boissons')
    }else if (removeImage && imageUrl) {
      await deleteImageByUrl(imageUrl)
      imageUrl = null;
    }

    const boisson = await boissonService.updateBoisson(id, { ...validatedData, image_url: imageUrl});
    res.status(200).json(serializeBoisson(boisson));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: messageError + error });
  }
};

export const deleteBoisson = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Id invalide' });
    }

    await boissonService.deleteBoisson(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: messageError + error });
  }
};