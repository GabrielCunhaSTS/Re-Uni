import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";
import Republica from "./Republica.js";

export interface AluguelAttributes {
    id_aluguel: number;
    id_usuario: number;
    id_republica: number;
    data_inicio: Date | null;
    data_fim: Date | null;
    valor: number | null;
    status: "pendente" | "ativo" | "encerrado" | "cancelado" | "pendente_comprovante";

    comprovante_matricula_url: string | null;
    status_matricula: "pendente" | "em_analise" | "aprovado" | "rejeitado";
    data_aprovacao_matricula: Date | null;

    criado_em?: Date;
    atualizado_em?: Date;
}

export interface AluguelCreationAttributes
    extends Optional<
        AluguelAttributes,
        "id_aluguel" | "status" | "data_inicio" | "data_fim" | "valor" | "comprovante_matricula_url" | "status_matricula" | "data_aprovacao_matricula" | "criado_em" | "atualizado_em"
    > {}

class Aluguel
    extends Model<AluguelAttributes, AluguelCreationAttributes>
    implements AluguelAttributes
{
    declare id_aluguel: number;
    declare id_usuario: number;
    declare id_republica: number;
    declare data_inicio: Date | null;
    declare data_fim: Date | null;
    declare valor: number | null;
    declare status: "pendente" | "ativo" | "encerrado" | "cancelado" | "pendente_comprovante";

    declare comprovante_matricula_url: string | null;
    declare status_matricula: "pendente" | "em_analise" | "aprovado" | "rejeitado";
    declare data_aprovacao_matricula: Date | null;

    declare readonly criado_em: Date;
    declare readonly atualizado_em: Date;

    declare republica?: Republica;
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
                "cancelado",
                "pendente_comprovante"
            ),
            defaultValue: "pendente",
            allowNull: false
        },
        comprovante_matricula_url: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        status_matricula: {
            type: DataTypes.ENUM(
                "pendente",
                "em_analise",
                "aprovado",
                "rejeitado"
            ),
            defaultValue: "pendente",
            allowNull: false
        },
        data_aprovacao_matricula: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: "alugueis",
        modelName: "Aluguel",
        timestamps: true,
        createdAt: "criado_em",
        updatedAt: "atualizado_em",
        underscored: true
    }
);

export default Aluguel;