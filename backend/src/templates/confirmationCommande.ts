// backend/src/templates/confirmationCommande.ts

import { emailInfo } from '../utils/emailInfo';

export type DonneesCommande = {
  reference: string;
  nom: string;
  lignes: {
    nom: string;
    quantite: number;
    prixUnitaire: number;
    details?: string[];
  }[];
  sousTotal: number;
  reduction?: number;
  totalTtc: number;
  modeRecuperation?: string;
  dateRecuperation?: string;
};

const euro = (n: number) => `${n.toFixed(2)} ${emailInfo.devise}`;

export function templateConfirmationCommande(d: DonneesCommande): string {
  const lignesHtml = d.lignes
    .map(
      (l) => `
        <tr>
            <td style="padding:12px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;">
            ${l.nom}
            ${l.details && l.details.length > 0
                ? `<div style="margin-top:4px;color:#888;font-size:12px;">
                    ${l.details.join(' · ')}
                </div>`
                : ''}
            </td>
            <td style="padding:12px 0;border-bottom:1px solid #eee;color:#666;font-size:14px;text-align:center;">
            x${l.quantite}
            </td>
            <td style="padding:12px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;text-align:right;">
            ${(l.prixUnitaire * l.quantite).toFixed(2)} €
            </td>
        </tr>`,
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmation de commande ${d.reference}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:24px 12px;">
    <tr>
      <td align="center">

        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;">

          <!-- En-tête -->
          <tr>
            <td style="background-color:#001311;padding:32px 24px;text-align:center;">
              <h1 style="margin:0;color:#b88531;font-size:26px;font-weight:bold;">${emailInfo.nomBoutique}</h1>
              <p style="margin:8px 0 0;color:#efe7dc;font-size:14px;">Confirmation de ta commande</p>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:32px 24px 16px;">
              <h2 style="margin:0 0 12px;color:#222;font-size:20px;">
                Merci${d.nom ? ` ${d.nom}` : ''} pour ta commande !
              </h2>
              <p style="margin:0;color:#555;font-size:15px;line-height:1.6;">
                Ta commande est bien enregistrée et ton paiement a été accepté. On s'occupe de la préparer.
              </p>
            </td>
          </tr>

          <!-- Référence -->
          <tr>
            <td style="padding:0 24px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#efe7dc;border-radius:8px;">
                <tr>
                  <td style="padding:16px;text-align:center;">
                    <p style="margin:0;color:#001311;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Référence</p>
                    <p style="margin:6px 0 0;color:#222;font-size:20px;font-weight:bold;font-family:'Courier New',monospace;">${d.reference}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            d.modeRecuperation || d.dateRecuperation
              ? `
          <!-- Récupération -->
          <tr>
            <td style="padding:0 24px 24px;">
              <p style="margin:0;color:#222;font-size:15px;"><strong>Récupération :</strong> ${d.modeRecuperation ?? ''}</p>
              ${d.dateRecuperation ? `<p style="margin:6px 0 0;color:#555;font-size:15px;">${d.dateRecuperation}</p>` : ''}
            </td>
          </tr>`
              : ''
          }

          <!-- Récapitulatif -->
          <tr>
            <td style="padding:0 24px 8px;">
              <h3 style="margin:0 0 8px;color:#222;font-size:16px;">Récapitulatif</h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${lignesHtml}
              </table>
            </td>
          </tr>

          <!-- Totaux -->
          <tr>
            <td style="padding:16px 24px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:4px 0;color:#666;font-size:14px;">Sous-total</td>
                  <td style="padding:4px 0;text-align:right;color:#666;font-size:14px;">${euro(d.sousTotal)}</td>
                </tr>
                ${
                  d.reduction
                    ? `<tr>
                  <td style="padding:4px 0;color:#2e7d32;font-size:14px;">Réduction</td>
                  <td style="padding:4px 0;text-align:right;color:#2e7d32;font-size:14px;">-${euro(d.reduction)}</td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="padding:12px 0 0;border-top:2px solid #001311;color:#222;font-size:17px;font-weight:bold;">Total TTC</td>
                  <td style="padding:12px 0 0;border-top:2px solid #001311;text-align:right;color:#001311;font-size:17px;font-weight:bold;">${euro(d.totalTtc)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bouton -->
          <tr>
            <td align="center" style="padding:8px 24px 32px;">
              <a href="${emailInfo.siteWeb}" style="display:inline-block;background-color:#001311;color:#b88531;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:15px;font-weight:bold;">
                Retour sur le site
              </a>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="background-color:#fafafa;padding:20px 24px;text-align:center;border-top:1px solid #eee;">
              <p style="margin:0;color:#888;font-size:12px;line-height:1.6;">
                Une question ? Écris-nous à <a href="mailto:${emailInfo.contact}" style="color:#b88531;">${emailInfo.contact}</a>
                ${emailInfo.telephone ? `ou appelle le ${emailInfo.telephone}` : ''}.
              </p>
              <p style="margin:8px 0 0;color:#aaa;font-size:11px;">
                © ${new Date().getFullYear()} ${emailInfo.nomBoutique}. Tous droits réservés.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}