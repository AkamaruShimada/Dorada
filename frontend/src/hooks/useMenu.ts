import { useCallback, useEffect, useState } from 'react';
import { getEmpanadas } from '../services/empanada.service';
import { getExtras } from '../services/extra.service';
import { getFormules } from '../services/formule.service';
import type { Empanada, Extra, Formule } from '../types/admin.types';

export interface Catalogue {
  empanadas: Empanada[];
  extras: Extra[];
  formules: Formule[];
}

export function useMenu() {
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const charger = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [empanadas, extras, formules] = await Promise.all([
        getEmpanadas(),
        getExtras(),
        getFormules(),
      ]);
      setCatalogue({ empanadas, extras, formules });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  return { catalogue, isLoading, error, reload: charger };
}