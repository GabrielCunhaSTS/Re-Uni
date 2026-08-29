import { Usuario } from "../models/index.js";
import bcrypt from "bcryptjs";
export const atualizarPerfilService = async (id_usuario: number, dados: { nome?: string; email?: string; senhaAtual?: string; novaSenha?: string }) => {
    const usuario: any = await Usuario.findByPk(id_usuario);
    if (!usuario) {
        throw new Error("USUARIO_NAO_ENCONTRADO");
    }
    if (dados.novaSenha) {
        if (!dados.senhaAtual) {
            throw new Error("SENHA_ATUAL_OBRIGATORIA");
        }
        const senhaCorreta = await bcrypt.compare(dados.senhaAtual, usuario.senha);
        if (!senhaCorreta) {
            throw new Error("SENHA_INCORRETA");
        }
        usuario.senha = await bcrypt.hash(dados.novaSenha, 10);
    }
    if (dados.nome) usuario.nome = dados.nome;
    if (dados.email) usuario.email = dados.email;
    await usuario.save();
    return {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
    };
};