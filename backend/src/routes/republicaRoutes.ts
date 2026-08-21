import { Router } from "express";

import {
    listar,
    buscarPorId
} from "../controllers/republicaController.js";

const router = Router();

router.get("/", listar);
router.get("/:id", buscarPorId);

export default router;