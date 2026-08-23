import type { Request, Response } from "express";
import { listarRepublicas, buscarRepublicaPorId, criarRepublica } from "../services/republicaService.js";

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

        const {
            id_tipo_republica,
            nome,
            descricao,
            valor_mensal,
            vagas_total,
            vagas_disponiveis,
            localizacao,
            dados
        } = req.body;

        
        if (!id_tipo_republica || !nome || valor_mensal === undefined || !vagas_total) {
            res.status(400).json({
                mensagem: "Campos obrigatórios: id_tipo_republica, nome, valor_mensal e vagas_total."
            });
            return;
        }

        if (Number(valor_mensal) < 0) {
            res.status(400).json({
                mensagem: "O valor mensal deve ser maior ou igual a 0."
            });
            return;
        }

        if (vagas_disponiveis !== undefined && Number(vagas_disponiveis) > Number(vagas_total)) {
            res.status(400).json({
                mensagem: "Vagas disponíveis não podem ser maiores que o total de vagas."
            });
            return;
        }

        if (!localizacao || !localizacao.bairro || !localizacao.cidade || !localizacao.id_estado) {
            res.status(400).json({
                mensagem: "Localização incompleta. Bairro, cidade e id_estado são obrigatórios."
            });
            return;
        }

        const novaRepublica = await criarRepublica(
            {
                id_tipo_republica: Number(id_tipo_republica),
                nome,
                descricao,
                valor_mensal: Number(valor_mensal),
                vagas_total: Number(vagas_total),
                vagas_disponiveis:
                    vagas_disponiveis !== undefined
                        ? Number(vagas_disponiveis)
                        : Number(vagas_total),
                localizacao,
                dados
            },
            id_usuario
        );

        res.status(201).json({
            mensagem: "República criada com sucesso!",
            republica: novaRepublica
        });
    } catch (error) {
        console.error("Erro ao criar república:", error);
        res.status(500).json({
            mensagem: "Erro interno do servidor ao criar república."
        });
    }
};
