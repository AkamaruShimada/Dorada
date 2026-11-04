// backend/src/utils/moyenPaiement.ts

/**
 * Normalise la valeur stockée en base (issue de recupererMoyenPaiement)
 * en libellé lisible pour les rapports.
 */
const LIBELLES: Record<string, string> = {
  card: 'Carte',
  klarna: 'Klarna',
  link: 'Link',
  bancontact: 'Bancontact',
  amazon_pay: 'Amazon Pay',
  paypal: 'PayPal',
  mb_way: 'MB WAY',
  multibanco: 'Multibanco',
  eps: 'EPS',
  ideal: 'iDEAL',
};

export function libelleMoyenPaiement(valeur: string | null | undefined): string {
  if (!valeur) return 'Non renseigné';

  // "Carte VISA", "Carte MASTERCARD"... : on garde la marque
  if (valeur.startsWith('Carte')) return valeur;

  return LIBELLES[valeur] ?? valeur;
}