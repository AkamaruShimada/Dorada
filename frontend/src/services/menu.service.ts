// frontend/src/services/menu.service.ts

import { request } from "./api.service";

export interface CheckoutFormule {
  formuleId: number;
  quantite: number;
  empanadasChoisies : number[];
  extrasChoisies : number[];
}

export interface CheckoutPayload {
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  modeRecuperation: 'RETRAIT' | 'LIVRAISON';
  adresseLivraison?: string;
  dateSouhaitee: string;
  codePromo? : string;
  empanadas: { empanadaId: number; quantite: number }[];
  extras: { extraId: number; quantite: number }[];
  formules: CheckoutFormule[];
}

export interface CheckoutResponse { 
  checkoutUrl: string; 
  reference: string 
}

export const createCommande = (payload: CheckoutPayload) => request<CheckoutResponse>(
  '/commandes',
  {method: 'POST', body: JSON.stringify(payload) }
);