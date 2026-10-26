// backend/src/services/email.service.ts

import { Resend } from 'resend';
import { emailInfo } from '../utils/emailInfo';
import { templateConfirmationCommande, type DonneesCommande } from '../templates/confirmationCommande';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function envoyerConfirmationCommande(
  destinataire: string,
  donnees: DonneesCommande,
) {
  const { error } = await resend.emails.send({
    from: emailInfo.from,
    to: destinataire,
    subject: `Confirmation de commande ${donnees.reference}`,
    html: templateConfirmationCommande(donnees),
  });
  if (error) throw new Error(error.message);
}