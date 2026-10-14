// frontend/src/hooks/usePrice.ts

import { useState } from 'react';
import { calculerHt, calculerTtc } from '../utils/pricing';

type InitialPrix = {
  prixHt?: number;
  tauxTva?: number;
};

export function usePrice(initialData?: InitialPrix | null) {
  const [prixHt, setPrixHt] = useState(() =>
    String(initialData?.prixHt ?? 0)
  );

  const [tauxTva, setTauxTva] = useState(() =>
    String(initialData?.tauxTva ?? 5.5)
  );

  const [prixTtc, setPrixTtc] = useState(() =>
    calculerTtc(
      String(initialData?.prixHt ?? 0),
      String(initialData?.tauxTva ?? 5.5)
    )
  );

  function handlePrixHtChange(value: string) {
    setPrixHt(value);
    setPrixTtc(calculerTtc(value, tauxTva));
  }

  function handlePrixTtcChange(value: string) {
    setPrixTtc(value);
    setPrixHt(calculerHt(value, tauxTva));
  }

  function handleTauxTvaChange(value: string) {
    setTauxTva(value);
    setPrixTtc(calculerTtc(prixHt, value));
  }

  return {
    prixHt,
    prixTtc,
    tauxTva,
    handlePrixHtChange,
    handlePrixTtcChange,
    handleTauxTvaChange,
  };
}