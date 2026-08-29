import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";


export class Mensagem extends Model {
    public id_mensagem!: number;
    public id_remetente!: number;
    public id_destinatario!: number;
    public id_republica!: number;
    public conteudo!: string;
    public lido!: boolean;
    public readonly criado_em!: Date;
}

Mensagem.init(
    {
        id_mensagem: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_remetente: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_destinatario: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_republica: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        conteudo: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        lido: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "Mensagem",
        tableName: "mensagens",
        timestamps: true,
        createdAt: "criado_em",
        updatedAt: false,
    }
);