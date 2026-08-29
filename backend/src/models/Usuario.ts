import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";
interface UsuarioAttributes {
    id_usuario: number;
    nome: string;
    email: string;
    senha: string;
    telefone: string | null;
    foto: string | null;
    tipo: "estudante" | "anunciante" | "admin";
    ativo: boolean;
    criado_em: Date;
    atualizado_em: Date;
}
interface UsuarioCreationAttributes
    extends Optional<
        UsuarioAttributes,
        | "id_usuario"
        | "telefone"
        | "foto"
        | "tipo"
        | "ativo"
        | "criado_em"
        | "atualizado_em"
    > {}
class Usuario
    extends Model<UsuarioAttributes, UsuarioCreationAttributes>
    implements UsuarioAttributes
{
    declare id_usuario: number;
    declare nome: string;
    declare email: string;
    declare senha: string;
    declare telefone: string | null;
    declare foto: string | null;
    declare tipo: "estudante" | "anunciante" | "admin";
    declare ativo: boolean;
    declare criado_em: Date;
    declare atualizado_em: Date;
}
Usuario.init(
    {
        id_usuario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },
        senha: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        telefone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        foto: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        tipo: {
            type: DataTypes.ENUM(
                "estudante",
                "anunciante",
                "admin"
            ),
            allowNull: false,
            defaultValue: "estudante"
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
        tableName: "usuarios",
        modelName: "Usuario",
        timestamps: true,
        createdAt: "criado_em",
        updatedAt: "atualizado_em"
    }
);
export default Usuario;