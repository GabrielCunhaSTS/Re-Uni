import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

export const registerSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Formato de e-mail inválido"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = registerSchema.safeParse(req.body);
    
    if (!parsedData.success) {
      res.status(400).json({
        mensagem: "Erro de validação nos campos fornecidos",
        erros: parsedData.error.flatten().fieldErrors
      });
      return;
    }

    const { nome, email, senha } = parsedData.data;

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      res.status(409).json({ mensagem: "Este e-mail já está cadastrado." });
      return;
    }

    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash
    });

    res.status(201).json({
      mensagem: "Usuário registrado com sucesso!",
      usuario: {
        id_usuario: novoUsuario.id_usuario,
        nome: novoUsuario.nome,
        email: novoUsuario.email
      }
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ mensagem: "Erro interno do servidor ao processar o cadastro." });
  }
};

export const loginSchema = z.object({
  email: z.string().email("Formato de e-mail inválido"),
  senha: z.string().min(1, "A senha é obrigatória")
});

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsedData = loginSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({
        mensagem: "Erro de validação nos campos fornecidos",
        erros: parsedData.error.flatten().fieldErrors
      });
      return;
    }

    const { email, senha } = parsedData.data;

    const usuario = await Usuario.findOne({
      where: { email }
    });

    if (!usuario) {
      res.status(401).json({
        mensagem: "E-mail ou senha inválidos."
      });
      return;
    }

    if (!usuario.ativo) {
      res.status(403).json({
        mensagem: "Usuário desativado."
      });
      return;
    }

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      res.status(401).json({
        mensagem: "E-mail ou senha inválidos."
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT_SECRET não configurado.");

      res.status(500).json({
        mensagem: "Erro de configuração do servidor."
      });

      return;
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

    res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      usuario: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      },
      token
    });

  } catch (error) {
    console.error("Erro no login:", error);

    res.status(500).json({
      mensagem: "Erro interno do servidor ao realizar login."
    });
  }
};