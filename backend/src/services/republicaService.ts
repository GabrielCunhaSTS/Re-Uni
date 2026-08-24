import sequelize from "../config/database.js";
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
import type { CreateRepublicaInput, UpdateRepublicaInput } from "../schemas/republicaSchema.js";

export const criarRepublica = async (
    dadosEntrada: CreateRepublicaInput,
    id_usuario: number
) => {
    return await sequelize.transaction(async (t) => {
        const novaRepublica = await Republica.create(
            {
                id_usuario,
                id_tipo_republica: dadosEntrada.id_tipo_republica,
                nome: dadosEntrada.nome,
                descricao: dadosEntrada.descricao ?? null,
                valor_mensal: dadosEntrada.valor_mensal,
                vagas_total: dadosEntrada.vagas_total,
                vagas_disponiveis:
                    dadosEntrada.vagas_disponiveis !== undefined
                        ? dadosEntrada.vagas_disponiveis
                        : dadosEntrada.vagas_total,
                ativo: true
            },
            { transaction: t }
        );

        await LocalizacaoRepublica.create(
            {
                id_republica: novaRepublica.id_republica,
                cep: dadosEntrada.localizacao.cep ?? null,
                endereco: dadosEntrada.localizacao.endereco ?? null,
                numero: dadosEntrada.localizacao.numero ?? null,
                complemento: dadosEntrada.localizacao.complemento ?? null,
                bairro: dadosEntrada.localizacao.bairro,
                cidade: dadosEntrada.localizacao.cidade,
                id_estado: dadosEntrada.localizacao.id_estado,
                latitude: dadosEntrada.localizacao.latitude ?? null,
                longitude: dadosEntrada.localizacao.longitude ?? null
            },
            { transaction: t }
        );

        await DadosRepublica.create(
            {
                id_republica: novaRepublica.id_republica,
                quartos: dadosEntrada.dados?.quartos ?? 0,
                banheiros: dadosEntrada.dados?.banheiros ?? 0,
                moradores: dadosEntrada.dados?.moradores ?? 0,
                mobiliada: dadosEntrada.dados?.mobiliada ?? false,
                possui_internet: dadosEntrada.dados?.possui_internet ?? false,
                possui_garagem: dadosEntrada.dados?.possui_garagem ?? false,
                possui_lavanderia: dadosEntrada.dados?.possui_lavanderia ?? false,
                possui_area_lazer: dadosEntrada.dados?.possui_area_lazer ?? false,
                aceita_pets: dadosEntrada.dados?.aceita_pets ?? false
            },
            { transaction: t }
        );

        return await Republica.findByPk(novaRepublica.id_republica, {
            include: [
                {
                    model: Usuario,
                    as: "anunciante",
                    attributes: ["id_usuario", "nome", "email"]
                },
                {
                    model: TipoRepublica,
                    as: "tipo",
                    attributes: ["id_tipo_republica", "nome", "descricao"]
                },
                {
                    model: LocalizacaoRepublica,
                    as: "localizacao",
                    include: [
                        {
                            model: Estado,
                            as: "estado",
                            attributes: ["id_estado", "nome", "uf"]
                        }
                    ]
                },
                {
                    model: DadosRepublica,
                    as: "dados"
                }
            ],
            transaction: t
        });
    });
};

export const listarRepublicas = async (filtros?: {
    cidade?: string | undefined;
    valorMax?: number | undefined;
    valorMin?: number | undefined;
    tipo?: number | undefined;
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
                attributes: ["id_usuario", "nome", "email"]
            },
            {
                model: TipoRepublica,
                as: "tipo",
                attributes: ["id_tipo_republica", "nome", "descricao"]
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
                        attributes: ["id_estado", "nome", "uf"]
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
                    attributes: ["principal", "ordem"]
                }
            }
        ],
        order: [["criado_em", "DESC"]]
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
                attributes: ["id_usuario", "nome", "email"]
            },
            {
                model: TipoRepublica,
                as: "tipo",
                attributes: ["id_tipo_republica", "nome", "descricao"]
            },
            {
                model: LocalizacaoRepublica,
                as: "localizacao",
                include: [
                    {
                        model: Estado,
                        as: "estado",
                        attributes: ["id_estado", "nome", "uf"]
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
                    attributes: ["principal", "ordem"]
                }
            }
        ]
    });
};

export const atualizarRepublica = async (
    id_republica: number,
    id_usuario: number,
    dadosEntrada: UpdateRepublicaInput
) => {
    
    await sequelize.transaction(async (t) => {
        const republica = await Republica.findByPk(id_republica);

        if (!republica) {
            throw new Error("REPUBLICA_NAO_ENCONTRADA");
        }

        if (republica.id_usuario !== id_usuario) {
            throw new Error("NAO_AUTORIZADO");
        }

        await republica.update({
            id_tipo_republica: dadosEntrada.id_tipo_republica ?? republica.id_tipo_republica,
            nome: dadosEntrada.nome ?? republica.nome,
            descricao: dadosEntrada.descricao ?? republica.descricao,
            valor_mensal: dadosEntrada.valor_mensal ?? republica.valor_mensal,
            vagas_total: dadosEntrada.vagas_total ?? republica.vagas_total,
            vagas_disponiveis: dadosEntrada.vagas_disponiveis ?? republica.vagas_disponiveis,
        }, { transaction: t });

        if (dadosEntrada.localizacao) {
            const dadosLocalizacao = Object.fromEntries(
                Object.entries(dadosEntrada.localizacao).filter(([_, valor]) => valor !== undefined)
            ) as any;

            await LocalizacaoRepublica.update(
                dadosLocalizacao,
                { where: { id_republica: republica.id_republica }, transaction: t }
            );
        }

        if (dadosEntrada.dados) {
            const dadosExtras = Object.fromEntries(
                Object.entries(dadosEntrada.dados).filter(([_, valor]) => valor !== undefined)
            ) as any;

            await DadosRepublica.update(
                dadosExtras,
                { where: { id_republica: republica.id_republica }, transaction: t }
            );
        }
    }); 

    
    return await buscarRepublicaPorId(id_republica); 
};

export const deletarRepublica = async (
    id_republica: number,
    id_usuario: number
) => {
    
    const republica = await Republica.findByPk(id_republica);

    
    if (!republica || !republica.ativo) {
        throw new Error("REPUBLICA_NAO_ENCONTRADA");
    }

    
    if (republica.id_usuario !== id_usuario) {
        throw new Error("NAO_AUTORIZADO");
    }

    
    await republica.update({ ativo: false });
};