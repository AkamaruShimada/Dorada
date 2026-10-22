//backend/src/schemas/codePromo.schema

import { z } from 'zod';

export const createCodePromoSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, 'Le code doit faire au moins 3 caractères')
    .max(30)
    .regex(/^[A-Za-z0-9_-]+$/, 'Lettres, chiffres, - et _ uniquement')
    .transform((v) => v.toUpperCase()),
  pourcentage: z.coerce.number().min(1).max(99),
  dateExpiration: z.coerce.date().optional().nullable(),
  usagesMax: z.coerce.number().int().min(1).optional().nullable(),
});

export const updateCodePromoSchema = z.object({
  actif: z.boolean().optional(),
  dateExpiration: z.coerce.date().optional().nullable(),
  usagesMax: z.coerce.number().int().min(1).optional().nullable(),
});

export const verifierCodePromoSchema = z.object({
  code: z.string().trim().min(1).max(50),
});