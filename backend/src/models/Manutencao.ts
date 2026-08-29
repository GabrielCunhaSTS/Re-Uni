import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const Manutencao = sequelize.define('Manutencao', {
    id_manutencao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_republica: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('reparo', 'aviso', 'urgente'),
        defaultValue: 'reparo'
    },
    status: {
        type: DataTypes.ENUM('pendente', 'em_andamento', 'concluido'),
        defaultValue: 'pendente'
    }
}, {
    tableName: 'manutencoes',
    timestamps: true,
    createdAt: 'data_criacao',
    updatedAt: 'data_atualizacao'
});