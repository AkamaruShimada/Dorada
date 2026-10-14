// frontend/src/utils/pricing.ts

function parseAmount(value: string): number | null {
  if (value.trim() === '') return null;

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function calculerTtc(prixHt: string, taux: string): string {
  const ht = parseAmount(prixHt);
  const tva = parseAmount(taux);

  if (ht === null || tva === null) return '';

  return (ht * (1 + tva / 100)).toFixed(2);
}

export function calculerHt(prixTtc: string, taux: string): string {
  const ttc = parseAmount(prixTtc);
  const tva = parseAmount(taux);

  if (ttc === null || tva === null) return '';

  const coefficient = 1 + tva / 100;
  if (coefficient <= 0) return '';

  return (ttc / coefficient).toFixed(2);
}