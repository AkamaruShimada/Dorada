// backend/src/routes/commande.routes.ts  (même nommage que vos autres fichiers)

import { Router } from 'express';
import * as commandeController from '../controllers/commande.controller';
import * as remboursementController from '../controllers/remboursement.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware'; // adaptez le chemin
import { validate } from '../middlewares/validate.middleware';           // adaptez le chemin
import { createCommandeSchema, updateStatutCommandeSchema } from '../schemas/commande.schema';
import { createRemboursementSchema } from '../schemas/remboursement.schema';

const router = Router();

router.get('/admin', authenticate, commandeController.getAllCommandesAdmin);
router.get('/admin/stats', authenticate, isAdmin, commandeController.getStatsJour)
router.get('/admin/:id', authenticate, commandeController.getCommandeByIdAdmin);
router.put(
  '/admin/:id/statut',
  authenticate, isAdmin,
  validate(updateStatutCommandeSchema),
  commandeController.updateStatutCommande,
);
router.post('/admin/:id/rembourser', authenticate, isAdmin, validate(createRemboursementSchema), remboursementController.rembourserCommande);

router.post('/', validate(createCommandeSchema), commandeController.createCommande);
router.get('/:reference', commandeController.getCommandeByReference); // toujours en dernier

export default router;