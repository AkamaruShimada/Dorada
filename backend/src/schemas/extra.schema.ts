// backend/src/schemas/extra.schema.ts

import { z } from 'zod';

// Transforme une string "true"/"false" (venant de FormData) en vrai booléen
const booleanFromFormData = z
  .union([z.boolean(), z.string()])
  .transform((val) => {
    if (typeof val === 'boolean') return val;
    return val === 'true';
  });

export const createExtraSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().min(5, 'La description est trop courte'),
  prixHt: z.coerce.number().positive('Le prix doit être positif'),
  tauxTva: z.coerce.number().positive('Le taux doit être être positif'),
  type: z.enum(['DOUCEUR', 'BOISSON']),
  sansGluten: booleanFromFormData.default(false).optional(),
  stock: z.coerce.number().int().nonnegative().default(0),
  actif: booleanFromFormData.default(true),
});

// Pour la mise à jour : tous les champs optionnels
export const updateExtraSchema = createExtraSchema.partial().extend({
  removeImage: z.coerce.boolean().optional(),
});

export type CreateExtraInput = z.infer<typeof createExtraSchema>;
export type UpdateExtraInput = z.infer<typeof updateExtraSchema>;