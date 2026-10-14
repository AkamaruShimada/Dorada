// frontend/src/services/admin/extra.service.ts

import type { Extra } from '../../types/admin.types';

const API_URL = import.meta.env.VITE_API_URL;

export async function getAllExtrasAdmin(): Promise<Extra[]> {
  const response = await fetch(`${API_URL}/extras/admin`, {
    credentials: 'include', // pour envoyer le cookie d'authentification
  });

  if (!response.ok) {
    throw new Error('Impossible de récupérer les extras');
  }

  return response.json();
}

export async function createExtra(formData: FormData): Promise<Extra> {
  const response = await fetch(`${API_URL}/extras/admin`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la création');
  }

  return response.json();
}

export async function updateExtra(id: number, formData: FormData): Promise<Extra> {
  const response = await fetch(`${API_URL}/extras/admin/${id}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la modification');
  }

  return response.json();
}

export async function deleteExtra(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/extras/admin/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la désactivation');
  }
}