// backend/src/controllers/formule.controller.ts

import { Request, Response } from "express";
import * as formuleService from "../services/formule.service";
import { deleteImageByUrl, uploadImageBuffer } from "../services/upload.service";

const serializeFormule = (formule: any) => ({
  ...formule,
  prixTtc: Number(formule.prixTtc),
});

export const getAllFormules = async (req: Request, res: Response) => {
    try {
        const formules = await formuleService.getAllFormules();
        res.status(200).json(formules.map(serializeFormule));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export const getFormuleById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Id invalide" });
        }

        const formule = await formuleService.getFormuleById(id);

        if (!formule) {
            return res.status(404).json({ message: "Formule non trouvée" });
        }

        res.status(200).json(serializeFormule(formule));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export const createFormule = async (req: Request, res: Response) => {
    try {
        let imageUrl: String | undefined
    
        if(req.file) {
            imageUrl = await uploadImageBuffer(req.file.buffer, '/Dorada/Formules')
        }
        
        const formule = await formuleService.createFormule({ ...req.body, image_url: imageUrl });
        res.status(201).json(serializeFormule(formule));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export const updateFormule = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Id invalide" });
        }

        const existingFormule = await formuleService.getFormuleById(id);
        if (!existingFormule) {
            return res.status(404).json({ message: 'Formule non trouvée'});
        }
    
        const { removeImage, ...validatedData } = req.body;
    
        let imageUrl = existingFormule.image_url
    
        if (req.file) {
            if (imageUrl) {
            await deleteImageByUrl(imageUrl);
            }
            imageUrl = await uploadImageBuffer(req.file.buffer, '/Dorada/Formules');
        }else if (removeImage && imageUrl) {
            await deleteImageByUrl(imageUrl)
            imageUrl = null;
        }
        
        const formule = await formuleService.updateFormule(id, { ...validatedData, image_url: imageUrl});
        res.status(200).json(serializeFormule(formule));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export const deleteFormule = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Id invalide" });
        }

        await formuleService.deleteFormule(id);
        res.status(204).send();
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}