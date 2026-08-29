import type { Request, Response } from "express";
import { filtrarRepublicasService } from "../services/republicaFiltroService.js";
export const buscarRepublicas = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cidade, id_estado, id_tipo_republica, preco_min, preco_max, pesquisa } = req.query as {
            cidade?: string;
            id_estado?: string;
            id_tipo_republica?: string;
            preco_min?: string;
            preco_max?: string;
            pesquisa?: string;
        };
        const republicas = await filtrarRepublicasService({
            cidade,
            id_estado,
            id_tipo_republica,
            preco_min,
            preco_max,
            pesquisa
        });
        res.status(200).json({
            total: republicas.length,
            republicas
        });
    } catch (error) {
        console.error("Erro ao filtrar repúblicas:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};