// backend/src/routes/empanada.routes.ts

import { Router } from 'express';
import * as empanadaController from '../controllers/empanada.controller';
import { validate } from '../middlewares/validate.middleware';
import { createEmpanadaSchema, updateEmpanadaSchema } from '../schemas/empanada.schema';

const router = Router();

router.get('/', empanadaController.getAllEmpanadas);
router.get('/:id', empanadaController.getEmpanadaById);
router.post('/', validate(createEmpanadaSchema), empanadaController.createEmpanada);
router.put('/:id', validate(updateEmpanadaSchema), empanadaController.updateEmpanada);
router.delete('/:id', empanadaController.deleteEmpanada);

export default router;