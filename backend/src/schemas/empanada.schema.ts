// backend/src/schemas/empanada.schema.ts

import { z } from 'zod';

export const createEmpanadaSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().min(5, 'La description est trop courte'),
  prix: z.number().positive('Le prix doit être positif'),
  type: z.enum(['SALEE', 'SUCREE', 'VEGETARIEN']),
  sansGluten: z.boolean().default(false),
  stock: z.number().int().nonnegative().default(0),
  actif: z.boolean().default(true),
});

// Pour la mise à jour : tous les champs optionnels
export const updateEmpanadaSchema = createEmpanadaSchema.partial();

export type CreateEmpanadaInput = z.infer<typeof createEmpanadaSchema>;
export type UpdateEmpanadaInput = z.infer<typeof updateEmpanadaSchema>;