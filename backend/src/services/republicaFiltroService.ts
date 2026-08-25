import { Republica, LocalizacaoRepublica, Imagem, Estado } from "../models/index.js";
import { Op } from "sequelize";

interface FiltrosRepublica {
    cidade?: string | undefined;
    id_estado?: string | undefined;
    id_tipo_republica?: string | undefined;
    preco_min?: string | undefined;
    preco_max?: string | undefined;
    pesquisa?: string | undefined;
}

export const filtrarRepublicasService = async (filtros: FiltrosRepublica) => {
    const whereRepublica: any = { ativo: true };

    if (filtros.id_tipo_republica) {
        whereRepublica.id_tipo_republica = Number(filtros.id_tipo_republica);
    }

    if (filtros.pesquisa) {
        whereRepublica[Op.or] = [
            { nome: { [Op.like]: `%${filtros.pesquisa}%` } },
            { descricao: { [Op.like]: `%${filtros.pesquisa}%` } }
        ];
    }

    if (filtros.preco_min || filtros.preco_max) {
        whereRepublica.valor_mensal = {};
        if (filtros.preco_min) {
            whereRepublica.valor_mensal[Op.gte] = Number(filtros.preco_min);
        }
        if (filtros.preco_max) {
            whereRepublica.valor_mensal[Op.lte] = Number(filtros.preco_max);
        }
    }

    const whereLocalizacao: any = {};
    if (filtros.cidade) {
        whereLocalizacao.cidade = { [Op.like]: `%${filtros.cidade}%` };
    }
    if (filtros.id_estado) {
        whereLocalizacao.id_estado = Number(filtros.id_estado);
    }

    const republicas = await Republica.findAll({
        where: whereRepublica,
        include: [
            {
                model: LocalizacaoRepublica,
                as: "localizacao",
                where: Object.keys(whereLocalizacao).length > 0 ? whereLocalizacao : undefined,
                required: Object.keys(whereLocalizacao).length > 0,
                include: [
                    {
                        model: Estado,
                        as: "estado"
                    }
                ]
            },
            {
                model: Imagem,
                as: "imagens"
            }
        ],
        order: [["criado_em", "DESC"]]
    });

    return republicas;
};