// frontend/src/services/auth.service.ts

import type { LoginPayload, LoginResponse, ApiErrorResponse } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL;

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include', // Important pour envoyer les cookies
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json();
    throw new Error(errorData.message || 'Erreur lors de la connexion');
  }

  return response.json();
}