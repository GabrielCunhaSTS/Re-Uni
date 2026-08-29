import type { Request, Response } from "express";
import { listarNotificacoesUsuarioService, marcarComoLidaService, marcarTodasComoLidasService } from "../services/notificacaoService.js";
export const listarNotificacoes = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        if (!id_usuario) { res.status(401).json({ mensagem: "Não autenticado." }); return; }
        const notificacoes = await listarNotificacoesUsuarioService(id_usuario);
        res.status(200).json(notificacoes);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};
export const marcarLida = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        const id_notificacao = Number(req.params.id_notificacao);
        if (!id_usuario) { res.status(401).json({ mensagem: "Não autenticado." }); return; }
        await marcarComoLidaService(id_notificacao, id_usuario);
        res.status(200).json({ mensagem: "Notificação marcada como lida." });
    } catch (error: any) {
        if (error.message === "NOTIFICACAO_NAO_ENCONTRADA") {
            res.status(404).json({ mensagem: "Notificação não encontrada." }); return;
        }
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};
export const marcarTodasLidas = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        if (!id_usuario) { res.status(401).json({ mensagem: "Não autenticado." }); return; }
        await marcarTodasComoLidasService(id_usuario);
        res.status(200).json({ mensagem: "Todas as notificações foram marcadas como lidas." });
    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};