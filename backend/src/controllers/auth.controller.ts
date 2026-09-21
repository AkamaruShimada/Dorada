// backend/src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const utilisateur = await authService.registerUtilisateur(req.body);
    res.status(201).json(utilisateur);
  } catch (error: any) {
    if (error.message === 'EMAIL_DEJA_UTILISE') {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const resultat = await authService.loginUtilisateur(req.body);
    res.status(200).json(resultat);
  } catch (error: any) {
    if (error.message === 'IDENTIFIANTS_INVALIDES') {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
};