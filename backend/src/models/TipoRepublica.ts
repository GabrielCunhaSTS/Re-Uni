import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

interface TipoRepublicaAttributes {
    id_tipo_republica: number;
    nome: string;
    descricao: string | null;
}

class TipoRepublica
    extends Model<TipoRepublicaAttributes>
    implements TipoRepublicaAttributes
{
    declare id_tipo_republica: number;
    declare nome: string;
    declare descricao: string | null;
}

TipoRepublica.init(
    {
        id_tipo_republica: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },

        descricao: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: "tipos_republica",
        modelName: "TipoRepublica",
        timestamps: false
    }
);

export default TipoRepublica;