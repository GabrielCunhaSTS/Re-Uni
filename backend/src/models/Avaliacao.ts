import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
class Avaliacao extends Model {
    declare id_avaliacao: number;
    declare id_usuario: number;
    declare id_republica: number;
    declare nota: number;
    declare comentario: string | null;
    declare criado_em: Date;
    declare atualizado_em: Date;
}
Avaliacao.init(
    {
        id_avaliacao: {
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
        nota: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        comentario: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: "avaliacoes",
        timestamps: true,
        createdAt: "criado_em",
        updatedAt: "atualizado_em"
    }
);
export default Avaliacao;