// backend/src/routes/extra.routes.ts

import { Router } from 'express';
import * as extraController from '../controllers/extra.controller';
import { validate } from '../middlewares/validate.middleware';
import { createExtraSchema, updateExtraSchema } from '../schemas/extra.schema';

const router = Router();

router.get('/', extraController.getAllExtras);
router.get('/:id', extraController.getExtraById);
router.post('/', validate(createExtraSchema), extraController.createExtra);
router.put('/:id', validate(updateExtraSchema), extraController.updateExtra);
router.delete('/:id', extraController.deleteExtra);

export default router;