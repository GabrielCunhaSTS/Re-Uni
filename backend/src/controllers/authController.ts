import type { Request, Response } from "express";
import {
    registerSchema,
    loginSchema
} from "../schemas/authSchema.js";
import {
    registerUsuario,
    loginUsuario,
    buscarUsuarioAutenticado
} from "../services/authService.js";
export const register = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const parsedData = registerSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({
                mensagem: "Erro de validação nos campos fornecidos",
                erros: parsedData.error.flatten().fieldErrors
            });
            return;
        }
        const usuario = await registerUsuario(parsedData.data);
        res.status(201).json({
            mensagem: "Usuário registrado com sucesso!",
            usuario
        });
    } catch (error) {
        console.error("Erro no registro:", error);
        if (
            error instanceof Error &&
            error.message === "EMAIL_JA_CADASTRADO"
        ) {
            res.status(409).json({
                mensagem: "Este e-mail já está cadastrado."
            });
            return;
        }
        res.status(500).json({
            mensagem: "Erro interno do servidor ao processar o cadastro."
        });
    }
};
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
        const resultado = await loginUsuario(parsedData.data);
        res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            ...resultado
        });
    } catch (error) {
        console.error("Erro no login:", error);
        if (error instanceof Error) {
            if (error.message === "USUARIO_NAO_ENCONTRADO") {
                res.status(401).json({
                    mensagem: "E-mail ou senha inválidos."
                });
                return;
            }
            if (error.message === "USUARIO_DESATIVADO") {
                res.status(403).json({
                    mensagem: "Usuário desativado."
                });
                return;
            }
            if (error.message === "SENHA_INVALIDA") {
                res.status(401).json({
                    mensagem: "E-mail ou senha inválidos."
                });
                return;
            }
            if (error.message === "JWT_SECRET_NAO_CONFIGURADO") {
                res.status(500).json({
                    mensagem: "Erro de configuração do servidor."
                });
                return;
            }
        }
        res.status(500).json({
            mensagem: "Erro interno do servidor ao realizar login."
        });
    }
};
export const me = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                mensagem: "Usuário não autenticado."
            });
            return;
        }
        const usuario = await buscarUsuarioAutenticado(
            req.user.id_usuario
        );
        if (!usuario) {
            res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
            return;
        }
        res.status(200).json({
            usuario
        });
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({
            mensagem: "Erro interno do servidor."
        });
    }
};