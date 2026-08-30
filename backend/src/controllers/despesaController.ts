import type { Request, Response } from "express";
import { Despesa, DespesaInquilino, Usuario } from "../models/index.js";

export const criarDespesa = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_republica, titulo, categoria, valor_total, data_vencimento, ids_inquilinos } = req.body;

        if (!id_republica || !titulo || !valor_total || !data_vencimento || !ids_inquilinos || ids_inquilinos.length === 0) {
            res.status(400).json({ mensagem: "Preencha todos os campos obrigatórios e selecione ao menos um inquilino." });
            return;
        }

        const despesa = await Despesa.create({
            id_republica,
            titulo,
            categoria: categoria || "outro",
            valor_total,
            data_vencimento,
            status: "pendente",
        });

        const qtdInquilinos = ids_inquilinos.length;
        const valorParte = Number((Number(valor_total) / qtdInquilinos).toFixed(2));

        const divisoesData = ids_inquilinos.map((id_usuario: number) => ({
            id_despesa: despesa.id_despesa,
            id_usuario,
            valor_parte: valorParte,
            status_pagamento: "pendente",
        }));

        await DespesaInquilino.bulkCreate(divisoesData);

        res.status(201).json({
            mensagem: "Despesa cadastrada e dividida com sucesso!",
            despesa,
            valorPorMorador: valorParte,
        });
    } catch (error) {
        console.error("Erro ao criar despesa:", error);
        res.status(500).json({ mensagem: "Erro interno ao processar a despesa." });
    }
};


export const listarDespesas = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_republica } = req.query;

        const filtro: any = {};
        if (id_republica) {
            const republicaStr = Array.isArray(id_republica) ? id_republica[0] : id_republica;
            filtro.id_republica = Number(republicaStr);
        }

        const despesas = await Despesa.findAll({
            where: filtro,
            include: [
                {
                    model: DespesaInquilino,
                    as: "divisoes",
                    include: [{ model: Usuario, as: "usuario", attributes: ["id_usuario", "nome", "email"] }]
                }
            ],
            order: [["data_vencimento", "ASC"]],
        });

        res.status(200).json(despesas);
    } catch (error) {
        console.error("Erro ao listar despesas:", error);
        res.status(500).json({ mensagem: "Erro ao buscar despesas." });
    }
};

export const pagarFaturaInquilino = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_despesa_inquilino } = req.params;
        const { comprovante_url } = req.body;

        const idInquilinoNum = Number(Array.isArray(id_despesa_inquilino) ? id_despesa_inquilino[0] : id_despesa_inquilino);

        const divInquilino = await DespesaInquilino.findByPk(idInquilinoNum);
        if (!divInquilino) {
            res.status(404).json({ mensagem: "Fatura individual não encontrada." });
            return;
        }

        await divInquilino.update({
            status_pagamento: "pago",
            comprovante_url: comprovante_url || null,
        });

        res.status(200).json({ mensagem: "Pagamento registrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao registrar pagamento:", error);
        res.status(500).json({ mensagem: "Erro ao atualizar pagamento." });
    }
};