// frontend/src/services/email.service.ts

import { request } from './api.service';

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  sujet: string;
  website: string; // honeypot : doit rester vide
};

export const envoyerMessageContact = (payload: ContactPayload) =>
  request<{ ok: true }>('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });