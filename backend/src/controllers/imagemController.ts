import type { Request, Response } from "express";
import { adicionarImagens } from "../services/imagemService.js";

export const uploadImagens = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        const id_republica = Number(req.params.id);

        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }

        if (!Number.isInteger(id_republica) || id_republica <= 0) {
            res.status(400).json({ mensagem: "ID da república inválido." });
            return;
        }

        
        const arquivos = req.files as Express.Multer.File[];

        if (!arquivos || arquivos.length === 0) {
            res.status(400).json({ mensagem: "Nenhuma imagem foi enviada." });
            return;
        }

        const imagensSalvas = await adicionarImagens(
            id_republica,
            id_usuario,
            arquivos
        );

        res.status(201).json({
            mensagem: "Imagens adicionadas com sucesso!",
            imagens: imagensSalvas
        });

    } catch (error: any) {
        if (error.message === "REPUBLICA_NAO_ENCONTRADA") {
            res.status(404).json({ mensagem: "República não encontrada." });
            return;
        }

        if (error.message === "NAO_AUTORIZADO") {
            res.status(403).json({ mensagem: "Você não tem permissão para adicionar fotos nesta república." });
            return;
        }

        console.error("Erro ao fazer upload de imagens:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor ao salvar imagens." });
    }
};