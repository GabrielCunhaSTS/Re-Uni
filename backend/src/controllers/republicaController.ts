import type { Request, Response } from "express";
import { listarRepublicas } from "../services/republicaService.js";

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