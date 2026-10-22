// backend/src/config/commande.config.ts

export const DELAI_MINIMUM_MINUTES = 30;
export const FUSEAU = 'Europe/Paris';

export const HORAIRES: Record<number, { ouverture: string; fermeture: string } | null> = {
  0: { ouverture: '10:00', fermeture: '18:30' },
  1: { ouverture: '10:00', fermeture: '18:30' },
  2: { ouverture: '10:00', fermeture: '18:30' },
  3: { ouverture: '10:00', fermeture: '18:30' },
  4: { ouverture: '10:00', fermeture: '18:30' },
  5: { ouverture: '10:00', fermeture: '18:30' },
  6: { ouverture: '10:00', fermeture: '18:30' },
};