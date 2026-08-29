import type { Request, Response } from "express";
import { alternarFavoritoService } from "../services/favoritoService.js";
import { Usuario, Republica, Imagem, LocalizacaoRepublica, DadosRepublica, TipoRepublica } from "../models/index.js";
export const toggleFavorito = async (req: Request, res: Response): Promise<void> => {
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
        const resultado = await alternarFavoritoService(id_usuario, id_republica);
        res.status(200).json(resultado);
    } catch (error: any) {
        if (error.message === "REPUBLICA_NAO_ENCONTRADA") {
            res.status(404).json({ mensagem: "República não encontrada." });
            return;
        }
        console.error("Erro ao favoritar república:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};
export const listarFavoritos = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }
        const usuario = await Usuario.findByPk(id_usuario, {
            include: [
                {
                    model: Republica,
                    as: "republicasFavoritas",
                    include: [
                        {
                            model: Imagem,
                            as: "imagens",
                            through: { attributes: ["principal", "ordem"] }
                        },
                        {
                            model: LocalizacaoRepublica,
                            as: "localizacao"
                        },
                        {
                            model: DadosRepublica,
                            as: "dados"
                        },
                        {
                            model: TipoRepublica,
                            as: "tipo"
                        }
                    ]
                }
            ]
        });
        res.status(200).json((usuario as any)?.republicasFavoritas || []);
    } catch (error) {
        console.error("Erro ao listar favoritos:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};