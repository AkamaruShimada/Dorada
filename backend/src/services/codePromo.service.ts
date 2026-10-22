// backend/src/services/codePromo.service.ts

import prisma from '../prisma/client';
import { Prisma } from '@prisma/client';

export class CodePromoError extends Error {}

export const verifierCodePromo = async (codeSaisi: string) => {
  const code = codeSaisi.trim().toUpperCase();

  const promo = await prisma.codePromo.findUnique({ where: { code } });

  if (!promo || !promo.actif) throw new CodePromoError('Code promo invalide');
  if (promo.dateExpiration && promo.dateExpiration < new Date())
    throw new CodePromoError('Code promo expiré');
  if (promo.usagesMax !== null && promo.usagesActuels >= promo.usagesMax)
    throw new CodePromoError('Code promo épuisé');

  return promo;
};

export const getCodesPromo = async () => {
  return prisma.codePromo.findMany({ orderBy: { creeLe: 'desc' } });
}

export const createCodePromo = async (data: {
  code: string;
  pourcentage: number;
  dateExpiration?: Date | null;
  usagesMax?: number | null;
}) => {
  try {
    return await prisma.codePromo.create({
      data: {
        code: data.code,
        pourcentage: data.pourcentage,
        dateExpiration: data.dateExpiration ?? null,
        usagesMax: data.usagesMax ?? null,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw new CodePromoError('Ce code existe déjà');
    }
    throw e;
  }
}

export const updateCodePromo = async(
  id: number,
  data: { actif?: boolean; dateExpiration?: Date | null; usagesMax?: number | null },
) => {
  return prisma.codePromo.update({ where: { id }, data });
}

export const deleteCodePromo = async (id: number) => {
  return prisma.codePromo.update({
    where: { id },
    data: { actif: false }
  });
};