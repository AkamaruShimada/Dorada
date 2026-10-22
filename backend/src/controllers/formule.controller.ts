// backend/src/controllers/formule.controller.ts

import { Request, Response } from "express";
import * as formuleService from "../services/formule.service";

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
        const formule = await formuleService.createFormule(req.body);
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

        const formule = await formuleService.updateFormule(id, req.body);
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