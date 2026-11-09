// frontend/src/utils/stock.ts
import type { CartItem } from '../types/cart.types';
import { isFormule } from '../types/cart.types';

export type Categorie = 'empanadas' | 'extras' | 'boissons';

export type Reservations = Record<Categorie, Map<number, number>>;

type ProduitAvecStock = { id: number; stock: number; actif: boolean };

/** Quantité réservée par le panier, par catégorie et par id produit */
export function reservationsPanier(items: CartItem[]): Reservations {
  const res: Reservations = {
    empanadas: new Map(),
    extras: new Map(),
    boissons: new Map(),
  };

  const ajouter = (cat: Categorie, id: number, qte: number) =>
    res[cat].set(id, (res[cat].get(id) ?? 0) + qte);

  for (const item of items) {
    if (isFormule(item)) {
      // Une formule en quantité 2 réserve deux fois ses composants
      for (const e of item.empanadasChoisies) ajouter('empanadas', e.id, item.quantite);
      for (const x of item.extrasChoisis) ajouter('extras', x.id, item.quantite);
      for (const b of item.boissonsChoisies) ajouter('boissons', b.id, item.quantite);
    } else {
      const cat: Categorie | null =
        item.kind === 'empanada' ? 'empanadas'
        : item.kind === 'extra' ? 'extras'
        : item.kind === 'boisson' ? 'boissons'
        : null;
      if (cat) ajouter(cat, item.id, item.quantite);
    }
  }

  return res;
}

/** Stock restant pour un produit, en tenant compte du panier */
export function stockRestant(
  produit: ProduitAvecStock,
  cat: Categorie,
  reservations: Reservations,
): number {
  if (!produit.actif) return 0;
  return Math.max(produit.stock - (reservations[cat].get(produit.id) ?? 0), 0);
}

/** Total vendable d'une catégorie (somme des restants), utile pour les formules */
export function stockVendableCategorie(
  produits: ProduitAvecStock[],
  cat: Categorie,
  reservations: Reservations,
): number {
  return produits.reduce((total, p) => total + stockRestant(p, cat, reservations), 0);
}