// frontend/src/types/admin.types.ts

export type TypeEmpanada = 'SALEE' | 'SUCREE' | 'VEGETARIEN';
export type TypeExtra = 'DOUCEUR' | 'BOISSON';

export interface Empanada {
  id: number;
  nom: string;
  description: string;
  type: TypeEmpanada;
  prixHt: number;
  tauxTva: number;
  sansGluten: boolean;
  stock: number;
  actif: boolean;
  image_url: string;
}

// Payload = ce qu'on envoie à l'API (sans id, généré côté serveur)
export type EmpanadaPayload = Omit<Empanada, 'id'>;

export interface Extra {
  id: number;
  nom: string;
  description: string;
  type: TypeExtra;
  prixHt: number;
  tauxTva: number;
  sansGluten: boolean;
  stock: number;
  actif: boolean;
  image_url: string;
}

export type ExtraPayload = Omit<Extra, 'id'>;

export interface Formule {
  id: number;
  nom: string;
  description: string;
  prixHt: number;
  image_url: string | null;
  actif: boolean;
  nombreEmpanadas: number;
  nombreExtras: number;
}

export type FormulePayload = Omit<Formule, 'id'>;