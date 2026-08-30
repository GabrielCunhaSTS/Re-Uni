import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import sequelize from "../config/database.js";

interface DespesaAttributes {
    id_despesa: number;
    id_republica: number;
    titulo: string;
    categoria: "agua" | "luz" | "internet" | "compras" | "outro";
    valor_total: number;
    data_vencimento: string;
    status: "pendente" | "paga" | "atrasada";
}

interface DespesaCreationAttributes extends Optional<DespesaAttributes, "id_despesa" | "status"> {}

export class Despesa extends Model<DespesaAttributes, DespesaCreationAttributes> implements DespesaAttributes {
    public id_despesa!: number;
    public id_republica!: number;
    public titulo!: string;
    public categoria!: "agua" | "luz" | "internet" | "compras" | "outro";
    public valor_total!: number;
    public data_vencimento!: string;
    public status!: "pendente" | "paga" | "atrasada";

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Despesa.init(
    {
        id_despesa: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_republica: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoria: {
            type: DataTypes.ENUM("agua", "luz", "internet", "compras", "outro"),
            allowNull: false,
            defaultValue: "outro",
        },
        valor_total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        data_vencimento: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pendente", "paga", "atrasada"),
            allowNull: false,
            defaultValue: "pendente",
        },
    },
    {
        sequelize,
        tableName: "despesas",
    }
);