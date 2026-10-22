import { useState } from 'react';
import { calculerHt, calculerTtc } from '../utils/pricing';

type InitialPrix = {
  prixHt?: number;
  tauxTva?: number;
};

// "12,5" ou "12.5" -> 12.5 ; "" ou "abc" -> null
function parseDecimal(value: string): number | null {
  const normalise = value.replace(',', '.').trim();
  if (normalise === '') return null;
  const n = Number(normalise);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

// 12.5 -> "12,5" (affichage à la française)
function versTexte(n: number): string {
  return String(n).replace('.', ',');
}

// Autorise uniquement chiffres + un seul séparateur, point converti en virgule
function nettoyerSaisie(value: string): string | null {
  const v = value.replace('.', ',');
  return /^\d*,?\d*$/.test(v) ? v : null; // null = saisie refusée
}

export function usePrice(initialData?: InitialPrix | null) {
  const htInitial = initialData?.prixHt ?? 0;
  const tvaInitiale = initialData?.tauxTva ?? 5.5;

  const [prixHtTexte, setPrixHtTexte] = useState(() => versTexte(htInitial));
  const [tauxTvaTexte, setTauxTvaTexte] = useState(() => versTexte(tvaInitiale));
  const [prixTtcTexte, setPrixTtcTexte] = useState(() =>
    versTexte(calculerTtc(htInitial, tvaInitiale)),
  );

  // Valeurs numériques (null si le champ est vide ou invalide)
  const prixHt = parseDecimal(prixHtTexte);
  const tauxTva = parseDecimal(tauxTvaTexte);
  const prixTtc = parseDecimal(prixTtcTexte);

  function handlePrixHtChange(value: string) {
    const saisie = nettoyerSaisie(value);
    if (saisie === null) return;
    setPrixHtTexte(saisie);

    const ht = parseDecimal(saisie);
    if (ht !== null && tauxTva !== null) {
      setPrixTtcTexte(versTexte(calculerTtc(ht, tauxTva)));
    }
  }

  function handlePrixTtcChange(value: string) {
    const saisie = nettoyerSaisie(value);
    if (saisie === null) return;
    setPrixTtcTexte(saisie);

    const ttc = parseDecimal(saisie);
    if (ttc !== null && tauxTva !== null) {
      setPrixHtTexte(versTexte(calculerHt(ttc, tauxTva)));
    }
  }

  function handleTauxTvaChange(value: string) {
    const saisie = nettoyerSaisie(value);
    if (saisie === null) return;
    setTauxTvaTexte(saisie);

    const tva = parseDecimal(saisie);
    if (tva !== null && prixHt !== null) {
      setPrixTtcTexte(versTexte(calculerTtc(prixHt, tva)));
    }
  }

  return {
    // Textes pour les inputs
    prixHtTexte,
    prixTtcTexte,
    tauxTvaTexte,
    // Nombres pour les calculs et l'envoi (null si vide ou invalide)
    prixHt,
    prixTtc,
    tauxTva,
    handlePrixHtChange,
    handlePrixTtcChange,
    handleTauxTvaChange,
  };
}