import Usuario from "./Usuario";
import Estado from "./Estado";
import TipoRepublica from "./TipoRepublica";
import Republica from "./Republica";
import LocalizacaoRepublica from "./LocalizacaoRepublica";
import DadosRepublica from "./DadosRepublica";
import Imagem from "./Imagem";
import ImagemRepublica from "./ImagemRepublica";
import Favorito from "./Favorito";
import Comentario from "./Comentario";
import RespostaComentario from "./RespostaComentario";
import Aluguel from "./Aluguel";
import ConfiguracaoUsuario from "./ConfiguracaoUsuario";

/*
|--------------------------------------------------------------------------
| USUARIO
|--------------------------------------------------------------------------
*/

Usuario.hasMany(Republica, {
    foreignKey: "id_usuario",
    as: "republicas"
});

Republica.belongsTo(Usuario, {
    foreignKey: "id_usuario",
    as: "anunciante"
});

Usuario.hasMany(Favorito, {
    foreignKey: "id_usuario",
    as: "favoritos"
});

Favorito.belongsTo(Usuario, {
    foreignKey: "id_usuario",
    as: "usuario"
});

Usuario.hasMany(Comentario, {
    foreignKey: "id_usuario",
    as: "comentarios"
});

Comentario.belongsTo(Usuario, {
    foreignKey: "id_usuario",
    as: "usuario"
});

Usuario.hasMany(RespostaComentario, {
    foreignKey: "id_usuario",
    as: "respostas"
});

RespostaComentario.belongsTo(Usuario, {
    foreignKey: "id_usuario",
    as: "usuario"
});

Usuario.hasMany(Aluguel, {
    foreignKey: "id_usuario",
    as: "alugueis"
});

Aluguel.belongsTo(Usuario, {
    foreignKey: "id_usuario",
    as: "usuario"
});

Usuario.hasOne(ConfiguracaoUsuario, {
    foreignKey: "id_usuario",
    as: "configuracao"
});

ConfiguracaoUsuario.belongsTo(Usuario, {
    foreignKey: "id_usuario",
    as: "usuario"
});

/*
|--------------------------------------------------------------------------
| REPUBLICA
|--------------------------------------------------------------------------
*/

TipoRepublica.hasMany(Republica, {
    foreignKey: "id_tipo_republica",
    as: "republicas"
});

Republica.belongsTo(TipoRepublica, {
    foreignKey: "id_tipo_republica",
    as: "tipo"
});

Republica.hasOne(LocalizacaoRepublica, {
    foreignKey: "id_republica",
    as: "localizacao"
});

LocalizacaoRepublica.belongsTo(Republica, {
    foreignKey: "id_republica",
    as: "republica"
});

Estado.hasMany(LocalizacaoRepublica, {
    foreignKey: "id_estado",
    as: "localizacoes"
});

LocalizacaoRepublica.belongsTo(Estado, {
    foreignKey: "id_estado",
    as: "estado"
});

Republica.hasOne(DadosRepublica, {
    foreignKey: "id_republica",
    as: "dados"
});

DadosRepublica.belongsTo(Republica, {
    foreignKey: "id_republica",
    as: "republica"
});

/*
|--------------------------------------------------------------------------
| IMAGENS
|--------------------------------------------------------------------------
*/

Republica.belongsToMany(Imagem, {
    through: ImagemRepublica,
    foreignKey: "id_republica",
    otherKey: "id_imagem",
    as: "imagens"
});

Imagem.belongsToMany(Republica, {
    through: ImagemRepublica,
    foreignKey: "id_imagem",
    otherKey: "id_republica",
    as: "republicas"
});

Republica.hasMany(ImagemRepublica, {
    foreignKey: "id_republica",
    as: "imagensRepublica"
});

ImagemRepublica.belongsTo(Republica, {
    foreignKey: "id_republica",
    as: "republica"
});

ImagemRepublica.belongsTo(Imagem, {
    foreignKey: "id_imagem",
    as: "imagem"
});

/*
|--------------------------------------------------------------------------
| FAVORITOS
|--------------------------------------------------------------------------
*/

Republica.hasMany(Favorito, {
    foreignKey: "id_republica",
    as: "favoritos"
});

Favorito.belongsTo(Republica, {
    foreignKey: "id_republica",
    as: "republica"
});

/*
|--------------------------------------------------------------------------
| COMENTARIOS
|--------------------------------------------------------------------------
*/

Republica.hasMany(Comentario, {
    foreignKey: "id_republica",
    as: "comentarios"
});

Comentario.belongsTo(Republica, {
    foreignKey: "id_republica",
    as: "republica"
});

Comentario.hasMany(RespostaComentario, {
    foreignKey: "id_comentario",
    as: "respostas"
});

RespostaComentario.belongsTo(Comentario, {
    foreignKey: "id_comentario",
    as: "comentario"
});

/*
|--------------------------------------------------------------------------
| ALUGUEIS
|--------------------------------------------------------------------------
*/

Republica.hasMany(Aluguel, {
    foreignKey: "id_republica",
    as: "alugueis"
});

Aluguel.belongsTo(Republica, {
    foreignKey: "id_republica",
    as: "republica"
});

export {
    Usuario,
    Estado,
    TipoRepublica,
    Republica,
    LocalizacaoRepublica,
    DadosRepublica,
    Imagem,
    ImagemRepublica,
    Favorito,
    Comentario,
    RespostaComentario,
    Aluguel,
    ConfiguracaoUsuario
};