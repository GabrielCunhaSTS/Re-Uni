import sequelize from "../config/database.js";
import { Imagem, ImagemRepublica, Republica } from "../models/index.js";
import fs from "fs";
import path from "path";
export const adicionarImagens = async (
    id_republica: number,
    id_usuario: number,
    arquivos: Express.Multer.File[]
) => {
    return await sequelize.transaction(async (t) => {
        const republica = await Republica.findByPk(id_republica);
        if (!republica || !republica.ativo) {
            throw new Error("REPUBLICA_NAO_ENCONTRADA");
        }
        if (republica.id_usuario !== id_usuario) {
            throw new Error("NAO_AUTORIZADO");
        }
        const qtdImagensAtuais = await ImagemRepublica.count({
            where: { id_republica }
        });
        const imagensSalvas = [];
        for (let i = 0; i < arquivos.length; i++) {
            const arquivo = arquivos[i]!;
            const url_imagem = `/uploads/${arquivo.filename}`;
            const ordem_atual = qtdImagensAtuais + i;
            const isPrincipal = ordem_atual === 0;
            const novaImagem = await Imagem.create(
                { url: url_imagem },
                { transaction: t }
            );
            await ImagemRepublica.create(
                {
                    id_republica: id_republica,
                    id_imagem: novaImagem.id_imagem,
                    principal: isPrincipal,
                    ordem: ordem_atual
                },
                { transaction: t }
            );
            imagensSalvas.push(novaImagem);
        }
        return imagensSalvas;
    });
};
export const deletarImagem = async (
    id_republica: number,
    id_imagem: number,
    id_usuario: number
) => {
    const republica = await Republica.findByPk(id_republica);
    if (!republica || !republica.ativo) {
        throw new Error("REPUBLICA_NAO_ENCONTRADA");
    }
    if (republica.id_usuario !== id_usuario) {
        throw new Error("NAO_AUTORIZADO");
    }
    const imagemVinculo = await ImagemRepublica.findOne({
        where: { id_republica, id_imagem }
    });
    if (!imagemVinculo) {
        throw new Error("IMAGEM_NAO_ENCONTRADA");
    }
    const imagem = await Imagem.findByPk(id_imagem);
    await sequelize.transaction(async (t) => {
        await imagemVinculo.destroy({ transaction: t });
        if (imagem) {
            await imagem.destroy({ transaction: t });
        }
    });
    if (imagem) {
        const nomeArquivo = imagem.url.split("/").pop();
        if (nomeArquivo) {
            const caminhoFisico = path.join(process.cwd(), "uploads", nomeArquivo);
            if (fs.existsSync(caminhoFisico)) {
                fs.unlinkSync(caminhoFisico);
            }
        }
    }
};