import type { Request, Response } from "express";
import { listarRepublicas, buscarRepublicaPorId } from "../services/republicaService.js";

export const listar = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const cidade =
            typeof req.query.cidade === "string"
                ? req.query.cidade
                : undefined;

        const valorMax =
            typeof req.query.valorMax === "string"
                ? Number(req.query.valorMax)
                : undefined;

        const valorMin =
            typeof req.query.valorMin === "string"
                ? Number(req.query.valorMin)
                : undefined;

        const tipo =
            typeof req.query.tipo === "string"
                ? Number(req.query.tipo)
                : undefined;

        if (
            valorMax !== undefined &&
            (!Number.isFinite(valorMax) || valorMax < 0)
        ) {
            res.status(400).json({
                mensagem: "valorMax inválido."
            });

            return;
        }

        if (
            valorMin !== undefined &&
            (!Number.isFinite(valorMin) || valorMin < 0)
        ) {
            res.status(400).json({
                mensagem: "valorMin inválido."
            });

            return;
        }

        if (
            tipo !== undefined &&
            (!Number.isInteger(tipo) || tipo <= 0)
        ) {
            res.status(400).json({
                mensagem: "tipo inválido."
            });

            return;
        }

        if (
            valorMin !== undefined &&
            valorMax !== undefined &&
            valorMin > valorMax
        ) {
            res.status(400).json({
                mensagem: "valorMin não pode ser maior que valorMax."
            });

            return;
        }

        const filtros: {
            cidade?: string;
            valorMax?: number;
            valorMin?: number;
            tipo?: number;
        } = {};

        if (cidade !== undefined) {
            filtros.cidade = cidade;
        }

        if (valorMax !== undefined) {
            filtros.valorMax = valorMax;
        }

        if (valorMin !== undefined) {
            filtros.valorMin = valorMin;
        }

        if (tipo !== undefined) {
            filtros.tipo = tipo;
        }

const republicas = await listarRepublicas(filtros);

        res.status(200).json({
            total: republicas.length,
            republicas
        });

    } catch (error) {

        console.error("Erro ao pesquisar repúblicas:", error);

        res.status(500).json({
            mensagem: "Erro interno do servidor."
        });

    }
};

export const buscarPorId = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                mensagem: "ID da república inválido."
            });

            return;
        }

        const republica = await buscarRepublicaPorId(id);

        if (!republica) {
            res.status(404).json({
                mensagem: "República não encontrada."
            });

            return;
        }

        res.status(200).json(republica);

    } catch (error) {

        console.error("Erro ao buscar república:", error);

        res.status(500).json({
            mensagem: "Erro interno do servidor."
        });
    }
};