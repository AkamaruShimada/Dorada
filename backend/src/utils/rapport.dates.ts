// backend/src/utils/rapport.dates.ts

export interface Periode {
  debut: Date;
  fin: Date;
  label: string;
}

/** Lundi 00:00 → dimanche 23:59:59.999 de la semaine contenant `date` */
export function periodeHebdomadaire(date: Date = new Date()): Periode {
  const jour = date.getDay() === 0 ? 7 : date.getDay(); // dimanche = 7
  const debut = new Date(date);
  debut.setDate(date.getDate() - (jour - 1));
  debut.setHours(0, 0, 0, 0);

  const fin = new Date(debut);
  fin.setDate(debut.getDate() + 6);
  fin.setHours(23, 59, 59, 999);

  const label = `Semaine du ${debut.toLocaleDateString('fr-FR')} au ${fin.toLocaleDateString('fr-FR')}`;
  return { debut, fin, label };
}

/** Premier → dernier jour du mois de `date` */
export function periodeMensuelle(date: Date = new Date()): Periode {
  const debut = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  const fin = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

  const label = debut.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return { debut, fin, label };
}

/** Plage libre : début 00:00, fin 23:59:59.999 (inclus) */
export function periodePersonnalisee(debutStr: string, finStr: string): Periode {
  const debut = new Date(`${debutStr}T00:00:00`);
  const fin = new Date(`${finStr}T23:59:59.999`);

  if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
    throw new Error('Dates invalides');
  }
  if (fin < debut) {
    throw new Error('La date de fin doit être après la date de début');
  }

  const fmt = (d: Date) => d.toLocaleDateString('fr-FR');
  const label = debutStr === finStr
    ? `Le ${fmt(debut)}`
    : `Du ${fmt(debut)} au ${fmt(fin)}`;

  return { debut, fin, label };
}