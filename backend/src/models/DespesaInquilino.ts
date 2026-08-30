import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import sequelize from "../config/database.js";

interface DespesaInquilinoAttributes {
    id_despesa_inquilino: number;
    id_despesa: number;
    id_usuario: number;
    valor_parte: number;
    status_pagamento: "pendente" | "pago";
    comprovante_url?: string;
}

interface DespesaInquilinoCreationAttributes extends Optional<DespesaInquilinoAttributes, "id_despesa_inquilino" | "status_pagamento" | "comprovante_url"> {}

export class DespesaInquilino extends Model<DespesaInquilinoAttributes, DespesaInquilinoCreationAttributes> implements DespesaInquilinoAttributes {
    public id_despesa_inquilino!: number;
    public id_despesa!: number;
    public id_usuario!: number;
    public valor_parte!: number;
    public status_pagamento!: "pendente" | "pago";
    public comprovante_url?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

DespesaInquilino.init(
    {
        id_despesa_inquilino: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_despesa: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        valor_parte: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status_pagamento: {
            type: DataTypes.ENUM("pendente", "pago"),
            allowNull: false,
            defaultValue: "pendente",
        },
        comprovante_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "despesas_inquilinos",
    }
);