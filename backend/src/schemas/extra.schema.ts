import { z } from 'zod';

export const createExtraSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().min(5, 'La description est trop courte'),
  prix: z.number().positive('Le prix doit être positif'),
  type: z.enum(['DOUCEUR', 'BOISSON']),
  stock: z.number().int().nonnegative().optional().default(0),
});

// Pour la mise à jour : tous les champs optionnels
export const updateExtraSchema = createExtraSchema.partial();

export type CreateExtraInput = z.infer<typeof createExtraSchema>;
export type UpdateExtraInput = z.infer<typeof updateExtraSchema>;