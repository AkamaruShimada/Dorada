// frontend/src/contexts/CartContext.tsx

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { CartItem, FormuleCartItem, ProduitCartItem } from '../types/cart.types';
import { totalLigneTtc } from '../utils/pricing';

const STORAGE_KEY = 'empanadas-cart';

type Action =
  | { type: 'ADD_ITEM'; payload: Omit<ProduitCartItem, 'quantite'>; quantite: number }
  | { type: 'ADD_FORMULE'; payload: Omit<FormuleCartItem, 'quantite' | 'ligneId'>; quantite: number }
  | { type: 'SET_QUANTITE'; ligneId: string; quantite: number }
  | { type: 'REMOVE'; ligneId: string }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: CartItem[] };


  /** Clé unique d'une ligne : produit = kind+id, formule = ligneId généré */
export const getLigneId = (item: CartItem): string =>
  item.kind === 'formule' ? item.ligneId : `${item.kind}-${item.id}`;

const genererLigneIdFormule = (f: Omit<FormuleCartItem, 'quantite' | 'ligneId'>): string =>
  `formule-${f.id}-${f.empanadasChoisies.map((e) => e.id).sort().join('.')}-${f.extrasChoisis
    .map((e) => e.id)
    .sort()
    .join('.')}-${crypto.randomUUID()}`;


function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const ligneId = `${action.payload.kind}-${action.payload.id}`;
      const existant = state.find((i) => getLigneId(i) === ligneId);

      if (existant && existant.kind !== 'formule') {
        const nouvelleQuantite = Math.min(existant.quantite + action.quantite, existant.stock);
        return state.map((i) => (getLigneId(i) === ligneId ? { ...i, quantite: nouvelleQuantite } : i));
      }
      return [...state, { ...action.payload, quantite: Math.min(action.quantite, action.payload.stock) }];
    }

    case 'ADD_FORMULE': {
      // Chaque configuration est une nouvelle ligne
      return [
        ...state,
        {
          ...action.payload,
          ligneId: genererLigneIdFormule(action.payload),
          quantite: action.quantite,
        },
      ];
    }

    case 'SET_QUANTITE':
      return state
        .map((i) => {
          if (getLigneId(i) !== action.ligneId) return i;
          const max = i.kind === 'formule' ? 100 : i.stock;
          return { ...i, quantite: Math.max(0, Math.min(action.quantite, max)) };
        })
        .filter((i) => i.quantite > 0);

    case 'REMOVE':
      return state.filter((i) => getLigneId(i) !== action.ligneId);

    case 'CLEAR':
      return [];

    case 'HYDRATE':
      return action.items;

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<ProduitCartItem, 'quantite'>, quantite?: number) => void;
  addFormule: (item: Omit<FormuleCartItem, 'quantite' | 'ligneId'>, quantite?: number) => void;
  setQuantite: (ligneId: string, quantite: number) => void;
  remove: (ligneId: string) => void;
  clear: () => void;
  nombreArticles: number;
  totalTtc: number
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, [], () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem: (item, quantite = 1) => dispatch({ type: 'ADD_ITEM', payload: item, quantite }),
      addFormule: (item, quantite = 1) => dispatch({ type: 'ADD_FORMULE', payload: item, quantite }),
      setQuantite: (ligneId, quantite) => dispatch({ type: 'SET_QUANTITE', ligneId, quantite }),
      remove: (ligneId) => dispatch({ type: 'REMOVE', ligneId }),
      clear: () => dispatch({ type: 'CLEAR' }),
      nombreArticles: items.reduce((s, i) => s + i.quantite, 0),
      totalTtc: items.reduce((somme, item) => {
        const ligne =
          item.kind === 'formule'
            ? item.prixTtc * item.quantite
            : totalLigneTtc(item.prixHt, item.tauxTva, item.quantite);
        return somme + ligne;
      }, 0),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans un CartProvider');
  return ctx;
}