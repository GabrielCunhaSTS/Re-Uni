import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";
interface ImagemRepublicaAttributes {
    id_republica: number;
    id_imagem: number;
    principal: boolean;
    ordem: number;
}
class ImagemRepublica
    extends Model<ImagemRepublicaAttributes>
    implements ImagemRepublicaAttributes
{
    declare id_republica: number;
    declare id_imagem: number;
    declare principal: boolean;
    declare ordem: number;
}
ImagemRepublica.init(
    {
        id_republica: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        id_imagem: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        principal: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        ordem: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },
    {
        sequelize,
        tableName: "imagens_republica",
        modelName: "ImagemRepublica",
        timestamps: false
    }
);
export default ImagemRepublica;