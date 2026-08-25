import { Router } from "express";
import { toggleFavorito, listarFavoritos } from "../controllers/favoritoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, listarFavoritos);

router.post("/:id", authMiddleware, toggleFavorito);

export default router;