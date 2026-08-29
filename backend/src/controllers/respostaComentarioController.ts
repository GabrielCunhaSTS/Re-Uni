import type { Request, Response } from "express";
import { criarRespostaService, deletarRespostaService } from "../services/respostaComentarioService.js";
export const criarResposta = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        const id_comentario = Number(req.params.id_comentario);
        const { texto } = req.body;
        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }
        if (!Number.isInteger(id_comentario)) {
            res.status(400).json({ mensagem: "ID do comentário inválido." });
            return;
        }
        if (!texto || typeof texto !== "string" || texto.trim() === "") {
            res.status(400).json({ mensagem: "O conteúdo da resposta é obrigatório." });
            return;
        }
        const respostaCriada = await criarRespostaService(id_usuario, id_comentario, texto);
        res.status(201).json({
            mensagem: "Resposta enviada com sucesso!",
            resposta: respostaCriada
        });
    } catch (error: any) {
        if (error.message === "COMENTARIO_NAO_ENCONTRADO") {
            res.status(404).json({ mensagem: "Comentário pai não encontrado." });
            return;
        }
        console.error("Erro ao criar resposta:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};
export const deletarResposta = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        const id_resposta = Number(req.params.id_resposta);
        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }
        if (!Number.isInteger(id_resposta)) {
            res.status(400).json({ mensagem: "ID da resposta inválido." });
            return;
        }
        await deletarRespostaService(id_resposta, id_usuario);
        res.status(200).json({ mensagem: "Resposta removida com sucesso!" });
    } catch (error: any) {
        if (error.message === "RESPOSTA_NAO_ENCONTRADA") {
            res.status(404).json({ mensagem: "Resposta não encontrada." });
            return;
        }
        if (error.message === "NAO_AUTORIZADO") {
            res.status(403).json({ mensagem: "Você não tem permissão para deletar esta resposta." });
            return;
        }
        console.error("Erro ao deletar resposta:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};