import { Mensagem, Usuario, Republica, Notificacao } from "../models/index.js";
import { Op } from "sequelize";

export const enviarMensagemService = async (id_remetente: number, dados: { id_destinatario: number; id_republica: number; conteudo: string }) => {
    const mensagem = await Mensagem.create({
        id_remetente,
        id_destinatario: dados.id_destinatario,
        id_republica: dados.id_republica,
        conteudo: dados.conteudo,
    });

    const remetente = await Usuario.findByPk(id_remetente, { attributes: ["nome"] });
    const republica = await Republica.findByPk(dados.id_republica, { attributes: ["nome"] });

    await Notificacao.create({
        id_usuario: dados.id_destinatario,
        titulo: "Nova mensagem recebida",
        mensagem: `${remetente?.nome || 'Alguém'} enviou uma mensagem sobre a república ${republica?.nome || ''}.`,
        lido: false
    });

    return mensagem;
};

export const listarConversaService = async (id_usuario: number, id_outro_usuario: number, id_republica: number) => {
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
        if (msg.id_remetente !== id_anunciante && msg.remetente) {
            usuariosMap.set(msg.remetente.id_usuario, msg.remetente);
        }
        if (msg.id_destinatario !== id_anunciante && msg.destinatario) {
            usuariosMap.set(msg.destinatario.id_usuario, msg.destinatario);
        }
    });

    return Array.from(usuariosMap.values());
};