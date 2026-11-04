// frontend/src/services/admin/rapport.service.ts

import { request } from '../api.service';

export type TypeRapport = 'hebdomadaire' | 'mensuel' | 'personnalise';

export interface DetailProduitFormule {
  produit: string;
  quantite: number;
  tauxTva: number;
  totalHt: number;
  montantTva: number;
  totalTtc: number;
}

export interface LigneFormule extends LigneRapport {
  detail: DetailProduitFormule[];
}

export interface LigneRapport {
  produit: string;
  quantite: number;
  prixUnitaireTtc: number;
  totalHt: number;
  tauxTva: number | null;
  montantTva: number;
  totalTtc: number;
  moyenPaiement: string;
}

export interface ParamsPeriode {
  date?: string;   // YYYY-MM-DD, pour hebdo/mensuel
  debut?: string;  // YYYY-MM-DD, pour personnalisé
  fin?: string;
}

export interface TotauxRapport {
  quantite: number;
  totalHt: number;
  totalTva: number;
  totalTtc: number;
}

export interface LigneRapport {
  produit: string;
  quantite: number;
  prixUnitaireTtc: number;
  totalHt: number;
  tauxTva: number | null;
  montantTva: number;
  totalTtc: number;
  moyenPaiement: string;
}

export interface RapportVentes {
  type: TypeRapport;
  periode: { label: string; debut: string; fin: string };
  unite: { lignes: LigneRapport[]; totaux: TotauxRapport };
  formules: { lignes: LigneRapport[]; totaux: TotauxRapport };
  global: TotauxRapport & { nombreCommandes: number; nombreRemboursees: number };
}

function construireQuery(params: ParamsPeriode) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v && q.set(k, v));
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const getRapport = (type: TypeRapport, params: ParamsPeriode) =>
  request<RapportVentes>(`/rapports/${type}${construireQuery(params)}`);

/** Télécharge le fichier Excel via fetch pour envoyer le cookie d'auth */
export async function telechargerRapportExcel(type: TypeRapport, params: ParamsPeriode) {
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(
    `${API_URL}/rapports/${type}/excel${construireQuery(params)}`,
    { credentials: 'include' },
  );
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? 'Échec du téléchargement');
  }

  const blob = await res.blob();
  const match = res.headers.get('Content-Disposition')?.match(/filename="(.+)"/);
  const nom = match?.[1] ?? `rapport-${type}.xlsx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nom;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}