// backend/src/routes/empanada.routes.ts

import { Router } from 'express';
import * as empanadaController from '../controllers/empanada.controller';
import { validate } from '../middlewares/validate.middleware';
import { createEmpanadaSchema, updateEmpanadaSchema } from '../schemas/empanada.schema';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', empanadaController.getAllEmpanadas);
router.get('/admin', authenticate, isAdmin, empanadaController.getAllEmpanadasAdmin);

router.get('/:id', empanadaController.getEmpanadaById);
router.post('/', authenticate, isAdmin, validate(createEmpanadaSchema), empanadaController.createEmpanada);
router.put('/:id', authenticate, isAdmin, validate(updateEmpanadaSchema), empanadaController.updateEmpanada);
router.delete('/:id', authenticate, isAdmin, empanadaController.deleteEmpanada);

export default router;