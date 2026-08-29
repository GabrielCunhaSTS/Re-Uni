import { z } from "zod";

export const atualizarPerfilSchema = z.object({
    nome: z.string().min(2, { message: "O nome deve ter no mínimo 2 caracteres." }).optional(),
    email: z.string().email({ message: "Digite um e-mail válido." }).optional(),
    senhaAtual: z.string().optional(),
    novaSenha: z.string().min(6, { message: "A nova senha deve ter no mínimo 6 caracteres." }).optional(),
});