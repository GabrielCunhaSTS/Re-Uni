import { Comentario, Usuario, Republica, RespostaComentario } from "../models/index.js";

export const criarComentarioService = async (
    id_usuario: number,
    id_republica: number,
    texto: string
) => {
    const republica = await Republica.findByPk(id_republica);
    if (!republica || !republica.ativo) {
        throw new Error("REPUBLICA_NAO_ENCONTRADA");
    }

    const novoComentario = await Comentario.create({
        id_usuario,
        id_republica,
        texto
    });

    return await Comentario.findByPk(novoComentario.id_comentario, {
        include: [
            {
                model: Usuario,
                as: "usuario",
                attributes: ["id_usuario", "nome", "email"] 
            }
        ]
    });
};

export const listarComentariosDaRepublicaService = async (id_republica: number) => {
    const republica = await Republica.findByPk(id_republica);
    if (!republica || !republica.ativo) {
        throw new Error("REPUBLICA_NAO_ENCONTRADA");
    }

    const comentarios = await Comentario.findAll({
        where: { id_republica },
        include: [
            {
                model: Usuario,
                as: "usuario",
                attributes: ["id_usuario", "nome"]
            },
            {
                model: RespostaComentario,
                as: "respostas", 
                include: [
                    {
                        model: Usuario,
                        as: "usuario",
                        attributes: ["id_usuario", "nome"]
                    }
                ]
            }
        ],
        order: [
            ["criado_em", "DESC"],
            [{ model: RespostaComentario, as: "respostas" }, "criado_em", "ASC"] 
        ]
    });

    return comentarios;
};

export const deletarComentarioService = async (id_comentario: number, id_usuario: number) => {
    const comentario = await Comentario.findByPk(id_comentario);

    if (!comentario) {
        throw new Error("COMENTARIO_NAO_ENCONTRADA");
    }

    if (comentario.id_usuario !== id_usuario) {
        throw new Error("NAO_AUTORIZADO");
    }

    await comentario.destroy();
};