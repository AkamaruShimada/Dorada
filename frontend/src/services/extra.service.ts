// frontend/src/services/extra.service.ts

import type { Extra } from '../types/admin.types';
import { request } from './api.service';

export const getExtras = () => request<Extra[]>('/extras');