import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Notificacao extends Model {
    declare id_notificacao: number;
    declare id_usuario: number;
    declare titulo: string;
    declare mensagem: string;
    declare lida: boolean;
    declare criado_em: Date;
}

Notificacao.init(
    {
        id_notificacao: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        id_usuario: { type: DataTypes.INTEGER, allowNull: false },
        titulo: { type: DataTypes.STRING(150), allowNull: false },
        mensagem: { type: DataTypes.TEXT, allowNull: false },
        lida: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
        sequelize,
        tableName: "notificacoes",
        timestamps: true,
        createdAt: "criado_em",
        updatedAt: false
    }
);

export default Notificacao;