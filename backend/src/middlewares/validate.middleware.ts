// backend/src/middlewares/validate.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Middleware générique de validation Zod.
 * Prend n'importe quel schéma Zod et l'applique à req.body.
 * Si la validation échoue -> 400 avec le détail des erreurs.
 * Si elle réussit -> req.body est remplacé par la donnée parsée/typée
 * (utile car Zod peut transformer les données, ex: valeurs par défaut).
 */
export const validate = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        erreurs: z.flattenError(result.error).fieldErrors,
      });
    }

    req.body = result.data;
    next();
  };
};