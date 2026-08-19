import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import Usuario from "../models/Usuario.js";

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