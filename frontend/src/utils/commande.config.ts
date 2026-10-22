// frontend/src/utils/commande.config.ts

export const DELAI_MINIMUM_MINUTES = 30;
export const PAS_CRENEAU_MINUTES = 15;
export const JOURS_RESERVABLES = 14; // jusqu'à combien de jours à l'avance

// Horaires par jour : 0 = dimanche, 1 = lundi, ... 6 = samedi
// null = fermé. Format "HH:mm".
export const HORAIRES: Record<number, { ouverture: string; fermeture: string } | null> = {
  0: { ouverture: '10:00', fermeture: '18:30' },
  1: { ouverture: '10:00', fermeture: '18:30' },
  2: { ouverture: '10:00', fermeture: '18:30' },
  3: { ouverture: '10:00', fermeture: '18:30' },
  4: { ouverture: '10:00', fermeture: '18:30' },
  5: { ouverture: '10:00', fermeture: '18:30' },
  6: { ouverture: '10:00', fermeture: '18:30' },
};