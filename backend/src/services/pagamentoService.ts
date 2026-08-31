import { MercadoPagoConfig, Payment } from "mercadopago";
import dotenv from "dotenv";
import { Aluguel, Usuario, Republica } from "../models/index.js";

dotenv.config();

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN as string
});
const payment = new Payment(client);

export const gerarPixParaAluguelService = async (idAluguel: number, idUsuarioLogado: number) => {
    const aluguel = await Aluguel.findByPk(idAluguel, {
        include: [
            { model: Usuario, as: "usuario" },
            { model: Republica, as: "republica" }
        ]
    }) as any;

    if (!aluguel) {
        throw new Error("Aluguel não encontrado.");
    }

    if (aluguel.id_usuario !== idUsuarioLogado) {
        throw new Error("Não autorizado. Este aluguel pertence a outro usuário.");
    }


    const valorAluguel = Number(
        aluguel.valor ||
        aluguel.valor_mensal ||
        aluguel.republica?.valor_mensal ||
        aluguel.republica?.valor ||
        0
    );

    if (valorAluguel <= 0) {
        throw new Error(`O valor da mensalidade está inválido ou zerado. (Valor lido: ${valorAluguel})`);
    }

    const body = {
        transaction_amount: valorAluguel,
        description: `Mensalidade ReUni - ${aluguel.republica?.nome || 'República'}`,
        payment_method_id: "pix",
        payer: {
            email: aluguel.usuario.email,
        },
        external_reference: idAluguel.toString(),
        notification_url: "https://oxymoron-dainty-quality.ngrok-free.dev/api/webhooks/mercadopago",
    };

    try {
        const response = await payment.create({ body });
        return {
            idPagamentoMP: response.id,
            qrCodeBase64: response.point_of_interaction?.transaction_data?.qr_code_base64,
            pixCopiaECola: response.point_of_interaction?.transaction_data?.qr_code,
        };
    } catch (error) {
        console.error("Erro na API do Mercado Pago:", error);
        throw new Error("Falha ao gerar o código PIX no provedor.");
    }
};