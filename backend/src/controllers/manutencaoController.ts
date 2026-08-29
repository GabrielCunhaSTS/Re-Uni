import type { Request, Response } from "express";
import { manutencaoService } from "../services/manutencaoService.js";

export const listarPorRepublica = async (req: Request, res: Response): Promise<void> => {
    try {
        const idRepublica = Number(req.params.idRepublica);
        if (!Number.isInteger(idRepublica) || idRepublica <= 0) {
            res.status(400).json({ mensagem: "ID da república inválido." });
            return;
        }

        const manutencoes = await manutencaoService.listarPorRepublica(idRepublica);
        res.status(200).json(manutencoes);
    } catch (error: any) {
        console.error("Erro ao listar manutenções:", error);
        res.status(500).json({ mensagem: "Erro ao listar manutenções.", erro: error.message });
    }
};

export const criarManutencao = async (req: Request, res: Response): Promise<void> => {
    try {
        const idRepublica = Number(req.params.idRepublica);
        const idUsuario = req.user?.id_usuario;

        if (!idUsuario) {
            res.status(401).json({ mensagem: "Não autorizado." });
            return;
        }

        if (!Number.isInteger(idRepublica) || idRepublica <= 0) {
            res.status(400).json({ mensagem: "ID da república inválido." });
            return;
        }

        const novaManutencao = await manutencaoService.criar(idRepublica, idUsuario, req.body);

        res.status(201).json({
            mensagem: "Chamado ou aviso criado com sucesso!",
            manutencao: novaManutencao
        });
    } catch (error: any) {
        console.error("Erro ao criar chamado:", error);
        res.status(500).json({ mensagem: "Erro ao criar chamado.", erro: error.message });
    }
};

export const atualizarStatusManutencao = async (req: Request, res: Response): Promise<void> => {
    try {
        const idManutencao = Number(req.params.idManutencao);
        const { status } = req.body;

        if (!Number.isInteger(idManutencao) || idManutencao <= 0) {
            res.status(400).json({ mensagem: "ID da manutenção inválido." });
            return;
        }

        const manutencaoAtualizada = await manutencaoService.atualizarStatus(idManutencao, status);

        res.status(200).json({
            mensagem: "Status atualizado com sucesso!",
            manutencao: manutencaoAtualizada
        });
    } catch (error: any) {
        console.error("Erro ao atualizar status:", error);
        res.status(404).json({ mensagem: error.message });
    }
};

export const removerManutencao = async (req: Request, res: Response): Promise<void> => {
    try {
        const idManutencao = Number(req.params.idManutencao);

        if (!Number.isInteger(idManutencao) || idManutencao <= 0) {
            res.status(400).json({ mensagem: "ID da manutenção inválido." });
            return;
        }

        await manutencaoService.remover(idManutencao);

        res.status(200).json({ mensagem: "Chamado removido com sucesso!" });
    } catch (error: any) {
        console.error("Erro ao remover chamado:", error);
        res.status(404).json({ mensagem: error.message });
    }
};