// backend/src/routes/extra.routes.ts

import { Router } from 'express';
import * as extraController from '../controllers/extra.controller';
import { validate } from '../middlewares/validate.middleware';
import { createExtraSchema, updateExtraSchema } from '../schemas/extra.schema';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';


const router = Router();

router.get('/', extraController.getAllExtras);

router.get('/:id', extraController.getExtraById);
router.post('/admin', authenticate, isAdmin, upload.single('image'),  validate(createExtraSchema), extraController.createExtra);
router.put('/admin/:id', authenticate, isAdmin, upload.single('image'), validate(updateExtraSchema), extraController.updateExtra);
router.delete('/admin/:id', authenticate, isAdmin, extraController.deleteExtra);

export default router;