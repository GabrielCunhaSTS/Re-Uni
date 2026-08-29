import type { Request, Response } from "express";
import { obterEstatisticasAnuncianteService } from "../services/dashboardService.js";
export const obterDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }
        const estatisticas = await obterEstatisticasAnuncianteService(id_usuario);
        res.status(200).json(estatisticas);
    } catch (error) {
        console.error("Erro no dashboard:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};