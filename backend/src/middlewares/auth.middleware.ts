// backend/src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  role: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth_token; // Récupère le token depuis le cookie

  if (!token) {
    return res.status(401).json({ message: 'Authentification requise.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = { id: decoded.id, role: decoded.role as any };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentification requise.' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
  }

  next();
};