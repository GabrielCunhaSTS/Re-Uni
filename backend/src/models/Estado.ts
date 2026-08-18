import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface EstadoAttributes {
    id_estado: number;
    nome: string;
    uf: string;
}

class Estado
    extends Model<EstadoAttributes>
    implements EstadoAttributes
{
    declare id_estado: number;
    declare nome: string;
    declare uf: string;
}

Estado.init(
    {
        id_estado: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nome: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        uf: {
            type: DataTypes.CHAR(2),
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize,
        tableName: "estados",
        modelName: "Estado",
        timestamps: false
    }
);

export default Estado;