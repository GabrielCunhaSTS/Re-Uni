import { RespostaComentario, Comentario, Usuario } from "../models/index.js";
export const criarRespostaService = async (
    id_usuario: number,
    id_comentario: number,
    texto: string
) => {
    const comentario = await Comentario.findByPk(id_comentario);
    if (!comentario) {
        throw new Error("COMENTARIO_NAO_ENCONTRADO");
    }
    const novaResposta = await RespostaComentario.create({
        id_usuario,
        id_comentario,
        texto
    });
    return await RespostaComentario.findByPk(novaResposta.id_resposta, {
        include: [
            {
                model: Usuario,
                as: "usuario",
                attributes: ["id_usuario", "nome"]
            }
        ]
    });
};
export const deletarRespostaService = async (id_resposta: number, id_usuario: number) => {
    const resposta = await RespostaComentario.findByPk(id_resposta);
    if (!resposta) {
        throw new Error("RESPOSTA_NAO_ENCONTRADA");
    }
    if (resposta.id_usuario !== id_usuario) {
        throw new Error("NAO_AUTORIZADO");
    }
    await resposta.destroy();
};