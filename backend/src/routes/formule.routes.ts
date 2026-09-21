// backend/src/routes/formule.routes.ts

import { Router } from "express";
import * as formuleController from "../controllers/formule.controller";
import { validate } from "../middlewares/validate.middleware";
import { createFormuleSchema, updateFormuleSchema } from "../schemas/formule.schema";

const router = Router();

router.get("/", formuleController.getAllFormules);
router.get("/admin", formuleController.getAllFormulesAdmin);

router.get("/:id", formuleController.getFormuleById);
router.post("/", validate(createFormuleSchema), formuleController.createFormule);
router.put("/:id", validate(updateFormuleSchema), formuleController.updateFormule);
router.delete("/:id", formuleController.deleteFormule);

export default router;