import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface ConfiguracaoUsuarioAttributes {
    id_usuario: number;
    tema: "claro" | "escuro" | "sistema";
    idioma: "pt-BR" | "en" | "ko" | "ja" | "de";
    chave_pix: string | null;
}

interface ConfiguracaoUsuarioCreationAttributes
    extends Optional<ConfiguracaoUsuarioAttributes, "tema" | "idioma" | "chave_pix"> {}

class ConfiguracaoUsuario
    extends Model<
        ConfiguracaoUsuarioAttributes,
        ConfiguracaoUsuarioCreationAttributes
    >
    implements ConfiguracaoUsuarioAttributes
{
    declare id_usuario: number;
    declare tema: "claro" | "escuro" | "sistema";
    declare idioma: "pt-BR" | "en" | "ko" | "ja" | "de";
    declare chave_pix: string | null;
}

ConfiguracaoUsuario.init(
    {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        tema: {
            type: DataTypes.ENUM("claro", "escuro", "sistema"),
            defaultValue: "sistema"
        },
        idioma: {
            type: DataTypes.ENUM("pt-BR", "en", "ko", "ja", "de"),
            defaultValue: "pt-BR"
        },
        chave_pix: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: "configuracoes_usuario",
        modelName: "ConfiguracaoUsuario",
        timestamps: false
    }
);

export default ConfiguracaoUsuario;