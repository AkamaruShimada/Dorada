// backend/src/schemas/contact.schema.ts

import { z } from 'zod';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SUJETS_CONTACT = [
  'commande',
  'remboursement',
  'allergies',
  'autre',
] as const;

const sujetContactSchema = z.enum(SUJETS_CONTACT, { error: 'Veuillez choisir un sujet.' })

export type SujetContact = z.infer<typeof sujetContactSchema>;

/** Validation du formulaire de contact; les trim reflètent le traitement historique. */
export const contactSchema = z.object({
  name: z.string('Le nom est requis.' )
    .trim()
    .min(1, 'Le nom est requis.')
    .max(120, 'Le nom ne peut pas dépasser 120 caractères.'),
  email: z.string("L'adresse email est requise.")
    .trim()
    .min(1, "L'adresse email est requise.")
    .max(254, 'Adresse email invalide.')
    .regex(EMAIL_PATTERN, 'Adresse email invalide.'),
  message: z.string('Le message est requis.' )
    .trim()
    .min(1, 'Le message est requis.')
    .max(5000, 'Le message ne peut pas dépasser 5000 caractères.'),
  sujet: sujetContactSchema,
  // Honeypot facultatif, alimenté par le formulaire frontend.
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
