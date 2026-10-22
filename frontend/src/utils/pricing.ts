// frontend/src/utils/pricing.ts

import type { CartItem } from '../types/cart.types';

/** Arrondit au centime près (évite les erreurs de flottants type 1.005) */
export const arrondir = (n: number): number =>
  Math.round((n + Number.EPSILON) * 100) / 100;

/** TTC unitaire à partir du HT : c'est LE calcul de référence */
export const calculerTtc = (prixHt: number, tauxTva: number): number =>
  arrondir(prixHt * (1 + tauxTva / 100));

/** HT à partir d'un TTC (utile seulement à la saisie dans l'admin) */
export const calculerHt = (prixTtc: number, tauxTva: number): number =>
  arrondir(prixTtc / (1 + tauxTva / 100));

/** Total d'une ligne : TTC unitaire arrondi × quantité */
export const totalLigneTtc = (prixHt: number, tauxTva: number, quantite: number): number =>
  arrondir(calculerTtc(prixHt, tauxTva) * quantite);

export const formatPrix = (n: number): string =>
  n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });


export function totalLigne(item: CartItem): number {
  if (item.kind === 'formule') {
    return arrondir(item.prixTtc * item.quantite);
  }
  return totalLigneTtc(item.prixHt, item.tauxTva, item.quantite);
}

export function totalPanierTtc(items: CartItem[]): number {
  return arrondir(items.reduce((s, i) => s + totalLigne(i), 0));
}