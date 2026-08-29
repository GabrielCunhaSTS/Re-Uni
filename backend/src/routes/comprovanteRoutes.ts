import { Router } from "express";
import { 
    enviarComprovante, 
    listarComprovantesPorRepublica, 
    alterarStatusComprovante 
} from "../controllers/comprovanteController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/comprovantes", authMiddleware, enviarComprovante);
router.get("/comprovantes/republica/:id_republica", authMiddleware, listarComprovantesPorRepublica);
router.patch("/comprovantes/:id/status", authMiddleware, alterarStatusComprovante);

export default router;