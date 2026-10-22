// frontend/src/services/admin/codePromo.service.ts

import type {
  CodePromo,
  CodePromoPayload,
  CodePromoUpdatePayload,
} from '../../types/admin.types';
import { request } from '../api.service';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const getAllCodesPromo = () => request<CodePromo[]>('/codes-promo/admin');

export const createCodePromo = (payload: CodePromoPayload) =>
  request<CodePromo>('/codes-promo/admin', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

export const updateCodePromo = (id: number, payload: CodePromoUpdatePayload) =>
  request<CodePromo>(`/codes-promo/admin/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

  export const deleteCodePromo = (id: number) =>
  request<void>(`/codes-promo/admin/${id}`, { method: 'DELETE' });