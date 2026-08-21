import type { Request, Response } from "express";
import { listarRepublicas, buscarRepublicaPorId } from "../services/republicaService.js";

export const listar = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const republicas = await listarRepublicas();

        res.status(200).json({
            total: republicas.length,
            republicas
        });

    } catch (error) {
        console.error("Erro ao listar repúblicas:", error);

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