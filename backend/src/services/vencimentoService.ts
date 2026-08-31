import cron from "node-cron";
import { Op } from "sequelize";
import { Aluguel, Comprovante, Republica } from "../models/index.js";
import { criarNotificacaoInterna } from "./notificacaoService.js";

export const verificarVencimentosAluguel = async () => {
    try {
        console.log("🔄 [CRON] Iniciando verificação de vencimentos de aluguel...");

        const dataLimiteCobranca = new Date();
        dataLimiteCobranca.setMonth(dataLimiteCobranca.getMonth() - 1);

        const dataLimiteExpulsao = new Date();
        dataLimiteExpulsao.setDate(dataLimiteExpulsao.getDate() - 45);

        const alugueisAnalisaveis = await Aluguel.findAll({
            where: { status: { [Op.in]: ["ativo", "pendente_comprovante"] } },
            include: [
                {
                    model: Republica,
                    as: "republica",
                    attributes: ["id_usuario", "nome", "vagas_disponiveis"]
                }
            ]
        });

        for (const aluguel of alugueisAnalisaveis) {
            const ultimoComprovante = await Comprovante.findOne({
                where: {
                    id_aluguel: aluguel.id_aluguel,
                    status: "aprovado"
                },
                order: [["criado_em", "DESC"]]
            }) as any;

            const dataBase = ultimoComprovante
                ? new Date(ultimoComprovante.criado_em)
                : (aluguel.data_inicio ? new Date(aluguel.data_inicio) : new Date());

            const nomeRepublica = aluguel.republica?.nome || "sua república";

            if (dataBase <= dataLimiteExpulsao && aluguel.status === "pendente_comprovante") {
                await aluguel.update({ status: "encerrado" });

                if (aluguel.republica) {
                    await aluguel.republica.update({
                        vagas_disponiveis: aluguel.republica.vagas_disponiveis + 1
                    });
                }

                await criarNotificacaoInterna(
                    aluguel.id_usuario,
                    "❌ Desligamento da República",
                    `Seu contrato na república ${nomeRepublica} foi encerrado automaticamente pelo sistema devido à falta de pagamento superior a 45 dias.`
                );

                if (aluguel.republica?.id_usuario) {
                    await criarNotificacaoInterna(
                        aluguel.republica.id_usuario,
                        "⚠️ Contrato Encerrado por Inadimplência",
                        `O sistema encerrou automaticamente o contrato do aluguel #${aluguel.id_aluguel} na república ${nomeRepublica} devido a atrasos superiores a 45 dias. A vaga foi liberada.`
                    );
                }

                console.log(`❌ Aluguel ${aluguel.id_aluguel} encerrado por atraso de 45 dias.`);
            }
            else if (dataBase <= dataLimiteCobranca && aluguel.status === "ativo") {
                await aluguel.update({ status: "pendente_comprovante" });

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