// backend/src/routes/contact.route.ts

import { Router } from 'express';
import * as contactController from '../controllers/contact.controller'
import { contactSchema } from '../schemas/contact.schema'
import { validate } from '../middlewares/validate.middleware';

const router = Router();

router.post('/', validate(contactSchema), contactController.envoyerContact);

export default router