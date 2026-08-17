import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

interface AluguelAttributes {
    id_aluguel: number;
    id_usuario: number;
    id_republica: number;
    data_inicio: Date | null;
    data_fim: Date | null;
    valor: number | null;
    status: "pendente" | "ativo" | "encerrado" | "cancelado";
    criado_em: Date;
    atualizado_em: Date;
}

class Aluguel
    extends Model<AluguelAttributes>
    implements AluguelAttributes
{
    declare id_aluguel: number;
    declare id_usuario: number;
    declare id_republica: number;
    declare data_inicio: Date | null;
    declare data_fim: Date | null;
    declare valor: number | null;

    declare status:
        | "pendente"
        | "ativo"
        | "encerrado"
        | "cancelado";

    declare criado_em: Date;
    declare atualizado_em: Date;
}

Aluguel.init(
    {
        id_aluguel: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        id_republica: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        data_inicio: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        data_fim: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        valor: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },

        status: {
            type: DataTypes.ENUM(
                "pendente",
                "ativo",
                "encerrado",
                "cancelado"
            ),
            defaultValue: "pendente"
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
        tableName: "alugueis",
        modelName: "Aluguel",
        timestamps: true,
        createdAt: "criado_em",
        updatedAt: "atualizado_em"
    }
);

export default Aluguel;