// frontend/src/services/admin/commande.service.ts

import type { Commande, StatutCommande, MotifRemboursement, Remboursement } from '../../types/admin.types';
import { request } from '../api.service';

export type RemboursementPayload = {
  montant?: number;
  motif: MotifRemboursement;
  commentaire: string;
};

export type StatsJour = {
  nbCommandes: number;
  encaisseBrut: number;
  rembourse: number;
  encaisseNet: number;
  parStatut: Record<string, number>;
};

export const getAllCommandesAdmin = (statut?: StatutCommande) =>
  request<Commande[]>(`/commandes/admin${statut ? `?statut=${statut}` : ''}`);

export const updateStatutCommande = (id: number, statut: StatutCommande) =>
  request<Commande>(`/commandes/admin/${id}/statut`, {
    method: 'PUT',
    body: JSON.stringify({ statut }),
  });

export const rembourserCommande = (id: number, payload: RemboursementPayload) =>
  request<Remboursement>(`/commandes/admin/${id}/rembourser`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getStatsJour = () => request<StatsJour>('/commandes/admin/stats');