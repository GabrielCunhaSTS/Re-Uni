import type { Request, Response } from "express";
import { 
    criarComprovanteService, 
    listarComprovantesPorRepublicaService, 
    atualizarStatusComprovanteService 
} from "../services/comprovanteService.js";

export const enviarComprovante = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_estudante = req.user?.id_usuario;
        const { id_aluguel, arquivo_url, mes_referencia } = req.body;

        if (!id_estudante) {
            res.status(401).json({ mensagem: "Não autorizado." });
            return;
        }

        const comprovante = await criarComprovanteService(Number(id_estudante), id_aluguel, arquivo_url, mes_referencia);
        res.status(201).json(comprovante);
    } catch (error) {
        console.error("Erro ao enviar comprovante:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const listarComprovantesPorRepublica = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_republica } = req.params;
        const comprovantes = await listarComprovantesPorRepublicaService(Number(id_republica));
        res.status(200).json(comprovantes);
    } catch (error) {
        console.error("Erro ao listar comprovantes:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const alterarStatusComprovante = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const comprovanteAtualizado = await atualizarStatusComprovanteService(Number(id), status);
        res.status(200).json({ mensagem: "Status atualizado com sucesso.", comprovante: comprovanteAtualizado });
    } catch (error: any) {
        console.error("Erro ao atualizar status:", error);
        res.status(500).json({ mensagem: error.message || "Erro interno do servidor." });
    }
};