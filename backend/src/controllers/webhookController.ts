import type { Request, Response } from "express";
import { Payment, MercadoPagoConfig } from "mercadopago";
import { Aluguel, Republica } from "../models/index.js";
import { criarNotificacaoInterna } from "../services/notificacaoService.js";

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN as string });
const payment = new Payment(client);

export const receberWebhookMercadoPago = async (req: Request, res: Response): Promise<void> => {
    const { type, data } = req.body;


    res.status(200).send("OK");

    try {
        if (type === "payment" || req.body.action === "payment.created" || req.body.action === "payment.updated") {
            const paymentId = data?.id || req.body.data?.id;

            if (paymentId) {

                const pagamentoConfirmado = await payment.get({ id: paymentId });

                if (pagamentoConfirmado.status === "approved") {

                    const idAluguel = Number(pagamentoConfirmado.external_reference);

                    if (idAluguel) {
                        const aluguel = await Aluguel.findByPk(idAluguel, {
                            include: [
                                { model: Republica, as: "republica" }
                            ]
                        }) as any;


                        if (aluguel && aluguel.status !== "pago") {

                            await aluguel.update({ status: "ativo" });

                            const nomeRepublica = aluguel.republica?.nome || "sua república";


                            await criarNotificacaoInterna(
                                aluguel.id_usuario,
                                "Pagamento PIX Aprovado! ✅",
                                `O pagamento via PIX da república ${nomeRepublica} foi confirmado automaticamente pelo sistema.`
                            );

                            console.log(`[WEBHOOK] PIX do aluguel ${idAluguel} aprovado com sucesso!`);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error("[WEBHOOK] Erro ao processar notificação do Mercado Pago:", error);
    }
};