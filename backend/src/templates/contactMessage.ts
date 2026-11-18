// backend/src/templates/contactMessage.ts

import { emailInfo } from '../utils/emailInfo';

export type DonneesContact = {
  name: string;
  email: string;
  message: string;
  sujet: string;
};

/** Encode un texte utilisateur avant interpolation dans le HTML de l'email. */
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    };
    return entities[character];
  });
}

export function templateContactMessage(d: DonneesContact): string {
  const name = escapeHtml(d.name);
  const email = escapeHtml(d.email);
  const message = escapeHtml(d.message).replace(/\r\n|\r|\n/g, '<br />');
  const sujet = escapeHtml(d.sujet);

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${sujet}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#fff;border-radius:12px;overflow:hidden;">
        <tr><td style="background-color:#001311;padding:28px 24px;text-align:center;">
          <h1 style="margin:0;color:#b88531;font-size:25px;">${escapeHtml(emailInfo.nomBoutique)}</h1>
          <p style="margin:8px 0 0;color:#efe7dc;font-size:14px;">Nouveau message depuis le formulaire de contact</p>
        </td></tr>
        <tr><td style="padding:28px 24px 8px;color:#222;">
          <p style="margin:0 0 12px;font-size:15px;"><strong>Nom :</strong> ${name}</p>
          <p style="margin:0 0 20px;font-size:15px;"><strong>Email :</strong> <a href="mailto:${email}" style="color:#8b6427;">${email}</a></p>
          <h2 style="margin:0 0 10px;font-size:17px;">Message</h2>
          <div style="padding:16px;background:#f8f6f2;border-radius:8px;color:#444;font-size:15px;line-height:1.7;overflow-wrap:anywhere;">${message}</div>
        </td></tr>
        <tr><td style="padding:20px 24px;color:#888;font-size:12px;text-align:center;border-top:1px solid #eee;">
          Vous pouvez répondre directement à cet email pour contacter ${name}.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
