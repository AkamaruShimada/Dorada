// frontend/src/services/empanada.service.ts

import type { Empanada } from '../types/admin.types';
import { request } from './api.service';

export const getEmpanadas = () => request<Empanada[]>('/empanadas');