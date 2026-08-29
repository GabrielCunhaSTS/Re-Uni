import type { Request, Response } from "express";
import { obterDadosFinanceirosService } from "../services/dashboardFinanceiroService.js";

export const obterFinanceiroDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_anunciante = req.user?.id_usuario;
        if (!id_anunciante) {
            res.status(401).json({ mensagem: "Não autorizado." });
            return;
        }

        const dados = await obterDadosFinanceirosService(id_anunciante);
        res.status(200).json(dados);
    } catch (error) {
        console.error("Erro ao buscar dados financeiros:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};