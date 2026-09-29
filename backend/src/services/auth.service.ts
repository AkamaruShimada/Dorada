// backend/src/services/auth.service.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client' ; // adaptez selon votre chemin réel vers le client Prisma
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { env } from '../config/env';

const SALT_ROUNDS = 10;

export const registerUtilisateur = async (data: RegisterInput) => {
  const existant = await prisma.utilisateur.findUnique({
    where: { email: data.email },
  });

  if (existant) {
    throw new Error('EMAIL_DEJA_UTILISE');
  }

  const motDePasseHache = await bcrypt.hash(data.motDePasse, SALT_ROUNDS);

  const utilisateur = await prisma.utilisateur.create({
    data: {
      nom: data.nom,
      email: data.email,
      motDePasse: motDePasseHache,
      // role: EMPLOYE par défaut, défini dans le schéma Prisma
    },
  });

  const { motDePasse, ...utilisateurSansMotDePasse } = utilisateur;
  return utilisateurSansMotDePasse;
};

export const loginUtilisateur = async (data: LoginInput) => {
  // 1. On cherche d'abord côté Utilisateur (employé/admin)
  const utilisateur = await prisma.utilisateur.findUnique({
    where: { email: data.email },
  });

  if (utilisateur) {
    const motDePasseValide = await bcrypt.compare(data.motDePasse, utilisateur.motDePasse);

    if (!motDePasseValide) {
      throw new Error('IDENTIFIANTS_INVALIDES');
    }

    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role, typeCompte: 'UTILISATEUR' },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    const { motDePasse, ...utilisateurSansMotDePasse } = utilisateur;
    return {
      token,
      utilisateur: { ...utilisateurSansMotDePasse, typeCompte: 'UTILISATEUR' as const },
    };
  }

  // 2. Si aucun Utilisateur trouvé, on cherche côté Client
  const client = await prisma.client.findUnique({
    where: { email: data.email },
  });

  if (client) {
    const motDePasseValide = await bcrypt.compare(data.motDePasse, client.motDePasse);

    if (!motDePasseValide) {
      throw new Error('IDENTIFIANTS_INVALIDES');
    }

    const token = jwt.sign(
      { id: client.id, role: 'CLIENT', typeCompte: 'CLIENT' },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    const { motDePasse, ...clientSansMotDePasse } = client;
    return {
      token,
      utilisateur: { ...clientSansMotDePasse, role: 'CLIENT', typeCompte: 'CLIENT' as const },
    };
  }

  // 3. Ni l'un ni l'autre
  throw new Error('IDENTIFIANTS_INVALIDES');
};