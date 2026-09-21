// backend/src/types/express.d.ts

import { RoleUtilisateur } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: RoleUtilisateur;
      };
    }
  }
}

// Nécessaire pour que TypeScript traite ce fichier comme un module
// et non comme un script global — sinon `declare global` plante
export {};