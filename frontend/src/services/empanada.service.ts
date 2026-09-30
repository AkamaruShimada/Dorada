// frontend/src/services/empanada.service.ts

import type { Empanada } from '../types/admin.types';

const API_URL = import.meta.env.VITE_API_URL;

export async function getEmpanadas(): Promise<Empanada[]> {
  const response = await fetch(`${API_URL}/empanadas`, {
  });

  if (!response.ok) {
    throw new Error('Impossible de récupérer les empanadas');
  }

  return response.json();
}