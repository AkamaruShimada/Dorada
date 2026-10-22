import type { Empanada, Extra, Formule } from './admin.types';

export type ProduitKind = 'empanada' | 'extra';

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
  // Identifie une configuration précise : deux formules identiques
  // avec des choix différents restent deux lignes distinctes.
  ligneId: string;
  id: number;
  nom: string;
  description: string;
  imageUrl: string | null;
  prixTtc: number;
  nombreEmpanadas: number;
  nombreExtras: number;
  empanadasChoisies: { id: number; nom: string }[];
  extrasChoisis: { id: number; nom: string }[];
  quantite: number;
}

export type CartItem = ProduitCartItem | FormuleCartItem;

export const isFormule = (item: CartItem): item is FormuleCartItem =>
  item.kind === 'formule';

export const isProduit = (item: CartItem): item is ProduitCartItem =>
  item.kind !== 'formule';

export type { Empanada, Extra, Formule };