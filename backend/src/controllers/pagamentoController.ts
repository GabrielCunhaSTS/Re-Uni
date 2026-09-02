import type { Request, Response } from "express";
import { gerarPixParaAluguelService } from "../services/pagamentoService.js";
import { Aluguel, Republica, Usuario, Notificacao } from "../models/index.js";

export const gerarPixParaAluguel = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;

        const { idAluguel } = req.body;
        const id_aluguel = Number(idAluguel);

        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }

        if (!Number.isInteger(id_aluguel)) {
            res.status(400).json({ mensagem: "ID do aluguel inválido." });
            return;
        }

        const pixData = await gerarPixParaAluguelService(id_aluguel, id_usuario);

        res.status(200).json({
            mensagem: "PIX gerado com sucesso!",
            pix: pixData
        });
    } catch (error: any) {
        console.error("Erro ao gerar PIX do aluguel:", error);

        if (
            error.message === "Aluguel não encontrado." ||
            error.message === "O valor da mensalidade está inválido ou zerado."
        ) {
            res.status(400).json({ mensagem: error.message });
            return;
        }

        if (error.message === "Não autorizado. Este aluguel pertence a outro usuário.") {
            res.status(403).json({ mensagem: error.message });
            return;
        }

        res.status(500).json({ mensagem: "Erro interno ao processar o pagamento com PIX." });
    }
};

export const notificarPagamentoDinheiro = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_estudante = req.user?.id_usuario;
        const { idAluguel, mesReferencia } = req.body;

        if (!id_estudante) {
            res.status(401).json({ mensagem: "Não autorizado." });
            return;
        }

        const aluguel = await Aluguel.findByPk(idAluguel, {
            include: [
                { model: Republica, as: "republica" },
                { model: Usuario, as: "usuario" }
            ]
        }) as any;

        if (!aluguel) {
            res.status(404).json({ mensagem: "Aluguel não encontrado." });
            return;
        }

        const nomeEstudante = aluguel.usuario?.nome || "Um inquilino";

        await Notificacao.create({
            id_usuario: aluguel.republica.id_usuario,
            titulo: "Aviso de Pagamento em Mãos 💵",
            mensagem: `O estudante ${nomeEstudante} informou que pagará o aluguel de ${mesReferencia} em dinheiro. Aguarde o recebimento para dar baixa no sistema.`,
            lido: false
        });

        res.status(200).json({ mensagem: "Notificação enviada com sucesso!" });
    } catch (error) {
        console.error("Erro ao notificar intenção de pagamento em dinheiro:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const darBaixaManualDinheiro = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_anunciante = req.user?.id_usuario;
        const id_aluguel = Number(req.params.id_aluguel);

        if (!id_anunciante) {
            res.status(401).json({ mensagem: "Não autorizado." });
            return;
        }

        const aluguel = await Aluguel.findByPk(id_aluguel, {
            include: [{ model: Republica, as: "republica" }]
        }) as any;

        if (!aluguel) {
            res.status(404).json({ mensagem: "Aluguel não encontrado." });
            return;
        }

        if (aluguel.republica.id_usuario !== id_anunciante) {
            res.status(403).json({ mensagem: "Você não tem permissão para alterar este aluguel." });
            return;
        }

        aluguel.status = "ativo";
        await aluguel.save();

        await Notificacao.create({
            id_usuario: aluguel.id_usuario,
            titulo: "Pagamento Confirmado! 💵",
            mensagem: `O anunciante confirmou o recebimento em dinheiro referente ao seu contrato na república ${aluguel.republica.nome}.`,
            lido: false
        });

        res.status(200).json({ mensagem: "Baixa de pagamento registrada com sucesso!" });
    } catch (error) {
        console.error("Erro ao dar baixa manual no pagamento:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};