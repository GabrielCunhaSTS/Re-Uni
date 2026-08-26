import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Usuario from "../models/Usuario.js";

interface RegisterData {
    nome: string;
    email: string;
    senha: string;
    tipo?: "estudante" | "anunciante";
}

interface LoginData {
    email: string;
    senha: string;
}

export const registerUsuario = async (
    data: RegisterData
) => {
    const { nome, email, senha, tipo } = data; 

    const usuarioExistente = await Usuario.findOne({
        where: { email }
    });

    if (usuarioExistente) {
        throw new Error("EMAIL_JA_CADASTRADO");
    }

    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    const novoUsuario = await Usuario.create({
        nome,
        email,
        senha: senhaHash,
        tipo: tipo || "estudante" 
    });

    return {
        id_usuario: novoUsuario.id_usuario,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        tipo: novoUsuario.tipo
    };
};

export const loginUsuario = async (
    data: LoginData
) => {

    const { email, senha } = data;

    const usuario = await Usuario.findOne({
        where: { email }
    });

    if (!usuario) {
        throw new Error("USUARIO_NAO_ENCONTRADO");
    }

    if (!usuario.ativo) {
        throw new Error("USUARIO_DESATIVADO");
    }

    const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha
    );

    if (!senhaValida) {
        throw new Error("SENHA_INVALIDA");
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        console.error("JWT_SECRET não configurado.");

        throw new Error("JWT_SECRET_NAO_CONFIGURADO");
    }

    const token = jwt.sign(
        {
            id_usuario: usuario.id_usuario,
            tipo: usuario.tipo
        },
        jwtSecret,
        {
            expiresIn: "7d"
        }
    );

    return {
        usuario: {
            id_usuario: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo
        },
        token
    };
};

export const buscarUsuarioAutenticado = async (
    id_usuario: number
) => {

    return await Usuario.findByPk(
        id_usuario,
        {
            attributes: [
                "id_usuario",
                "nome",
                "email",
                "telefone",
                "foto",
                "tipo",
                "ativo",
                "criado_em",
                "atualizado_em"
            ]
        }
    );
};