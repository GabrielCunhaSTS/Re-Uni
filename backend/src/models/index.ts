import Usuario from "./Usuario.js";
import Estado from "./Estado.js";
import TipoRepublica from "./TipoRepublica.js";
import Republica from "./Republica.js";
import LocalizacaoRepublica from "./LocalizacaoRepublica.js";
import DadosRepublica from "./DadosRepublica.js";
import Imagem from "./Imagem.js";
import ImagemRepublica from "./ImagemRepublica.js";
import Favorito from "./Favorito.js";
import Comentario from "./Comentario.js";
import RespostaComentario from "./RespostaComentario.js";
import Aluguel from "./Aluguel.js";
import ConfiguracaoUsuario from "./ConfiguracaoUsuario.js";
import Avaliacao from "./Avaliacao.js";
import Notificacao from "./Notificacao.js";
import { Mensagem } from "./Mensagem.js";
import { Comprovante } from "./Comprovante.js";
import { Manutencao } from "./Manutencao.js";
import { Despesa } from "./Despesa.js";
import { DespesaInquilino } from "./DespesaInquilino.js";

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
Republica.hasMany(Favorito, {
    foreignKey: "id_republica",
    as: "favoritos"
});
Favorito.belongsTo(Republica, {
    foreignKey: "id_republica",
    as: "republica"
});
Usuario.belongsToMany(Republica, {
    through: Favorito,
    foreignKey: "id_usuario",
    otherKey: "id_republica",
    as: "republicasFavoritas"
});
Republica.belongsToMany(Usuario, {
    through: Favorito,
    foreignKey: "id_republica",
    otherKey: "id_usuario",
    as: "favoritadoPor"
});
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
Republica.hasMany(Aluguel, {
    foreignKey: "id_republica",
    as: "alugueis"
});
Aluguel.belongsTo(Republica, {
    foreignKey: "id_republica",
    as: "republica"
});

Avaliacao.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });
Usuario.hasMany(Avaliacao, { foreignKey: "id_usuario", as: "avaliacoes" });
Avaliacao.belongsTo(Republica, { foreignKey: "id_republica", as: "republica" });

Republica.hasMany(Avaliacao, { foreignKey: "id_republica", as: "avaliacoes" });
Notificacao.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });
Usuario.hasMany(Notificacao, { foreignKey: "id_usuario", as: "notificacoes" });

Usuario.hasMany(Mensagem, {
    foreignKey: "id_remetente",
    as: "mensagensEnviadas"
});

Mensagem.belongsTo(Usuario, {
    foreignKey: "id_remetente",
    as: "remetente"
});

Usuario.hasMany(Mensagem, {
    foreignKey: "id_destinatario",
    as: "mensagensRecebidas"
});

Mensagem.belongsTo(Usuario, {
    foreignKey: "id_destinatario",
    as: "destinatario"
});

Republica.hasMany(Mensagem, {
    foreignKey: "id_republica",
    as: "mensagens"
});
Mensagem.belongsTo(Republica, {
    foreignKey: "id_republica",
    as: "republica"
});
Aluguel.hasMany(Comprovante, {
    foreignKey: "id_aluguel",
    as: "comprovantes"
});
Comprovante.belongsTo(Aluguel, {
    foreignKey: "id_aluguel",
    as: "aluguel"
});
Usuario.hasMany(Comprovante, {
    foreignKey: "id_estudante",
    as: "comprovantesEnviados"
});
Comprovante.belongsTo(Usuario, {
    foreignKey: "id_estudante",
    as: "estudante"
});


Republica.hasMany(Manutencao, {
    foreignKey: "id_republica",
    as: "manutencoes"
});
Manutencao.belongsTo(Republica, {
    foreignKey: "id_republica",
    as: "republica"
});

Usuario.hasMany(Manutencao, {
    foreignKey: "id_usuario",
    as: "manutencoes"
});
Manutencao.belongsTo(Usuario, {
    foreignKey: "id_usuario",
    as: "usuario"
});

Republica.hasMany(Despesa, { foreignKey: "id_republica", as: "despesas" });
Despesa.belongsTo(Republica, { foreignKey: "id_republica", as: "republica" });

Despesa.hasMany(DespesaInquilino, { foreignKey: "id_despesa", as: "divisoes" });
DespesaInquilino.belongsTo(Despesa, { foreignKey: "id_despesa", as: "despesa" });

Usuario.hasMany(DespesaInquilino, { foreignKey: "id_usuario", as: "minhasDespesas" });
DespesaInquilino.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

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
    ConfiguracaoUsuario,
    Avaliacao,
    Notificacao,
    Mensagem,
    Comprovante,
    Manutencao,
    Despesa,
    DespesaInquilino
};