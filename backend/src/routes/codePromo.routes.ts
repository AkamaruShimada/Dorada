// backend/src/routes/codePromo.routes

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as codePromoController from '../controllers/codePromo.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createCodePromoSchema,
  updateCodePromoSchema,
  verifierCodePromoSchema,
} from '../schemas/codePromo.schema';

const router = Router();

// Anti force brute : 10 essais / minute / IP
const verifierLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: 'Trop de tentatives, réessayez dans une minute' },
});

// Public
router.post('/verifier', verifierLimiter, validate(verifierCodePromoSchema), codePromoController.verifierCodePromo);

// Admin
router.get('/admin', authenticate, isAdmin, codePromoController.getCodePromo);
router.post('/admin', authenticate, isAdmin, validate(createCodePromoSchema), codePromoController.createCodePromo);
router.put('/admin/:id', authenticate, isAdmin, validate(updateCodePromoSchema), codePromoController.updateCodePromo);
router.delete('/admin/:id', authenticate, isAdmin, codePromoController.deleteCodePromo);

export default router;