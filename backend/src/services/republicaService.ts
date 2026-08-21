import {
    Republica,
    Usuario,
    TipoRepublica,
    LocalizacaoRepublica,
    DadosRepublica,
    Estado,
    Imagem
} from "../models/index.js";

export const listarRepublicas = async () => {
    return await Republica.findAll({
        where: {
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
        ],

        order: [
            ["criado_em", "DESC"]
        ]
    });
};