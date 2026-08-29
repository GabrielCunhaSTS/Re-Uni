import { Favorito, Republica } from "../models/index.js";
export const alternarFavoritoService = async (id_usuario: number, id_republica: number) => {
    const republica = await Republica.findByPk(id_republica);
    if (!republica || !republica.ativo) {
        throw new Error("REPUBLICA_NAO_ENCONTRADA");
    }
    const favoritoExistente = await Favorito.findOne({
        where: { id_usuario, id_republica }
    });
    if (favoritoExistente) {
        await favoritoExistente.destroy();
        return { favoritado: false, mensagem: "República removida dos favoritos." };
    } else {
        await Favorito.create({ id_usuario, id_republica });
        return { favoritado: true, mensagem: "República adicionada aos favoritos com sucesso!" };
    }
};