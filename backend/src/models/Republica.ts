import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface RepublicaAttributes {
    id_republica: number;
    id_usuario: number;
    id_tipo_republica: number;
    nome: string;
    descricao: string | null;
    valor_mensal: number;
    vagas_total: number;
    vagas_disponiveis: number;
    ativo: boolean;
    criado_em: Date;
    atualizado_em: Date;
}

interface RepublicaCreationAttributes
    extends Optional<
        RepublicaAttributes,
        | "id_republica"
        | "descricao"
        | "vagas_total"
        | "vagas_disponiveis"
        | "ativo"
        | "criado_em"
        | "atualizado_em"
    > {}

class Republica
    extends Model<
        RepublicaAttributes,
        RepublicaCreationAttributes
    >
    implements RepublicaAttributes
{
    declare id_republica: number;
    declare id_usuario: number;
    declare id_tipo_republica: number;
    declare nome: string;
    declare descricao: string | null;
    declare valor_mensal: number;
    declare vagas_total: number;
    declare vagas_disponiveis: number;
    declare ativo: boolean;
    declare criado_em: Date;
    declare atualizado_em: Date;
}

Republica.init(
    {
        id_republica: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        id_tipo_republica: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        nome: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        valor_mensal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        vagas_total: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },

        vagas_disponiveis: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },

        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
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
        tableName: "republicas",
        modelName: "Republica",
        timestamps: true,
        createdAt: "criado_em",
        updatedAt: "atualizado_em"
    }
);

export default Republica;