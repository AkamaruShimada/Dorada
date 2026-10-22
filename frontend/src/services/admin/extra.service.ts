// frontend/src/services/admin/extra.service.ts

import type { Extra } from '../../types/admin.types';
import { request } from '../api.service';

export const getAllExtras = () => request<Extra[]>('/extras');

export const createExtra = (formData: FormData) =>
  request<Extra>('/extras/admin', { method: 'POST', body: formData });

export const updateExtra = (id: number, formData: FormData) =>
  request<Extra>(`/extras/admin/${id}`, { method: 'PUT', body: formData });

export const deleteExtra = (id: number) =>
  request<void>(`/extras/admin/${id}`, { method: 'DELETE' });