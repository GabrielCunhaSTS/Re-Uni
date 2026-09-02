import { Mensagem, Usuario, Republica, Notificacao } from "../models/index.js";
import { Op } from "sequelize";

export const enviarMensagemService = async (id_remetente: number, dados: { id_destinatario: number; id_republica: number; conteudo: string }) => {
    const mensagem = await Mensagem.create({
        id_remetente,
        id_destinatario: dados.id_destinatario,
        id_republica: dados.id_republica,
        conteudo: dados.conteudo,
        lido: false
    });

    const remetente = await Usuario.findByPk(id_remetente, { attributes: ["nome"] });
    const republica = await Republica.findByPk(dados.id_republica, { attributes: ["nome"] });

    await Notificacao.create({
        id_usuario: dados.id_destinatario,
        titulo: "Nova mensagem recebida",
        mensagem: `${remetente?.nome || 'Alguém'} enviou uma mensagem sobre a república ${republica?.nome || ''}.`,
        lida: false
    });

    return mensagem;
};

export const listarConversaService = async (id_usuario: number, id_outro_usuario: number, id_republica: number) => {
    await Mensagem.update(
        { lido: true },
        {
            where: {
                id_republica,
                id_destinatario: id_usuario,
                id_remetente: id_outro_usuario,
                lido: false
            }
        }
    );

    return await Mensagem.findAll({
        where: {
            id_republica,
            [Op.or]: [
                { id_remetente: id_usuario, id_destinatario: id_outro_usuario },
                { id_remetente: id_outro_usuario, id_destinatario: id_usuario },
            ],
        },
        include: [
            { model: Usuario, as: "remetente", attributes: ["id_usuario", "nome"] }
        ],
        order: [["criado_em", "ASC"]],
    });
};

export const listarContatosChatService = async (id_anunciante: number, id_republica: number) => {
    const mensagens = await Mensagem.findAll({
        where: { id_republica },
        include: [
            { model: Usuario, as: "remetente", attributes: ["id_usuario", "nome", "email"] },
            { model: Usuario, as: "destinatario", attributes: ["id_usuario", "nome", "email"] }
        ]
    });

    const usuariosMap = new Map();

    mensagens.forEach((msg: any) => {
        let contato = null;

        if (msg.id_remetente !== id_anunciante && msg.remetente) {
            contato = msg.remetente;
        } else if (msg.id_destinatario !== id_anunciante && msg.destinatario) {
            contato = msg.destinatario;
        }

        if (contato) {
            if (!usuariosMap.has(contato.id_usuario)) {
                const dadosContato = typeof contato.toJSON === 'function' ? contato.toJSON() : contato;

                usuariosMap.set(contato.id_usuario, {
                    ...dadosContato,
                    naoLidas: 0
                });
            }

            if (msg.id_destinatario === id_anunciante && !msg.lido) {
                usuariosMap.get(contato.id_usuario).naoLidas += 1;
            }
        }
    });

    return Array.from(usuariosMap.values());
};

export const contarMensagensNaoLidasService = async (id_usuario: number) => {
    const mensagens = await Mensagem.findAll({
        where: {
            id_destinatario: id_usuario,
            lido: false
        },
        attributes: ['id_republica']
    });

    const contagem: Record<number, number> = {};
    mensagens.forEach((m: any) => {
        const id = m.id_republica;
        contagem[id] = (contagem[id] || 0) + 1;
    });

    return contagem;
};