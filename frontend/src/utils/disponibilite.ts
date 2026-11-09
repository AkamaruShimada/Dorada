// frontend/src/utils/disponibilite

import type { Boisson, Empanada, Extra } from '../types/admin.types';
import type { CartItem, FormuleCartItem } from '../types/cart.types';
import { isFormule } from '../types/cart.types';

export const empanadaDisponible = (e: Empanada): boolean => e.actif && e.stock > 0;
export const extraDisponible = (x: Extra): boolean => x.actif && x.stock > 0;
export const boissonDisponible = (b: Boisson): boolean => b.actif && b.stock > 0;

/** Une ligne du panier est-elle encore valable au regard du catalogue actuel ? */
export function ligneValide(
  item: CartItem,
  empanadas: Map<number, Empanada>,
  extras: Map<number, Extra>,
  boissons: Map<number, Boisson>,
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

  if (item.kind === 'boisson') {
    const p = boissons.get(item.id);
    return !!p && boissonDisponible(p);
  }

  // Ici TypeScript n'a pas réduit le type sans le garde explicite
  if (isFormule(item)) {
    return isFormuleValide(item, empanadas, extras, boissons, formulesIds);
  }

  return false;
}

function isFormuleValide(
  item: FormuleCartItem,
  empanadas: Map<number, Empanada>,
  extras: Map<number, Extra>,
  boissons: Map<number, Boisson>,
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
  const boissonsOk = item.boissonsChoisies.every((s) => {
    const p = boissons.get(s.id);
    return !!p && boissonDisponible(p);
  });

  return empanadasOk && extrasOk && boissonsOk;
}