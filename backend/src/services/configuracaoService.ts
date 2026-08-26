import { ConfiguracaoUsuario } from "../models/index.js";

export const buscarConfiguracoesService = async (id_usuario: number) => {
    let configuracao = await ConfiguracaoUsuario.findOne({
        where: { id_usuario }
    });

    if (!configuracao) {
        configuracao = await ConfiguracaoUsuario.create({
            id_usuario,
        });
    }

    return configuracao;
};

export const atualizarConfiguracoesService = async (id_usuario: number, dadosAtualizacao: any) => {
    let configuracao = await ConfiguracaoUsuario.findOne({
        where: { id_usuario }
    });

    if (!configuracao) {
        configuracao = await ConfiguracaoUsuario.create({
            id_usuario,
            ...dadosAtualizacao
        });
        return configuracao;
    }

    await configuracao.update(dadosAtualizacao);
    return configuracao;
};