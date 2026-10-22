    // backend/src/utils/horaires.ts

import { HORAIRES, FUSEAU, DELAI_MINIMUM_MINUTES } from '../config/commande.config';

// Récupère jour de semaine + heure/minute DANS LE FUSEAU DE LA BOUTIQUE,
// indépendamment du fuseau du serveur (souvent UTC en production).
function getPartiesLocales(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: FUSEAU,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const jours = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return {
    jour: jours.indexOf(get('weekday')),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function estCreneauValide(date: Date): boolean {
  if (Number.isNaN(date.getTime())) return false;

  // Délai minimum
  if (date.getTime() < Date.now() + DELAI_MINIMUM_MINUTES * 60 * 1000) return false;

  // Horaires d'ouverture
  const { jour, minutes } = getPartiesLocales(date);
  const horaire = HORAIRES[jour];
  if (!horaire) return false;

  return minutes >= toMinutes(horaire.ouverture) && minutes <= toMinutes(horaire.fermeture);
}