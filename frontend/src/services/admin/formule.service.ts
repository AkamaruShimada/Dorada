// frontend/src/services/admin/formule.service.ts

import type { Formule } from '../../types/admin.types';
import { request } from '../api.service';

export const getAllFormules = () => request<Formule[]>('/formules');

export const createFormule = (formData: FormData) =>
  request<Formule>('/formules/admin', { method: 'POST', body: formData });

export const updateFormule = (id: number, formData: FormData) =>
  request<Formule>(`/formules/admin/${id}`, { method: 'PUT', body: formData });

export const deleteFormule = (id: number) =>
  request<void>(`/formules/admin/${id}`, { method: 'DELETE' });