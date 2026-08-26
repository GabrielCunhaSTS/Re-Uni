import { Router } from "express";
import { 
    solicitarAluguel, 
    listarMeusAlugueis, 
    atualizarStatusAluguel,
    listarAlugueisRecebidos
} from "../controllers/aluguelController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/republicas/:id_republica/alugueis", authMiddleware, solicitarAluguel);
router.get("/alugueis/meus", authMiddleware, listarMeusAlugueis);
router.get("/alugueis/recebidos", authMiddleware, listarAlugueisRecebidos);
router.patch("/alugueis/:id_aluguel/status", authMiddleware, atualizarStatusAluguel);

export default router;