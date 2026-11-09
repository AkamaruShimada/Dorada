// backend/src/routes/boisson.routes.ts

import { Router } from 'express';
import * as boissonController from '../controllers/boisson.controller';
import { validate } from '../middlewares/validate.middleware';
import { createBoissonSchema, updateBoissonSchema } from '../schemas/boisson.schema';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';


const router = Router();

router.get('/', boissonController.getAllBoissons);

router.get('/:id', boissonController.getBoissonById);
router.post('/admin', authenticate, isAdmin, upload.single('image'),  validate(createBoissonSchema), boissonController.createBoisson);
router.put('/admin/:id', authenticate, isAdmin, upload.single('image'), validate(updateBoissonSchema), boissonController.updateBoisson);
router.delete('/admin/:id', authenticate, isAdmin, boissonController.deleteBoisson);

export default router;