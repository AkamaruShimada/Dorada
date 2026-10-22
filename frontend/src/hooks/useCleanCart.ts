// frontend/src/hooks/useCleanCart

import { useEffect, useMemo } from 'react';
import { useCart, getLigneId } from '../contexts/CartContext';
import type { Empanada, Extra, Formule } from '../types/admin.types';
import { ligneValide } from '../utils/disponibilite';

interface Catalogue {
  empanadas: Empanada[];
  extras: Extra[];
  formules: Formule[];
}

/**
 * Retire du panier les lignes qui ne sont plus valides.
 * Ne s'exécute qu'une fois le catalogue chargé (pas avant).
 */
function useCleanCart(catalogue: Catalogue | null) {
  const { items, remove } = useCart();

  const empanadasParId = useMemo(
    () => new Map((catalogue?.empanadas ?? []).map((p) => [p.id, p])),
    [catalogue],
  );
  const extrasParId = useMemo(
    () => new Map((catalogue?.extras ?? []).map((p) => [p.id, p])),
    [catalogue],
  );
  const formulesIds = useMemo(
    () => new Set((catalogue?.formules ?? []).filter((f) => f.actif).map((f) => f.id)),
    [catalogue],
  );

  useEffect(() => {
    if (!catalogue) return;

    for (const item of items) {
      if (!ligneValide(item, empanadasParId, extrasParId, formulesIds)) {
        remove(getLigneId(item));
      }
    }
  }, [catalogue, items, empanadasParId, extrasParId, formulesIds, remove]);
}

export default useCleanCart