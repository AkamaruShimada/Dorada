// frontend/src/services/admin/boisson.service.ts

import type { Boisson } from '../../types/admin.types';
import { request } from '../api.service';

export const getAllBoissons = () => request<Boisson[]>('/boissons');

export const createBoisson = (formData: FormData) =>
  request<Boisson>('/boissons/admin', { method: 'POST', body: formData });

export const updateBoisson = (id: number, formData: FormData) =>
  request<Boisson>(`/boissons/admin/${id}`, { method: 'PUT', body: formData });

export const deleteBoisson = (id: number) =>
  request<void>(`/boissons/admin/${id}`, { method: 'DELETE' });