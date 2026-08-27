import { Notificacao } from "../models/index.js";

export const criarNotificacaoInterna = async (id_usuario: number, titulo: string, mensagem: string) => {
    return await Notificacao.create({ id_usuario, titulo, mensagem });
};

export const listarNotificacoesUsuarioService = async (id_usuario: number) => {
    return await Notificacao.findAll({
        where: { id_usuario },
        order: [["criado_em", "DESC"]]
    });
};

export const marcarComoLidaService = async (id_notificacao: number, id_usuario: number) => {
    const notificacao = await Notificacao.findOne({ where: { id_notificacao, id_usuario } });
    if (!notificacao) throw new Error("NOTIFICACAO_NAO_ENCONTRADA");

    await notificacao.update({ lida: true });
    return notificacao;
};