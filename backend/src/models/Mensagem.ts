import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface MensagemAttributes {
    id_mensagem: number;
    id_remetente: number;
    id_destinatario: number;
    id_republica: number;
    conteudo: string;
    lido: boolean;
    criado_em?: Date;
}

interface MensagemCreationAttributes extends Optional<MensagemAttributes, "id_mensagem" | "lido" | "criado_em"> {}

export class Mensagem extends Model<MensagemAttributes, MensagemCreationAttributes> implements MensagemAttributes {
    declare id_mensagem: number;
    declare id_remetente: number;
    declare id_destinatario: number;
    declare id_republica: number;
    declare conteudo: string;
    declare lido: boolean;
    declare criado_em?: Date;
}

Mensagem.init(
    {
        id_mensagem: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_remetente: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_destinatario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_republica: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        conteudo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        lido: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        criado_em: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        tableName: "mensagens",
        modelName: "Mensagem",
        timestamps: false
    }
);