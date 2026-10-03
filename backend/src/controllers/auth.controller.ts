// backend/src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

const isProduction = process.env.NODE_ENV === 'production';

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
    const {token, utilisateur} = await authService.loginUtilisateur(req.body);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 jour
    });

    res.status(200).json({utilisateur});
  } catch (error: any) {
    if (error.message === 'IDENTIFIANTS_INVALIDES') {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: isProduction,
  });
  res.status(200).json({ message: 'Déconnecté avec succès.' });
};

export const me = async (req: Request, res: Response) => {
  // Empêche le navigateur de mettre cette réponse en cache
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  // req.user est injecté par le middleware authenticate
  // utile pour que le front sache "qui est connecté" au chargement de l'app
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié.' });
    }

    // req.user ne contient que id/role (payload du JWT)
    // il faut récupérer l'utilisateur complet pour matcher le type Utilisateur du front
    const utilisateur = await authService.getUserById(req.user.id);

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    res.status(200).json({ utilisateur });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};