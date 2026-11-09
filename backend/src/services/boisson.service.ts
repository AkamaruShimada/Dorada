// backend/src/services/boisson.service.ts

import prisma from '../prisma/client';
import { CreateBoissonInput, UpdateBoissonInput } from '../schemas/boisson.schema';


export const getAllBoissons = async () => {
  return prisma.boisson.findMany({
    orderBy: { nom: 'asc' },
  });
};

export const getBoissonById = async (id: number) => {
  return prisma.boisson.findUnique({ where: { id } });
};

export const createBoisson = async (data: CreateBoissonInput) => {
  return prisma.boisson.create({ data });
};

export const updateBoisson = async (
  id: number,
  data: UpdateBoissonInput & { image_url?: string | null}
) => {
  return prisma.boisson.update({ where: { id }, data });
};

/**
 * Suppression "douce" : on désactive plutôt que de supprimer réellement
 * Pourquoi ? Parce que si une empanada a déjà été commandée (CommandeEmpanada
 * y fait référence via empanadaId), la supprimer casserait l'historique des commandes.
 * Prisma refusera d'ailleurs la suppression si une contrainte de clé étrangère existe.
 */
export const deleteBoisson = async (id: number) => {
  return prisma.boisson.update({
    where: { id },
    data: { actif: false }
  });
};