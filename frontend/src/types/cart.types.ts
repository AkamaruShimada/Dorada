import type { Empanada, Extra, Boisson, Formule } from './admin.types';

export type ProduitKind = 'empanada' | 'extra' | 'boisson';

// Dérivés des types admin pour éviter les divergences
export interface ProduitCartItem {
  kind: ProduitKind;
  id: number;
  nom: string;
  description: string;
  imageUrl: string | null;
  prixHt: number;
  tauxTva: number;
  stock: number;
  quantite: number;
}

export interface FormuleCartItem {
  kind: 'formule';
  ligneId: string;
  id: number;
  nom: string;
  description: string;
  imageUrl: string | null;
  prixTtc: number;
  nombreEmpanadas: number;
  nombreExtras: number;
  nombreBoissons: number;
  empanadasChoisies: { id: number; nom: string; supplementFormuleTtc: number }[];
  extrasChoisis: { id: number; nom: string; supplementFormuleTtc: number }[];
  boissonsChoisies: { id: number; nom: string; supplementFormuleTtc: number }[];
  quantite: number;
}

export type CartItem = ProduitCartItem | FormuleCartItem;

export const isFormule = (item: CartItem): item is FormuleCartItem =>
  item.kind === 'formule';

export const isProduit = (item: CartItem): item is ProduitCartItem =>
  item.kind !== 'formule';

export type { Empanada, Extra, Boisson, Formule };