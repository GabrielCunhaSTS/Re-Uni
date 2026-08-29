import type { Request, Response } from "express";
import { criarAvaliacaoService, listarAvaliacoesDaRepublicaService } from "../services/avaliacaoService.js";
export const criarAvaliacao = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        const id_republica = Number(req.params.id_republica);
        const { nota, comentario } = req.body;
        if (!id_usuario) { res.status(401).json({ mensagem: "Não autenticado." }); return; }
        if (nota < 1 || nota > 5) { res.status(400).json({ mensagem: "A nota deve ser entre 1 e 5." }); return; }
        const avaliacao = await criarAvaliacaoService(id_usuario, id_republica, nota, comentario);
        res.status(201).json({ mensagem: "Avaliação registrada com sucesso!", avaliacao });
    } catch (error: any) {
        if (error.message === "NAO_E_MORADOR") {
            res.status(403).json({ mensagem: "Você só pode avaliar repúblicas onde já morou ou tem aluguel ativo." });
            return;
        }
        if (error.message === "AVALIACAO_JA_EXISTE") {
            res.status(409).json({ mensagem: "Você já avaliou esta república." });
            return;
        }
        res.status(500).json({ mensagem: "Erro no servidor." });
    }
};
export const listarAvaliacoesDaRepublica = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_republica = Number(req.params.id_republica);
        if (!Number.isInteger(id_republica)) {
            res.status(400).json({ mensagem: "ID da república inválido." });
            return;
        }
        const avaliacoes = await listarAvaliacoesDaRepublicaService(id_republica);
        res.status(200).json(avaliacoes);
    } catch (error) {
        console.error("Erro ao listar avaliações:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};