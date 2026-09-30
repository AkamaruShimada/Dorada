// frontend/src/types/admin.types.ts

export type TypeEmpanada = 'SALEE' | 'SUCREE' | 'VEGETARIEN';
export type TypeExtra = 'DOUCEUR' | 'BOISSON';

export interface Empanada {
  id: number;
  nom: string;
  description: string;
  prix: number;
  type: TypeEmpanada;
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
  prix: number;
  stock: number;
  actif: boolean;
}

export type ExtraPayload = Omit<Extra, 'id'>;

export interface Formule {
  id: number;
  nom: string;
  description: string;
  prix: number;
  actif: boolean;
  nombreEmpanadas: number;
  nombreExtras: number;
}

export type FormulePayload = Omit<Formule, 'id'>;