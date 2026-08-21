import { Router } from "express";

import {
    listar
} from "../controllers/republicaController.js";

const router = Router();

router.get("/", listar);

export default router;