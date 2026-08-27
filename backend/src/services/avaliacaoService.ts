import { Op } from "sequelize";
import { Avaliacao, Aluguel, Usuario } from "../models/index.js";

export const criarAvaliacaoService = async (id_usuario: number, id_republica: number, nota: number, comentario?: string) => {
    const morador = await Aluguel.findOne({
        where: { id_usuario, id_republica, status: { [Op.in]: ["ativo", "encerrado"] } }
    });

    if (!morador) {
        throw new Error("NAO_E_MORADOR");
    }

    const avaliacaoExistente = await Avaliacao.findOne({ where: { id_usuario, id_republica } });
    if (avaliacaoExistente) {
        throw new Error("AVALIACAO_JA_EXISTE");
    }

    return await Avaliacao.create({ id_usuario, id_republica, nota, comentario });
};

export const listarAvaliacoesDaRepublicaService = async (id_republica: number) => {
    return await Avaliacao.findAll({
        where: { id_republica },
        include: [{ model: Usuario, as: "usuario", attributes: ["nome", "foto"] }],
        order: [["criado_em", "DESC"]]
    });
};