"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Reply } from "lucide-react";

interface RepublicaComentariosProps {
    idRepublica: string | string[];
}

export function RepublicaComentarios({ idRepublica }: RepublicaComentariosProps) {
    const queryClient = useQueryClient();
    const [novoComentario, setNovoComentario] = useState("");
    const [respostaTexto, setRespostaTexto] = useState<{ [key: number]: string }>({});
    const [comentarioRespondendo, setComentarioRespondendo] = useState<number | null>(null);

    const { data: comentarios } = useQuery({
        queryKey: ["republica-comentarios", idRepublica],
        queryFn: async () => {
            if (!idRepublica) return [];
            try {
                const response = await api.get(`/republicas/${idRepublica}/comentarios`);
                return Array.isArray(response.data) ? response.data : response.data.comentarios || [];
            } catch (err) {
                return [];
            }
        },
        enabled: !!idRepublica,
    });

    const criarComentarioMutation = useMutation({
        mutationFn: async (texto: string) => {
            const response = await api.post(`/republicas/${idRepublica}/comentarios`, { 
                texto: texto, 
                conteudo: texto,
                mensagem: texto
            });
            return response.data;
        },
        onSuccess: () => {
            setNovoComentario("");
            queryClient.invalidateQueries({ queryKey: ["republica-comentarios", idRepublica] });
        },
        onError: (error: any) => {
            alert(error.response?.data?.mensagem || "Erro ao publicar comentário.");
        }
    });

    const criarRespostaMutation = useMutation({
        mutationFn: async ({ idComentario, texto }: { idComentario: number; texto: string }) => {
            const response = await api.post(`/comentarios/${idComentario}/respostas`, { 
                texto: texto,
                conteudo: texto,
                mensagem: texto
            });
            return response.data;
        },
        onSuccess: () => {
            setRespostaTexto({});
            setComentarioRespondendo(null);
            queryClient.invalidateQueries({ queryKey: ["republica-comentarios", idRepublica] });
        },
        onError: (error: any) => {
            alert(error.response?.data?.mensagem || "Erro ao publicar resposta.");
        }
    });

    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-blue-950 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-900" /> Dúvidas e Avaliações ({comentarios?.length || 0})
            </h3>

            <form 
                onSubmit={(e) => { 
                    e.preventDefault(); 
                    if(novoComentario.trim()) criarComentarioMutation.mutate(novoComentario); 
                }}
                className="space-y-3"
            >
                <textarea 
                    rows={3}
                    placeholder="Escreva sua dúvida ou comentário sobre a república..."
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                />
                <div className="flex justify-end">
                    <Button 
                        type="submit" 
                        disabled={criarComentarioMutation.isPending || !novoComentario.trim()}
                        className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl px-6"
                    >
                        <Send className="w-4 h-4 mr-2" /> Comentar
                    </Button>
                </div>
            </form>

            <div className="space-y-6 pt-4 border-t border-slate-100">
                {comentarios?.length === 0 && (
                    <p className="text-slate-400 text-sm text-center py-6">Nenhum comentário ainda. Seja o primeiro a perguntar!</p>
                )}

                {comentarios?.map((comentario: any) => {
                    const idComentario = comentario.id || comentario.id_comentario;
                    return (
                        <div key={idComentario} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 text-sm">
                                    {comentario.usuario?.nome || "Estudante"}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {comentario.created_at ? new Date(comentario.created_at).toLocaleDateString() : ""}
                                </span>
                            </div>

                            <p className="text-slate-700 text-sm leading-relaxed">
                                {comentario.conteudo || comentario.texto}
                            </p>

                            {/* Respostas ao Comentário */}
                            {comentario.respostas && comentario.respostas.length > 0 && (
                                <div className="pl-6 mt-3 space-y-3 border-l-2 border-blue-200">
                                    {comentario.respostas.map((resp: any, idx: number) => (
                                        <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-blue-950">{resp.usuario?.nome || "Anunciante / Usuário"}</span>
                                            </div>
                                            <p className="text-slate-600 text-xs">{resp.conteudo || resp.texto}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-end pt-1">
                                {comentarioRespondendo === idComentario ? (
                                    <div className="w-full space-y-2 mt-2">
                                        <textarea 
                                            rows={2}
                                            placeholder="Escreva sua resposta..."
                                            value={respostaTexto[idComentario] || ""}
                                            onChange={(e) => setRespostaTexto({ ...respostaTexto, [idComentario]: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-900"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="rounded-xl text-xs h-8"
                                                onClick={() => setComentarioRespondendo(null)}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                className="bg-blue-900 text-white rounded-xl text-xs h-8"
                                                onClick={() => {
                                                    const texto = respostaTexto[idComentario];
                                                    if (texto?.trim()) {
                                                        criarRespostaMutation.mutate({ idComentario, texto });
                                                    }
                                                }}
                                            >
                                                Responder
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setComentarioRespondendo(idComentario)}
                                        className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
                                    >
                                        <Reply className="w-3.5 h-3.5" /> Responder
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}