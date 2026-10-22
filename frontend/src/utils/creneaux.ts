// frontend/src/utils/creneaux.ts

import {
  DELAI_MINIMUM_MINUTES,
  PAS_CRENEAU_MINUTES,
  JOURS_RESERVABLES,
  HORAIRES,
} from './commande.config';

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

// "YYYY-MM-DD" en heure locale (pas en UTC !)
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Retourne les créneaux (Date) disponibles pour un jour donné
export function getCreneauxPourJour(dateKey: string, now: Date = new Date()): Date[] {
  const [y, mo, d] = dateKey.split('-').map(Number);
  const jour = new Date(y, mo - 1, d);
  const horaire = HORAIRES[jour.getDay()];
  if (!horaire) return []; // jour fermé

  const debut = toMinutes(horaire.ouverture);
  const fin = toMinutes(horaire.fermeture);
  const limite = now.getTime() + DELAI_MINIMUM_MINUTES * 60 * 1000;

  const creneaux: Date[] = [];
  for (let min = debut; min <= fin; min += PAS_CRENEAU_MINUTES) {
    const creneau = new Date(y, mo - 1, d, Math.floor(min / 60), min % 60, 0, 0);
    if (creneau.getTime() >= limite) creneaux.push(creneau);
  }
  return creneaux;
}

// Liste des jours proposés (ceux qui ont au moins un créneau libre)
export function getJoursDisponibles(now: Date = new Date()): { key: string; label: string }[] {
  const jours: { key: string; label: string }[] = [];

  for (let i = 0; i < JOURS_RESERVABLES; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const key = toDateKey(d);
    if (getCreneauxPourJour(key, now).length === 0) continue; // fermé ou trop tard

    jours.push({
      key,
      label: d.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
    });
  }
  return jours;
}

export function formatHeure(d: Date): string {
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}