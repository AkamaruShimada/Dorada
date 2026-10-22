// backend/src/schemas/formule.schema.ts

import { z } from "zod";

const booleanFromFormData = z 
  .union([z.boolean(), z.string()])
  .transform((val) => {
    if (typeof val === 'boolean') return val;
    return val === 'true';
  });

export const createFormuleSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().min(1, "La description est requise"),
  prixTtc: z.coerce.number().positive("Le prix doit être supérieur à 0"),
  nombreEmpanadas: z.coerce.number().int().positive("Le nombre d'empanadas doit être supérieur à 0"),
  nombreExtras: z.coerce.number().int().min(0, "Le nombre d'extras ne peut pas être négatif").default(0),
  actif: booleanFromFormData.default(true),
});

// Pour la modification, tous les champs deviennent optionnels
export const updateFormuleSchema = createFormuleSchema.partial().extend({
  removeImage: z.coerce.boolean().optional()
});

export type CreateFormuleInput = z.infer<typeof createFormuleSchema>;
export type UpdateFormuleInput = z.infer<typeof updateFormuleSchema>;