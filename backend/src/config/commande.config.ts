// backend/src/config/commande.config.ts

export const DELAI_MINIMUM_MINUTES = 30;
export const FUSEAU = 'Europe/Paris';

export const HORAIRES: Record<number, { ouverture: string; fermeture: string } | null> = {
  0: { ouverture: 'null', fermeture: 'null' },
  1: { ouverture: 'null', fermeture: 'null' },
  2: { ouverture: '10:00', fermeture: '14:30' },
  3: { ouverture: '10:00', fermeture: '14:30' },
  4: { ouverture: '10:00', fermeture: '14:30' },
  5: { ouverture: '10:00', fermeture: '14:30' },
  6: { ouverture: 'null', fermeture: 'null' },
};