// backend/src/routes/extra.routes.ts

import { Router } from 'express';
import * as extraController from '../controllers/extra.controller';
import { validate } from '../middlewares/validate.middleware';
import { createExtraSchema, updateExtraSchema } from '../schemas/extra.schema';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';


const router = Router();

router.get('/', extraController.getAllExtras);
router.get('/admin', authenticate, isAdmin, extraController.getAllExtrasAdmin);

router.get('/:id', extraController.getExtraById);
router.post('/', authenticate, isAdmin, validate(createExtraSchema), extraController.createExtra);
router.put('/:id', authenticate, isAdmin, validate(updateExtraSchema), extraController.updateExtra);
router.delete('/:id', authenticate, isAdmin, extraController.deleteExtra);

export default router;