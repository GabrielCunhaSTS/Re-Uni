import {
    Republica,
    Usuario,
    TipoRepublica,
    LocalizacaoRepublica,
    DadosRepublica,
    Estado,
    Imagem
} from "../models/index.js";
import { Op } from "sequelize";

export const listarRepublicas = async (filtros?: {
    cidade?: string;
    valorMax?: number;
    valorMin?: number;
    tipo?: number;
}) => {

    const whereRepublica: any = {
        ativo: true
    };

    const whereLocalizacao: any = {};

    if (filtros?.valorMax !== undefined) {
        whereRepublica.valor_mensal = {
            [Op.lte]: filtros.valorMax
        };
    }

    if (filtros?.valorMin !== undefined) {

        whereRepublica.valor_mensal = {
            ...(whereRepublica.valor_mensal || {}),
            [Op.gte]: filtros.valorMin
        };

    }

    if (filtros?.tipo !== undefined) {
        whereRepublica.id_tipo_republica = filtros.tipo;
    }

    if (filtros?.cidade) {
        whereLocalizacao.cidade = {
            [Op.like]: `%${filtros.cidade}%`
        };
    }

    return await Republica.findAll({

        where: whereRepublica,

        include: [

            {
                model: Usuario,
                as: "anunciante",
                attributes: [
                    "id_usuario",
                    "nome",
                    "email"
                ]
            },

            {
                model: TipoRepublica,
                as: "tipo",
                attributes: [
                    "id_tipo_republica",
                    "nome",
                    "descricao"
                ]
            },

            {
                model: LocalizacaoRepublica,
                as: "localizacao",
                where: Object.keys(whereLocalizacao).length
                    ? whereLocalizacao
                    : undefined,
                include: [
                    {
                        model: Estado,
                        as: "estado",
                        attributes: [
                            "id_estado",
                            "nome",
                            "uf"
                        ]
                    }
                ]
            },

            {
                model: DadosRepublica,
                as: "dados"
            },

            {
                model: Imagem,
                as: "imagens",
                through: {
                    attributes: [
                        "principal",
                        "ordem"
                    ]
                }
            }

        ],

        order: [
            ["criado_em", "DESC"]
        ]

    });
};

export const buscarRepublicaPorId = async (id: number) => {

    return await Republica.findOne({
        where: {
            id_republica: id,
            ativo: true
        },
        include: [
            {
                model: Usuario,
                as: "anunciante",
                attributes: [
                    "id_usuario",
                    "nome",
                    "email"
                ]
            },
            {
                model: TipoRepublica,
                as: "tipo",
                attributes: [
                    "id_tipo_republica",
                    "nome",
                    "descricao"
                ]
            },
            {
                model: LocalizacaoRepublica,
                as: "localizacao",
                include: [
                    {
                        model: Estado,
                        as: "estado",
                        attributes: [
                            "id_estado",
                            "nome",
                            "UF"
                        ]
                    }
                ]
            },
            {
                model: DadosRepublica,
                as: "dados"
            },
            {
                model: Imagem,
                as: "imagens",
                through: {
                    attributes: [
                        "principal",
                        "ordem"
                    ]
                }
            }
        ]
    });
};