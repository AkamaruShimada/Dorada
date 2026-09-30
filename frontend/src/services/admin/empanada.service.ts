// frontend/src/services/admin/empanada.service.ts

import type { Empanada } from '../../types/admin.types';

const API_URL = import.meta.env.VITE_API_URL;

export async function getAllEmpanadasAdmin(): Promise<Empanada[]> {
  const response = await fetch(`${API_URL}/empanadas/admin`, {
    credentials: 'include', // pour envoyer le cookie d'authentification
  });

  if (!response.ok) {
    throw new Error('Impossible de récupérer les empanadas');
  }

  return response.json();
}

export async function createEmpanada(formData: FormData): Promise<Empanada> {
  const response = await fetch(`${API_URL}/empanadas/admin`, {
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

export async function updateEmpanada(id: number, formData: FormData): Promise<Empanada> {
  const response = await fetch(`${API_URL}/empanadas/admin/${id}`, {
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

export async function deleteEmpanada(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/empanadas/admin/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la suppression');
  }
}