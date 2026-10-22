// backend/src/utils/pricing.ts
import { Prisma } from '@prisma/client';

const Decimal = Prisma.Decimal;
export type Dec = Prisma.Decimal;
const ZERO = new Decimal(0);
const CENT = new Decimal(100);

/** Arrondi monétaire explicite (half-up), sans flottants JS. */
export const arrondir = (d: Dec): Dec => d.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
export const toCents = (d: Dec): number => d.times(CENT).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
export const dec = (v: unknown): Dec => new Decimal(String(v));

/** TTC unitaire arrondi : LE calcul de référence (c'est ce que Stripe reçoit) */
export const calculerTtcUnitaire = (prixHt: Dec, tauxTva: Dec): Dec =>
  arrondir(prixHt.times(new Decimal(1).plus(tauxTva.div(100))));

export interface LigneCalculee {
  ttcUnitaire: Dec;
  totalTtc: Dec;
  totalHt: Dec;
  totalTva: Dec;
}

export function calculerLigne(prixHt: Dec, tauxTva: Dec, quantite: number): LigneCalculee {
  const ttcUnitaire = calculerTtcUnitaire(prixHt, tauxTva);
  const totalTtc = ttcUnitaire.times(quantite);     // exact : pas besoin d'arrondir
  const totalHt = arrondir(prixHt.times(quantite)); // pour la comptabilité
  const totalTva = totalTtc.minus(totalHt);         // la TVA absorbe le reste, TTC reste exact
  return { ttcUnitaire, totalTtc, totalHt, totalTva };
}

export interface ComposantFormule {
  prixHt: Dec;
  tauxTva: Dec;
  supplementTtc: Dec
}

export interface LigneFormule {
  totalTtc: Dec;
  totalHt: Dec;
  totalTva: Dec;
  tauxTva: Dec;
}

/**
 * Ventile le prix fixe TTC d'une formule sur ses composants, au prorata de leur valeur catalogue TTC.
 * Le dernier composant prend le reliquat : la somme tombe exactement sur le prix fixe.
 */
export function ventilerFormule(prixFixeTtc: Dec, composants: ComposantFormule[]) {
  if (composants.length === 0) return [] as { ttcVentile: Dec; tauxTva: Dec }[];
  const valeurs = composants.map((c) => calculerTtcUnitaire(c.prixHt, c.tauxTva).plus(c.supplementTtc));
  const cible = prixFixeTtc.plus(composants.reduce((s, c) => s.plus(c.supplementTtc), ZERO));
  const totalValeur = valeurs.reduce((s, v) => s.plus(v), ZERO);
  if (totalValeur.isZero()) throw new Error('Impossible de ventiler une formule sans valeur théorique');

  let cumul = ZERO;
  return composants.map((c, i) => {
    const ttcVentile = i === composants.length - 1
      ? cible.minus(cumul)
      : arrondir(cible.times(valeurs[i]).div(totalValeur));
    cumul = cumul.plus(ttcVentile);
    return { ttcVentile, tauxTva: c.tauxTva };
  });
}


/** Lignes unitaires de formule; la somme TTC vaut prix fixe + suppléments. */
export function calculerFormule(prixFixeTtc: Dec, choix: ComposantFormule[]): LigneFormule[] {
  return ventilerFormule(prixFixeTtc, choix).map((v) => {
    const totalHt = arrondir(v.ttcVentile.div(new Decimal(1).plus(v.tauxTva.div(100))));
    return { totalTtc: v.ttcVentile, totalHt, totalTva: v.ttcVentile.minus(totalHt), tauxTva: v.tauxTva };
  });
}

export function multiplierLigne(l: LigneFormule, quantite: number): LigneFormule {
  return {
    tauxTva: l.tauxTva,
    totalTtc: l.totalTtc.times(quantite),
    totalHt: l.totalHt.times(quantite),
    totalTva: l.totalTva.times(quantite),
  };
}
