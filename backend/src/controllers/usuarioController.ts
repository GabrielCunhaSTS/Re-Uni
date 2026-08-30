import type { Request, Response } from "express";
import { ConfiguracaoUsuario, Usuario } from "../models/index.js";
import { atualizarPerfilService } from "../services/usuarioService.js";

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

export const atualizarPerfilUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }
        const usuarioAtualizado = await atualizarPerfilService(id_usuario, req.body);
        res.status(200).json({
            mensagem: "Perfil atualizado com sucesso!",
            usuario: usuarioAtualizado
        });
    } catch (error: any) {
        if (error.message === "USUARIO_NAO_ENCONTRADO") {
            res.status(404).json({ mensagem: "Usuário não encontrado." });
            return;
        }
        if (error.message === "SENHA_ATUAL_OBRIGATORIA") {
            res.status(400).json({ mensagem: "Informe a senha atual para alterar a senha." });
            return;
        }
        if (error.message === "SENHA_INCORRETA") {
            res.status(400).json({ mensagem: "Senha atual incorreta." });
            return;
        }
        console.error("Erro ao atualizar perfil:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const listarEstudantes = async (req: Request, res: Response): Promise<void> => {
    try {
        const estudantes = await Usuario.findAll({
            where: { tipo: "estudante" },
            attributes: ["id_usuario", "nome", "email"],
        });
        res.status(200).json(estudantes);
    } catch (error) {
        console.error("Erro ao listar estudantes:", error);
        res.status(500).json({ mensagem: "Erro ao buscar estudantes." });
    }
};