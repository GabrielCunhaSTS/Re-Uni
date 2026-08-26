import type { Request, Response } from "express";
import { ConfiguracaoUsuario, Usuario } from "../models/index.js";

export const obterPerfilEConfiguracoes = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;

        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }

        const usuario = await Usuario.findByPk(id_usuario, {
            attributes: { exclude: ["senha"] }, 
            include: [
                {
                    model: ConfiguracaoUsuario,
                    as: "configuracao"
                }
            ]
        });

        if (!usuario) {
            res.status(404).json({ mensagem: "Usuário não encontrado." });
            return;
        }

        res.status(200).json(usuario);

    } catch (error) {
        console.error("Erro ao buscar perfil e configurações:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const atualizarConfiguracoesUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;

        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }

        let configuracao = await ConfiguracaoUsuario.findOne({
            where: { id_usuario }
        });

        if (!configuracao) {
            configuracao = await ConfiguracaoUsuario.create({
                id_usuario,
                ...req.body
            });
        } else {
            await configuracao.update(req.body);
        }

        res.status(200).json({
            mensagem: "Configurações atualizadas com sucesso!",
            configuracao
        });

    } catch (error) {
        console.error("Erro ao atualizar configurações:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};