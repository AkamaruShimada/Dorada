// backend/src/controllers/contact.controller.ts

import type { Request, Response } from 'express';
import { envoyerMessageContact } from '../services/email.service';
import type { ContactInput } from '../schemas/contact.schema';

export const envoyerContact = async (req: Request, res: Response): Promise<void> => {
  // validate(contactSchema) est supposé avoir validé req.body; trim conserve le comportement historique.
  const body = req.body as ContactInput;

  // Répondre comme si le message avait été accepté; ne jamais transmettre un bot.
  if (body.website?.trim()) {
    res.status(202).json({ ok: true });
    return;
  }

  try {
    await envoyerMessageContact({
      name: body.name.trim(),
      email: body.email.trim(),
      message: body.message.trim(),
      sujet: body.sujet.trim(),
    });
    res.status(200).json({ ok: true });
  } catch (error) {
    // Détails réservés aux logs serveur; ne pas exposer la clé API ni l'erreur Resend.
    console.error('Échec envoi formulaire contact', error);
    res.status(500).json({ message: "L'envoi du message a échoué. Réessayez plus tard." });
  }
};
