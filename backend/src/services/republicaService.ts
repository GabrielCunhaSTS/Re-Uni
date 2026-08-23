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


export interface CriarRepublicaDTO {
    id_tipo_republica: number;
    nome: string;
    descricao?: string | null;
    valor_mensal: number;
    vagas_total: number;
    vagas_disponiveis: number;
    localizacao: {
        cep?: string | null;
        endereco?: string | null;
        numero?: string | null;
        complemento?: string | null;
        bairro: string;
        cidade: string;
        id_estado: number;
        latitude?: number | null;
        longitude?: number | null;
    };
    dados?: {
        quartos?: number;
        banheiros?: number;
        moradores?: number;
        mobiliada?: boolean;
        possui_internet?: boolean;
        possui_garagem?: boolean;
        possui_lavanderia?: boolean;
        possui_area_lazer?: boolean;
        aceita_pets?: boolean;
    };
}

export const criarRepublica = async (
    dadosEntrada: CriarRepublicaDTO,
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
                vagas_disponiveis: dadosEntrada.vagas_disponiveis,
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
    cidade?: string;
    valorMax?: number;
    valorMin?: number;
    tipo?: number;
}) => {
    
};

export const buscarRepublicaPorId = async (id: number) => {
    
};