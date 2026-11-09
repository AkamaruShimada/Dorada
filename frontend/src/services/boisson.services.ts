// frontend/src/services/boisson.service.ts

import type { Boisson } from '../types/admin.types';
import { request } from './api.service';

export const getBoissons = () => request<Boisson[]>('/boissons');