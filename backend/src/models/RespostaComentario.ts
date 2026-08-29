import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";
interface RespostaComentarioAttributes {
    id_resposta: number;
    id_comentario: number;
    id_usuario: number;
    texto: string;
    criado_em: Date;
    atualizado_em: Date;
}
interface RespostaComentarioCreationAttributes
    extends Optional<
        RespostaComentarioAttributes,
        | "id_resposta"
        | "criado_em"
        | "atualizado_em"
    > {}
class RespostaComentario
    extends Model<
        RespostaComentarioAttributes,
        RespostaComentarioCreationAttributes
    >
    implements RespostaComentarioAttributes
{
    declare id_resposta: number;
    declare id_comentario: number;
    declare id_usuario: number;
    declare texto: string;
    declare criado_em: Date;
    declare atualizado_em: Date;
}
RespostaComentario.init(
    {
        id_resposta: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_comentario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_usuario: {
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
        tableName: "respostas_comentario",
        modelName: "RespostaComentario",
        timestamps: true,
        createdAt: "criado_em",
        updatedAt: "atualizado_em"
    }
);
export default RespostaComentario;