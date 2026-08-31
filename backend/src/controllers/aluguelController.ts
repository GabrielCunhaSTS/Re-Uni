import type { Request, Response } from "express";
import {
    solicitarAluguelService,
    listarAlugueisDoUsuarioService,
    atualizarStatusAluguelService,
    listarAlugueisRecebidosService,
    enviarComprovanteMatriculaService,
    avaliarComprovanteMatriculaService
} from "../services/aluguelService.js";
import { Aluguel, Usuario } from "../models/index.js";
import { Op } from "sequelize";

export const solicitarAluguel = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        const id_republica = Number(req.params.id_republica);
        const { data_inicio } = req.body;
        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }
        if (!Number.isInteger(id_republica)) {
            res.status(400).json({ mensagem: "ID da república inválido." });
            return;
        }
        const aluguelCriado = await solicitarAluguelService(id_usuario, id_republica, data_inicio);
        res.status(201).json({
            mensagem: "Solicitação de aluguel enviada com sucesso!",
            aluguel: aluguelCriado
        });
    } catch (error: any) {
        if (error.message === "REPUBLICA_LOTADA") {
            res.status(409).json({
                mensagem: "Não há mais vagas disponíveis nesta república no momento."
            });
            return;
        }
        if (error.message === "ALUGUEL_JA_SOLICITADO") {
            res.status(409).json({
                mensagem: "Você já possui uma solicitação pendente ou um aluguel ativo para esta república."
            });
            return;
        }
        if (error.message === "REPUBLICA_NAO_ENCONTRADA") {
            res.status(404).json({ mensagem: "República não encontrada." });
            return;
        }
        console.error("Erro ao solicitar aluguel:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};
export const listarMeusAlugueis = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }
        const alugueis = await listarAlugueisDoUsuarioService(id_usuario);
        res.status(200).json(alugueis);
    } catch (error) {
        console.error("Erro ao listar aluguéis:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};
export const atualizarStatusAluguel = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        const id_aluguel = Number(req.params.id_aluguel);
        const { status } = req.body;
        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }
        if (!Number.isInteger(id_aluguel)) {
            res.status(400).json({ mensagem: "ID do aluguel inválido." });
            return;
        }
        if (!status) {
            res.status(400).json({ mensagem: "O novo status é obrigatório." });
            return;
        }
        const aluguelAtualizado = await atualizarStatusAluguelService(id_aluguel, status, id_usuario);
        res.status(200).json({
            mensagem: "Status do aluguel atualizado com sucesso!",
            aluguel: aluguelAtualizado
        });
    } catch (error: any) {
        if (error.message === "ALUGUEL_NAO_ENCONTRADO") {
            res.status(404).json({ mensagem: "Aluguel não encontrado." });
            return;
        }
        if (error.message === "NAO_AUTORIZADO") {
            res.status(403).json({ mensagem: "Você não tem permissão para alterar este aluguel." });
            return;
        }
        console.error("Erro ao atualizar status do aluguel:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};
export const listarAlugueisRecebidos = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }
        const alugueisRecebidos = await listarAlugueisRecebidosService(id_usuario);
        res.status(200).json(alugueisRecebidos);
    } catch (error) {
        console.error("Erro ao listar aluguéis recebidos:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const enviarComprovanteMatricula = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        const id_aluguel = Number(req.params.id_aluguel);


        const url_pdf = req.file ? `http://localhost:3001/uploads/${req.file.filename}` : req.body.url_pdf;

        if (!id_usuario) {
            res.status(401).json({ mensagem: "Não autenticado." });
            return;
        }
        if (!url_pdf) {
            res.status(400).json({ mensagem: "O arquivo PDF é obrigatório." });
            return;
        }

        const aluguelAtualizado = await enviarComprovanteMatriculaService(id_aluguel, id_usuario, url_pdf);
        res.status(200).json({ mensagem: "Comprovante enviado com sucesso!", aluguel: aluguelAtualizado });
    } catch (error: any) {
        res.status(500).json({ mensagem: error.message || "Erro interno" });
    }
};

export const avaliarComprovanteMatricula = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_anunciante = req.user?.id_usuario;
        const id_aluguel = Number(req.params.id_aluguel);
        const { status } = req.body;

        if (!id_anunciante) {
            res.status(401).json({ mensagem: "Não autenticado." });
            return;
        }

        const aluguelAtualizado = await avaliarComprovanteMatriculaService(id_aluguel, id_anunciante, status);
        res.status(200).json({ mensagem: "Matrícula avaliada com sucesso!", aluguel: aluguelAtualizado });
    } catch (error: any) {
        res.status(500).json({ mensagem: error.message || "Erro interno" });
    }
};

export const listarInquilinosDaRepublica = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_republica = Number(req.params.id_republica);

        if (!Number.isInteger(id_republica)) {
            res.status(400).json({ mensagem: "ID da república inválido." });
            return;
        }


        const alugueisAtivos = await Aluguel.findAll({
            where: {
                id_republica: id_republica,
                status: { [Op.in]: ["ativo", "aceito"] }
            },
            include: [
                {
                    model: Usuario,
                    as: "usuario",
                    attributes: ["id_usuario", "nome", "email", "telefone"]
                }
            ]
        });


        const moradores = alugueisAtivos
            .map((aluguel: any) => aluguel.usuario)
            .filter(Boolean);

        res.status(200).json(moradores);
    } catch (error) {
        console.error("Erro ao listar inquilinos da república:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};