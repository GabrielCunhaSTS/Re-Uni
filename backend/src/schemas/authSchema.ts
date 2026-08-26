import { z } from "zod";

export const registerSchema = z.object({
    nome: z
        .string()
        .min(3, "O nome deve ter pelo menos 3 caracteres"),

    email: z
        .string()
        .email("Formato de e-mail inválido"),

    senha: z
        .string()
        .min(6, "A senha deve ter no mínimo 6 caracteres"),

    tipo: z.enum(["estudante", "anunciante"]).optional()
});

export const loginSchema = z.object({
    email: z
        .string()
        .email("Formato de e-mail inválido"),

    senha: z
        .string()
        .min(1, "A senha é obrigatória")
});