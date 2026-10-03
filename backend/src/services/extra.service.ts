// backend/src/services/extra.service.ts

import prisma from '../prisma/client';
import { CreateExtraInput, UpdateExtraInput } from '../schemas/extra.schema';


/**
 * Récupère toutes les extras actives
 * On ne montre pas celles désactivées (actif: false) par défaut
 */
export const getAllExtras = async (includeInactive: boolean = false) => {
  return prisma.extra.findMany({
    where: includeInactive ? {} : { actif: true },
    orderBy: { nom: 'asc' },
  });
};

export const getExtraById = async (id: number) => {
  return prisma.extra.findUnique({ where: { id } });
};

export const createExtra = async (data: CreateExtraInput) => {
  return prisma.extra.create({ data });
};

export const updateExtra = async (
  id: number,
  data: UpdateExtraInput
) => {
  return prisma.extra.update({ where: { id }, data });
};

/**
 * Suppression "douce" : on désactive plutôt que de supprimer réellement
 * Pourquoi ? Parce que si une empanada a déjà été commandée (CommandeEmpanada
 * y fait référence via empanadaId), la supprimer casserait l'historique des commandes.
 * Prisma refusera d'ailleurs la suppression si une contrainte de clé étrangère existe.
 */
export const deleteExtra = async (id: number) => {
  return prisma.extra.delete({
    where: { id }
  });
};