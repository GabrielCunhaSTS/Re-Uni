import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
export const Comprovante = sequelize.define("Comprovante", {
    id_comprovante: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_aluguel: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_estudante: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    arquivo_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mes_referencia: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    status: {
        type: DataTypes.ENUM("pendente", "aprovado", "rejeitado"),
        defaultValue: "pendente",
    }
}, {
    tableName: "comprovantes",
    timestamps: true,
    createdAt: "criado_em",
    updatedAt: "atualizado_em"
});