import { Aluguel, Republica, Usuario } from "../models/index.js";
import { criarNotificacaoInterna } from "./notificacaoService.js";
import { Op } from "sequelize";

export const solicitarAluguelService = async (id_usuario: number, id_republica: number, data_inicio?: string) => {

    const republica = await Republica.findByPk(id_republica);

    if (!republica || !republica.ativo) {

        throw new Error("REPUBLICA_NAO_ENCONTRADA");
    }

    if (republica.vagas_disponiveis <= 0) {

        throw new Error("REPUBLICA_LOTADA");
    }

    const aluguelExistente = await Aluguel.findOne({

        where: { id_usuario, id_republica, status: { [Op.in]: ["pendente", "ativo"] } }
    });

    if (aluguelExistente) {

        throw new Error("ALUGUEL_JA_SOLICITADO");
    }

    const novoAluguel = await Aluguel.create({
        id_usuario,
        id_republica,
        status: "pendente",
        data_inicio: data_inicio ? new Date(data_inicio) : new Date()
    });

    await criarNotificacaoInterna(

        republica.id_usuario,
        "Nova solicitação de vaga! 🏠",
        `Um estudante demonstrou interesse em morar na sua república: ${republica.nome}. Acesse seus pedidos para responder.`

    );

    return await Aluguel.findByPk(novoAluguel.id_aluguel, {

        include: [
            { model: Republica, as: "republica", attributes: ["id_republica", "nome", "valor_mensal"] },
            { model: Usuario, as: "usuario", attributes: ["id_usuario", "nome", "email"] }
        ]

    });
};
export const listarAlugueisDoUsuarioService = async (id_usuario: number) => {

    return await Aluguel.findAll({

        where: { id_usuario },
        include: [
            {
                model: Republica,
                as: "republica"
            }
        ],

        order: [["criado_em", "DESC"]]
    });
};

export const atualizarStatusAluguelService = async (id_aluguel: number, status: any, id_usuario_logado: number) => {

    const aluguel = (await Aluguel.findByPk(id_aluguel, {

        include: [{ model: Republica, as: "republica" }]
    })) as any;

    if (!aluguel) throw new Error("ALUGUEL_NAO_ENCONTRADO");
    if (aluguel.republica.id_usuario !== id_usuario_logado) throw new Error("NAO_AUTORIZADO");

    if (status === "ativo" && aluguel.status !== "ativo") {

        if (aluguel.republica.vagas_disponiveis <= 0) {

            throw new Error("REPUBLICA_LOTADA");

        }

        await aluguel.republica.update({ vagas_disponiveis: aluguel.republica.vagas_disponiveis - 1 });

        await criarNotificacaoInterna(

            aluguel.id_usuario,
            "Pedido Aprovado! 🎉",
            `Parabéns! Sua solicitação para morar na república ${aluguel.republica.nome} foi aprovada. Bem-vindo(a)!`

        );

    } else if ((status === "encerrado" || status === "cancelado") && aluguel.status === "ativo") {

        await aluguel.republica.update({ vagas_disponiveis: aluguel.republica.vagas_disponiveis + 1 });

        if (status === "cancelado") {

            await criarNotificacaoInterna(

                aluguel.id_usuario,
                "Pedido Cancelado",
                `Infelizmente, a sua solicitação ou aluguel na república ${aluguel.republica.nome} foi cancelado.`

            );
        }
    }

    await aluguel.update({ status });

    return aluguel;
};

export const listarAlugueisRecebidosService = async (id_usuario_dono: number) => {

    const republicas = await Republica.findAll({

        where: { id_usuario: id_usuario_dono },

        attributes: ["id_republica"]
    });

    const idsRepublicas = republicas.map((r: any) => r.id_republica);

    if (idsRepublicas.length === 0) {

        return [];
    }

    return await Aluguel.findAll({

        where: {
            id_republica: { [Op.in]: idsRepublicas }
        },

        include: [
            {
                model: Republica,
                as: "republica",
                attributes: ["id_republica", "nome"]
            },
            {
                model: Usuario,
                as: "usuario",
                attributes: ["id_usuario", "nome", "email", "telefone"]
            }
        ],

        order: [["criado_em", "DESC"]]
    });
};

export const enviarComprovanteMatriculaService = async (id_aluguel: number, id_usuario: number, url_pdf: string) => {

    const aluguel = await Aluguel.findByPk(id_aluguel, {
        include: [{ model: Republica, as: "republica" }]
    }) as any;

    if (!aluguel) throw new Error("ALUGUEL_NAO_ENCONTRADO");
    if (aluguel.id_usuario !== id_usuario) throw new Error("NAO_AUTORIZADO");

    await aluguel.update({
        comprovante_matricula_url: url_pdf,
        status_matricula: "em_analise"
    });

    await criarNotificacaoInterna(
        aluguel.republica.id_usuario,
        "Nova Matrícula para Análise 🎓",
        `O estudante do aluguel #${aluguel.id_aluguel} enviou o comprovante de matrícula em PDF. Acesse seu painel para validar.`
    );

    return aluguel;
};

export const avaliarComprovanteMatriculaService = async (id_aluguel: number, id_anunciante: number, novoStatus: "aprovado" | "rejeitado") => {

    const aluguel = await Aluguel.findByPk(id_aluguel, {
        include: [{ model: Republica, as: "republica" }]
    }) as any;

    if (!aluguel) throw new Error("ALUGUEL_NAO_ENCONTRADO");
    if (aluguel.republica.id_usuario !== id_anunciante) throw new Error("NAO_AUTORIZADO");

    await aluguel.update({ status_matricula: novoStatus });

    const msg = novoStatus === "aprovado"
        ? "Seu comprovante de matrícula foi aprovado! Seu perfil universitário está validado."
        : "Seu comprovante de matrícula foi rejeitado. Por favor, envie um documento PDF válido e atualizado.";

    await criarNotificacaoInterna(
        aluguel.id_usuario,
        novoStatus === "aprovado" ? "Matrícula Aprovada ✅" : "Matrícula Rejeitada ❌",
        msg
    );

    return aluguel;
};