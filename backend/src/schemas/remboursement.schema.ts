// backend/src/schemas/remboursement.schema.ts
import { z } from 'zod';

export const createRemboursementSchema = z.object({
  montant: z.number().positive().multipleOf(0.01).optional(), // absent = remboursement du solde
  motif: z.enum([
    'STOCK_INSUFFISANT',
    'CAPACITE_DEPASSEE',
    'ERREUR_COMMANDE',
    'GESTE_COMMERCIAL',
    'AUTRE',
  ]),
  commentaire: z
    .string({ error : 'Le commentaire est obligatoire' })
    .trim()
    .min(1, 'Le commentaire est obligatoire')
    .max(500),
});

export type CreateRemboursementInput = z.infer<typeof createRemboursementSchema>;