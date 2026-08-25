import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface FavoritoAttributes {
    id_usuario: number;
    id_republica: number;
    criado_em: Date;
}

export interface FavoritoCreationAttributes extends Optional<FavoritoAttributes, "criado_em"> {}

class Favorito
    extends Model<FavoritoAttributes, FavoritoCreationAttributes> 
    implements FavoritoAttributes
{
    declare id_usuario: number;
    declare id_republica: number;
    declare criado_em: Date;
}

Favorito.init(
    {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },

        id_republica: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },

        criado_em: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        tableName: "favoritos",
        modelName: "Favorito",
        timestamps: true,
        createdAt: "criado_em",
        updatedAt: false
    }
);

export default Favorito;