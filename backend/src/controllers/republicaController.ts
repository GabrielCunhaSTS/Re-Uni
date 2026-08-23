import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
    listarRepublicas,
    buscarRepublicaPorId,
    criarRepublica
} from "../services/republicaService.js";
import { createRepublicaSchema } from "../schemas/republicaSchema.js";

export const criar = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id_usuario =
            (req as any).user?.id_usuario || (req as any).user?.id;

        if (!id_usuario) {
            res.status(401).json({
                mensagem: "Usuário não autenticado."
            });
            return;
        }

        
        const dadosValidados = createRepublicaSchema.parse(req.body);

        
        const novaRepublica = await criarRepublica(dadosValidados, id_usuario);

        res.status(201).json({
            mensagem: "República criada com sucesso!",
            republica: novaRepublica
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                mensagem: "Dados inválidos.",
                erros: error.issues.map((issue) => ({
                    campo: issue.path.join("."),
                    mensagem: issue.message
                }))
            });
            return;
        }

        console.error("Erro ao criar república:", error);
        res.status(500).json({
            mensagem: "Erro interno do servidor ao criar república."
        });
    }
};

export const listar = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const cidade =
            typeof req.query.cidade === "string" ? req.query.cidade : undefined;
        const valorMax =
            typeof req.query.valorMax === "string" ? Number(req.query.valorMax) : undefined;
        const valorMin =
            typeof req.query.valorMin === "string" ? Number(req.query.valorMin) : undefined;
        const tipo =
            typeof req.query.tipo === "string" ? Number(req.query.tipo) : undefined;

        if (valorMax !== undefined && (!Number.isFinite(valorMax) || valorMax < 0)) {
            res.status(400).json({ mensagem: "valorMax inválido." });
            return;
        }

        if (valorMin !== undefined && (!Number.isFinite(valorMin) || valorMin < 0)) {
            res.status(400).json({ mensagem: "valorMin inválido." });
            return;
        }

        if (tipo !== undefined && (!Number.isInteger(tipo) || tipo <= 0)) {
            res.status(400).json({ mensagem: "tipo inválido." });
            return;
        }

        if (valorMin !== undefined && valorMax !== undefined && valorMin > valorMax) {
            res.status(400).json({ mensagem: "valorMin não pode ser maior que valorMax." });
            return;
        }

        const filtros = { cidade, valorMax, valorMin, tipo };
        const republicas = await listarRepublicas(filtros);

        res.status(200).json({
            total: republicas.length,
            republicas
        });
    } catch (error) {
        console.error("Erro ao pesquisar repúblicas:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const buscarPorId = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ mensagem: "ID da república inválido." });
            return;
        }

        const republica = await buscarRepublicaPorId(id);

        if (!republica) {
            res.status(404).json({ mensagem: "República não encontrada." });
            return;
        }

        res.status(200).json(republica);
    } catch (error) {
        console.error("Erro ao buscar república:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};