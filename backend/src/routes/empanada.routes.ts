// backend/src/routes/empanada.routes.ts

import { Router } from 'express';
import * as empanadaController from '../controllers/empanada.controller';
import { validate } from '../middlewares/validate.middleware';
import { createEmpanadaSchema, updateEmpanadaSchema } from '../schemas/empanada.schema';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.get('/', empanadaController.getAllEmpanadas);

router.get('/:id', empanadaController.getEmpanadaById);
router.post('/admin', authenticate, isAdmin, upload.single('image'), validate(createEmpanadaSchema), empanadaController.createEmpanada);
router.put('/admin/:id', authenticate, isAdmin, upload.single('image'), validate(updateEmpanadaSchema), empanadaController.updateEmpanada);
router.delete('/admin/:id', authenticate, isAdmin, empanadaController.deleteEmpanada);

export default router;