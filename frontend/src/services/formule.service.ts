// frontend/src/services/extra.service.ts

import type { Formule } from '../types/admin.types'
import { request } from './api.service';

export const getFormules = () => request<Formule[]>('/formules');