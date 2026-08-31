import type { Request, Response } from "express";
import { gerarPixParaAluguelService } from "../services/pagamentoService.js";

export const gerarPixParaAluguel = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        const id_aluguel = Number(req.params.id_aluguel);

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