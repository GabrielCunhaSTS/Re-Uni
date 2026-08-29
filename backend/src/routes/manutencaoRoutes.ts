import { Router } from 'express';
import {
    listarPorRepublica,
    criarManutencao,
    atualizarStatusManutencao,
    removerManutencao
} from '../controllers/manutencaoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/republicas/:idRepublica/manutencoes', authMiddleware, listarPorRepublica);
router.post('/republicas/:idRepublica/manutencoes', authMiddleware, criarManutencao);
router.patch('/manutencoes/:idManutencao/status', authMiddleware, atualizarStatusManutencao);
router.delete('/manutencoes/:idManutencao', authMiddleware, removerManutencao);

export default router;