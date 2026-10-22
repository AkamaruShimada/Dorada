// frontend/src/services/admin/empanada.service.ts

import type { Empanada } from '../../types/admin.types';
import { request } from '../api.service';

export const getAllEmpanadas = () => request<Empanada[]>('/empanadas');

export const createEmpanada = (formData: FormData) =>
  request<Empanada>('/empanadas/admin', { method: 'POST', body: formData });

export const updateEmpanada = (id: number, formData: FormData) =>
  request<Empanada>(`/empanadas/admin/${id}`, { method: 'PUT', body: formData });

export const deleteEmpanada = (id: number) =>
  request<void>(`/empanadas/admin/${id}`, { method: 'DELETE' });