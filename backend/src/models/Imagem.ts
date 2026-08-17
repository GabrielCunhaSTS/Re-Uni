import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

interface ImagemAttributes {
    id_imagem: number;
    url: string;
    criado_em: Date;
}

class Imagem
    extends Model<ImagemAttributes>
    implements ImagemAttributes
{
    declare id_imagem: number;
    declare url: string;
    declare criado_em: Date;
}

Imagem.init(
    {
        id_imagem: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        url: {
            type: DataTypes.STRING(500),
            allowNull: false
        },

        criado_em: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: "imagens",
        modelName: "Imagem",
        timestamps: true,
        createdAt: "criado_em",
        updatedAt: false
    }
);

export default Imagem;