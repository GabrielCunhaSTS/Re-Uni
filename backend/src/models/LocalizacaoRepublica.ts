import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";
interface LocalizacaoRepublicaAttributes {
    id_localizacao: number;
    id_republica: number;
    cep: string | null;
    endereco: string | null;
    numero: string | null;
    complemento: string | null;
    bairro: string;
    cidade: string;
    id_estado: number;
    latitude: number | null;
    longitude: number | null;
}
export interface LocalizacaoRepublicaCreationAttributes
    extends Optional<
        LocalizacaoRepublicaAttributes,
        | "id_localizacao"
        | "cep"
        | "endereco"
        | "numero"
        | "complemento"
        | "latitude"
        | "longitude"
    > {}
class LocalizacaoRepublica
    extends Model<
        LocalizacaoRepublicaAttributes,
        LocalizacaoRepublicaCreationAttributes
    >
    implements LocalizacaoRepublicaAttributes
{
    declare id_localizacao: number;
    declare id_republica: number;
    declare cep: string | null;
    declare endereco: string | null;
    declare numero: string | null;
    declare complemento: string | null;
    declare bairro: string;
    declare cidade: string;
    declare id_estado: number;
    declare latitude: number | null;
    declare longitude: number | null;
}
LocalizacaoRepublica.init(
    {
        id_localizacao: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_republica: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        cep: {
            type: DataTypes.STRING(9),
            allowNull: true
        },
        endereco: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        numero: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        complemento: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        bairro: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        cidade: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        id_estado: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: "localizacoes_republica",
        modelName: "LocalizacaoRepublica",
        timestamps: false
    }
);
export default LocalizacaoRepublica;