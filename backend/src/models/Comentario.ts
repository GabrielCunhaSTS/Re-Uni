import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";
interface ComentarioAttributes {
    id_comentario: number;
    id_usuario: number;
    id_republica: number;
    texto: string;
    criado_em: Date;
    atualizado_em: Date;
}
interface ComentarioCreationAttributes
    extends Optional<
        ComentarioAttributes,
        | "id_comentario"
        | "criado_em"
        | "atualizado_em"
    > {}
class Comentario
    extends Model<
        ComentarioAttributes,
        ComentarioCreationAttributes
    >
    implements ComentarioAttributes
{
    declare id_comentario: number;
    declare id_usuario: number;
    declare id_republica: number;
    declare texto: string;
    declare criado_em: Date;
    declare atualizado_em: Date;
}
Comentario.init(
    {
        id_comentario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_republica: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        texto: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        criado_em: {
            type: DataTypes.DATE,
            allowNull: false
        },
        atualizado_em: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: "comentarios",
        modelName: "Comentario",
        timestamps: true,
        createdAt: "criado_em",
        updatedAt: "atualizado_em"
    }
);
export default Comentario;