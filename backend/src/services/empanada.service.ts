// backend/src/services/empanada.service.ts

import prisma from '../prisma/client';
import { CreateEmpanadaInput, UpdateEmpanadaInput } from '../schemas/empanada.schema';


export const getAllEmpanadas = async (includeInactive: boolean = false) => {
  return prisma.empanada.findMany({
    where: includeInactive ? {} : { actif: true },
    orderBy: { nom: 'asc' },
  });
};

export const getEmpanadaById = async (id: number) => {
  return prisma.empanada.findUnique({ where: { id } });
};

export const createEmpanada = async (data: CreateEmpanadaInput) => {
  return prisma.empanada.create({ data });
};

export const updateEmpanada = async (
  id: number,
  data: UpdateEmpanadaInput
) => {
  return prisma.empanada.update({ where: { id }, data });
};

/**
 * Suppression "douce" : on désactive plutôt que de supprimer réellement
 * Pourquoi ? Parce que si une empanada a déjà été commandée (CommandeEmpanada
 * y fait référence via empanadaId), la supprimer casserait l'historique des commandes.
 * Prisma refusera d'ailleurs la suppression si une contrainte de clé étrangère existe.
 */
export const deleteEmpanada = async (id: number) => {
  return prisma.empanada.update({
    where: { id },
    data: { actif: false },
  });
};