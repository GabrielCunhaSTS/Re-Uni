import { Router } from "express";
import {
    solicitarAluguel,
    listarMeusAlugueis,
    atualizarStatusAluguel,
    listarAlugueisRecebidos,
    enviarComprovanteMatricula,
    avaliarComprovanteMatricula,
    listarInquilinosDaRepublica,
    gerarContratoLocacaoPdf,

} from "../controllers/aluguelController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";

const router = Router();

router.post("/republicas/:id_republica/alugueis", authMiddleware, solicitarAluguel);
router.get("/alugueis/meus", authMiddleware, listarMeusAlugueis);
router.get("/alugueis/recebidos", authMiddleware, listarAlugueisRecebidos);
router.patch("/alugueis/:id_aluguel/status", authMiddleware, atualizarStatusAluguel);
router.post(
    "/alugueis/:id_aluguel/matricula",
    authMiddleware,
    uploadMiddleware.single("arquivo"),
    enviarComprovanteMatricula
);
router.patch("/alugueis/:id_aluguel/matricula/avaliacao", authMiddleware, avaliarComprovanteMatricula);
router.get("/republicas/:id_republica/inquilinos", authMiddleware, listarInquilinosDaRepublica);
router.get("/alugueis/:id_aluguel/contrato", authMiddleware, gerarContratoLocacaoPdf);

export default router;



