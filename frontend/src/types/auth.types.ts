// frontend/src/types/auth.types.ts

export type TypeCompte = 'UTILISATEUR' | 'CLIENT';

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYE'; // uniquement pertinent si typeCompte === 'UTILISATEUR'
  typeCompte: TypeCompte;
}

export interface LoginPayload {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  token: string;
  utilisateur: Utilisateur;
}

export interface ApiErrorResponse {
  message: string;
}