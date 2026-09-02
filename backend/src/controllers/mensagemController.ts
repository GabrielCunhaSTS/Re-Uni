import type { Request, Response } from "express";
import { enviarMensagemService, listarConversaService, listarContatosChatService, contarMensagensNaoLidasService} from "../services/mensagemService.js";
export const enviarMensagem = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_remetente = req.user?.id_usuario;
        if (!id_remetente) {
            res.status(401).json({ mensagem: "Não autorizado." });
            return;
        }
        const mensagem = await enviarMensagemService(id_remetente, req.body);
        res.status(201).json(mensagem);
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};
export const listarConversa = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        const { id_outro_usuario, id_republica } = req.query;
        if (!id_usuario) {
            res.status(401).json({ mensagem: "Não autorizado." });
            return;
        }
        const mensagens = await listarConversaService(
            Number(id_usuario),
            Number(id_outro_usuario),
            Number(id_republica)
        );
        res.status(200).json(mensagens);
    } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};
export const listarContatosChat = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_anunciante = req.user?.id_usuario;
        const { id_republica } = req.query;
        if (!id_anunciante) {
            res.status(401).json({ mensagem: "Não autorizado." });
            return;
        }
        const contatos = await listarContatosChatService(Number(id_anunciante), Number(id_republica));
        res.status(200).json(contatos);
    } catch (error) {
        console.error("Erro ao listar contatos do chat:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const listarNaoLidas = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        if (!id_usuario) {
            res.status(401).json({ mensagem: "Não autorizado." });
            return;
        }

        const contagem = await contarMensagensNaoLidasService(Number(id_usuario));
        res.status(200).json(contagem);
    } catch (error) {
        console.error("Erro ao contar mensagens não lidas:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};