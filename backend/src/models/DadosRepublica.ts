import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface DadosRepublicaAttributes {
    id_dados: number;
    id_republica: number;
    quartos: number;
    banheiros: number;
    moradores: number;
    mobiliada: boolean;
    possui_internet: boolean;
    possui_garagem: boolean;
    possui_lavanderia: boolean;
    possui_area_lazer: boolean;
    aceita_pets: boolean;
}

class DadosRepublica
    extends Model<DadosRepublicaAttributes>
    implements DadosRepublicaAttributes
{
    declare id_dados: number;
    declare id_republica: number;
    declare quartos: number;
    declare banheiros: number;
    declare moradores: number;
    declare mobiliada: boolean;
    declare possui_internet: boolean;
    declare possui_garagem: boolean;
    declare possui_lavanderia: boolean;
    declare possui_area_lazer: boolean;
    declare aceita_pets: boolean;
}

DadosRepublica.init(
    {
        id_dados: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        id_republica: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },

        quartos: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        banheiros: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        moradores: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        mobiliada: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        possui_internet: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        possui_garagem: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        possui_lavanderia: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        possui_area_lazer: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        aceita_pets: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize,
        tableName: "dados_republica",
        modelName: "DadosRepublica",
        timestamps: false
    }
);

export default DadosRepublica;