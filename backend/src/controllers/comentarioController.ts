import type { Request, Response } from "express";
import {
    criarComentarioService,
    listarComentariosDaRepublicaService,
    deletarComentarioService
} from "../services/comentarioService.js";

export const criarComentario = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        const id_republica = Number(req.params.id);
        const { conteudo } = req.body;

        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }

        if (!Number.isInteger(id_republica)) {
            res.status(400).json({ mensagem: "ID da república inválido." });
            return;
        }

        if (!conteudo || typeof conteudo !== "string" || conteudo.trim() === "") {
            res.status(400).json({ mensagem: "O conteúdo do comentário é obrigatório." });
            return;
        }

        const comentarioCriado = await criarComentarioService(id_usuario, id_republica, conteudo);

        res.status(201).json({
            mensagem: "Comentário adicionado com sucesso!",
            comentario: comentarioCriado
        });

    } catch (error: any) {
        if (error.message === "REPUBLICA_NAO_ENCONTRADA") {
            res.status(404).json({ mensagem: "República não encontrada." });
            return;
        }
        console.error("Erro ao criar comentário:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const listarComentarios = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_republica = Number(req.params.id);

        if (!Number.isInteger(id_republica)) {
            res.status(400).json({ mensagem: "ID da república inválido." });
            return;
        }

        const comentarios = await listarComentariosDaRepublicaService(id_republica);

        res.status(200).json(comentarios);

    } catch (error: any) {
        if (error.message === "REPUBLICA_NAO_ENCONTRADA") {
            res.status(404).json({ mensagem: "República não encontrada." });
            return;
        }
        console.error("Erro ao listar comentários:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const deletarComentario = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        const id_comentario = Number(req.params.id_comentario);

        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }

        if (!Number.isInteger(id_comentario)) {
            res.status(400).json({ mensagem: "ID do comentário inválido." });
            return;
        }

        await deletarComentarioService(id_comentario, id_usuario);

        res.status(200).json({ mensagem: "Comentário removido com sucesso!" });

    } catch (error: any) {
        if (error.message === "COMENTARIO_NAO_ENCONTRADA") {
            res.status(404).json({ mensagem: "Comentário não encontrado." });
            return;
        }
        if (error.message === "NAO_AUTORIZADO") {
            res.status(403).json({ mensagem: "Você não tem permissão para deletar este comentário." });
            return;
        }
        console.error("Erro ao deletar comentário:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};