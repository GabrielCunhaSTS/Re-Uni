import cron from "node-cron";
import { Op } from "sequelize";
import { Aluguel, Comprovante, Republica } from "../models/index.js";
import { criarNotificacaoInterna } from "./notificacaoService.js";

export const verificarVencimentosAluguel = async () => {
    try {
        console.log("🔄 [CRON] Iniciando verificação de vencimentos de aluguel...");

        const dataLimite = new Date();
        dataLimite.setMonth(dataLimite.getMonth() - 1);

        const alugueisAtivos = await Aluguel.findAll({
            where: { status: "ativo" },
            include: [
                {
                    model: Republica,
                    as: "republica",
                    attributes: ["nome"]
                }
            ]
        });

        for (const aluguel of alugueisAtivos) {
            const ultimoComprovante = await Comprovante.findOne({
                where: {
                    id_aluguel: aluguel.id_aluguel,
                    status: "aprovado"
                },
                order: [["criado_em", "DESC"]]
            }) as any;

            let precisaCobrar = false;

            if (ultimoComprovante) {
                if (new Date(ultimoComprovante.criado_em) <= dataLimite) {
                    precisaCobrar = true;
                }
            } else {
                if (aluguel.data_inicio && new Date(aluguel.data_inicio) <= dataLimite) {
                    precisaCobrar = true;
                }
            }

            if (precisaCobrar) {
                await aluguel.update({ status: "pendente_comprovante" });

                const nomeRepublica = aluguel.republica?.nome || "sua república";

                await criarNotificacaoInterna(
                    aluguel.id_usuario,
                    "Pagamento Pendente ⚠️",
                    `Já faz um mês desde o seu último pagamento na república ${nomeRepublica}. Por favor, envie o novo comprovante para continuar com o status ativo.`
                );

                console.log(`⚠️ Aluguel ${aluguel.id_aluguel} atualizado para pendente_comprovante.`);
            }
        }

        console.log("✅ [CRON] Verificação de vencimentos concluída.");
    } catch (error) {
        console.error("❌ [CRON] Erro ao verificar vencimentos:", error);
    }
};

export const iniciarCronVencimentos = () => {
    cron.schedule("0 0 * * *", () => {
        verificarVencimentosAluguel();
    });
};


export const avaliarComprovanteService = async (id_comprovante: number, novoStatus: "aprovado" | "recusado", id_anunciante: number) => {
    const comprovante = await Comprovante.findByPk(id_comprovante, {
        include: [{
            model: Aluguel,
            as: "aluguel",
            include: [{ model: Republica, as: "republica" }]
        }]
    }) as any;

    if (!comprovante) throw new Error("COMPROVANTE_NAO_ENCONTRADO");

    if (comprovante.aluguel.republica.id_usuario !== id_anunciante) {
        throw new Error("NAO_AUTORIZADO");
    }


    await comprovante.update({ status: novoStatus });


    if (novoStatus === "aprovado") {


        await Aluguel.update(
            { status: "ativo" },
            { where: { id_aluguel: comprovante.id_aluguel } }
        );

        await criarNotificacaoInterna(
            comprovante.aluguel.id_usuario,
            "Pagamento Aprovado! ✅",
            `Seu comprovante de pagamento da república ${comprovante.aluguel.republica.nome} foi aprovado e seu status voltou para ativo.`
        );
    } else if (novoStatus === "recusado") {
        await criarNotificacaoInterna(
            comprovante.aluguel.id_usuario,
            "Comprovante Recusado ❌",
            `O anunciante da república ${comprovante.aluguel.republica.nome} recusou seu último comprovante. Por favor, verifique e envie novamente.`
        );
    }

    return comprovante;
};