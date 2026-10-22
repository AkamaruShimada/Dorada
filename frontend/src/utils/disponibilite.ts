// frontend/src/utils/disponibilite

import type { Empanada, Extra, Formule } from '../types/admin.types';
import type { CartItem, FormuleCartItem } from '../types/cart.types';
import { isFormule } from '../types/cart.types';

export const empanadaDisponible = (e: Empanada): boolean => e.actif && e.stock > 0;
export const extraDisponible = (x: Extra): boolean => x.actif && x.stock > 0;

/** Une formule est proposable si son actif et s'il reste assez d'empanadas/extras disponibles */
export function formuleProposable(
  formule: Formule,
  empanadas: Empanada[],
  extras: Extra[],
): boolean {
  if (!formule.actif) return false;
  const nbEmpanadas = empanadas.filter(empanadaDisponible).length;
  const nbExtras = extras.filter(extraDisponible).length;
  return nbEmpanadas >= formule.nombreEmpanadas && nbExtras >= formule.nombreExtras;
}

/** Une ligne du panier est-elle encore valable au regard du catalogue actuel ? */
export function ligneValide(
  item: CartItem,
  empanadas: Map<number, Empanada>,
  extras: Map<number, Extra>,
  formulesIds: Set<number>,
): boolean {
  if (item.kind === 'empanada') {
    const p = empanadas.get(item.id);
    return !!p && empanadaDisponible(p);
  }

  if (item.kind === 'extra') {
    const p = extras.get(item.id);
    return !!p && extraDisponible(p);
  }

  // Ici TypeScript n'a pas réduit le type sans le garde explicite
  if (isFormule(item)) {
    return isFormuleValide(item, empanadas, extras, formulesIds);
  }

  return false;
}

function isFormuleValide(
  item: FormuleCartItem,
  empanadas: Map<number, Empanada>,
  extras: Map<number, Extra>,
  formulesIds: Set<number>,
): boolean {
  if (!formulesIds.has(item.id)) return false;

  // Les produits choisis dans la formule doivent encore être disponibles
  const empanadasOk = item.empanadasChoisies.every((s) => {
    const p = empanadas.get(s.id);
    return !!p && empanadaDisponible(p);
  });
  const extrasOk = item.extrasChoisis.every((s) => {
    const p = extras.get(s.id);
    return !!p && extraDisponible(p);
  });

  return empanadasOk && extrasOk;
}