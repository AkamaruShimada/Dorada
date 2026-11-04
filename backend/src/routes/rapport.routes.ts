// backend/src/routes/rapport.routes.ts

import { Router } from 'express';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';
import { getRapport, exporterRapportExcel } from '../controllers/rapport.controller';

const router = Router();

router.get('/:type/excel', authenticate, isAdmin, exporterRapportExcel);
router.get('/:type', authenticate, isAdmin, getRapport);

export default router;