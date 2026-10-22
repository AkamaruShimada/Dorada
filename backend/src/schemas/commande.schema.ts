// backend/src/schemas/commande.schema.ts

import { z } from 'zod';

import { estCreneauValide } from '../utils/horaires';

const quantite = z.number().int().min(1).max(100);

export const createCommandeSchema = z
  .object({
    clientNom: z.string().min(2),
    clientEmail: z.email(),
    clientTelephone: z.string().min(6),
    modeRecuperation: z.enum(['RETRAIT', 'LIVRAISON']),
    adresseLivraison: z.string().min(5).optional(),
    dateSouhaitee: z.iso.datetime().refine((val) => estCreneauValide(new Date(val)), {
      message: 'La date doit respecter le délai minimum de préparation',
    }),
    codePromo: z.string().trim().min(1).max(50).optional(),
    empanadas: z
      .array(z.object({ empanadaId: z.number().int().positive(), quantite }))
      .default([]),
    extras: z
      .array(z.object({ extraId: z.number().int().positive(), quantite }))
      .default([]),
    formules: z.array(
      z.object({
        formuleId: z.number().int().min(1).max(100),
        quantite: z.number().positive(),
        empanadasChoisies: z.array(z.number().int().positive()),
        extrasChoisies: z.array(z.number().int().positive()),
      }),
    ).default([])
  })
  .refine(
    (d) => d.empanadas.length + d.extras.length + d.formules.length > 0,
    { message: 'La commande est vide' },
  )
  .refine((d) => d.modeRecuperation !== 'LIVRAISON' || !!d.adresseLivraison, {
    message: 'Adresse requise pour la livraison',
    path: ['adresseLivraison'],
  });

export type CreateCommandeInput = z.infer<typeof createCommandeSchema>;

export const updateStatutCommandeSchema = z.object({
  statut: z.enum(['RECUPEREE', 'ANNULEE']),
});