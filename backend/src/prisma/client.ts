// backend/src/prisma/client.ts

import { PrismaClient } from '@prisma/client';

// Une seule instance de PrismaClient pour toute l'application
// Évite d'ouvrir trop de connexions à la base de données
const prisma = new PrismaClient();

export default prisma;