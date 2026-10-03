// backend/src/schemas/empanada.schema.ts

import { z } from 'zod';

// Transforme une string "true"/"false" (venant de FormData) en vrai booléen
const booleanFromFormData = z
  .union([z.boolean(), z.string()])
  .transform((val) => {
    if (typeof val === 'boolean') return val;
    return val === 'true';
  });

export const createEmpanadaSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().min(5, 'La description est trop courte'),
  prix: z.coerce.number().positive('Le prix doit être positif'),
  type: z.enum(['SALEE', 'SUCREE', 'VEGETARIEN']),
  sansGluten: booleanFromFormData.default(false),
  stock: z.coerce.number().int().nonnegative().default(0),
  actif: booleanFromFormData.default(true),
});

// Pour la mise à jour : tous les champs optionnels
// backend/src/schemas/empanada.schema.ts
export const updateEmpanadaSchema = createEmpanadaSchema.partial().extend({
  removeImage: z.coerce.boolean().optional(),
});

export type CreateEmpanadaInput = z.infer<typeof createEmpanadaSchema>;
export type UpdateEmpanadaInput = z.infer<typeof updateEmpanadaSchema>;