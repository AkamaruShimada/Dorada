// backend/src/routes/formule.routes.ts

import { Router } from "express";
import * as formuleController from "../controllers/formule.controller";
import { validate } from "../middlewares/validate.middleware";
import { createFormuleSchema, updateFormuleSchema } from "../schemas/formule.schema";
import { authenticate, isAdmin } from '../middlewares/auth.middleware';


const router = Router();

router.get("/", formuleController.getAllFormules);
router.get("/admin", authenticate, formuleController.getAllFormulesAdmin);

router.get("/:id", formuleController.getFormuleById);
router.post("/admin", authenticate, isAdmin, validate(createFormuleSchema), formuleController.createFormule);
router.put("/admin/:id", authenticate, isAdmin, validate(updateFormuleSchema), formuleController.updateFormule);
router.delete("/admin/:id", authenticate, isAdmin, formuleController.deleteFormule);

export default router;