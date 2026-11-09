// backend/src/services/formule.validation.ts

import type { CibleQuota, TypeEmpanada, TypeExtra } from "@prisma/client";

export type QuotaFormule = {
  cible: CibleQuota;
  typeEmpanada: TypeEmpanada | null;
  typeExtra: TypeExtra | null;
  quantite: number;
};

export type ProduitChoisi = {
  id: number;
  cible: CibleQuota;
  type: TypeEmpanada | TypeExtra;
};

const cleDe = (cible: CibleQuota, type: string) => `${cible}:${type}`;

const cleQuota = (q: QuotaFormule) =>
  cleDe(q.cible, (q.cible === "EMPANADA" ? q.typeEmpanada : q.typeExtra) ?? "");

/**
 * Renvoie la liste des erreurs. Tableau vide = choix valide.
 */
export function validerChoixFormule(quotas: QuotaFormule[], choix: ProduitChoisi[]): string[] {
  const erreurs: string[] = [];

  const attendus = new Map<string, number>();
  for (const q of quotas) attendus.set(cleQuota(q), q.quantite);

  const recus = new Map<string, number>();
  for (const c of choix) {
    const cle = cleDe(c.cible, c.type);
    recus.set(cle, (recus.get(cle) ?? 0) + 1);
  }

  for (const [cle, attendu] of attendus) {
    const recu = recus.get(cle) ?? 0;
    if (recu !== attendu) erreurs.push(`${cle} : attendu ${attendu}, reçu ${recu}`);
  }

  for (const cle of recus.keys()) {
    if (!attendus.has(cle)) erreurs.push(`${cle} non autorisé pour cette formule`);
  }

  return erreurs;
}