"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare } from "lucide-react";

interface PainelConversaProps {
    estudanteSelecionado: any;
    republicaSelecionada: any;
    mensagens: any[];
    myId: number | null;
    idRepAtual: number;
}

export function PainelConversa({
    estudanteSelecionado,
    republicaSelecionada,
    mensagens,
    myId,
    idRepAtual
}: PainelConversaProps) {
    const [conteudo, setConteudo] = useState("");
    const queryClient = useQueryClient();

    const enviarMutation = useMutation({
        mutationFn: async (texto: string) => {
            await api.post("/mensagens", {
                id_destinatario: estudanteSelecionado.id_usuario,
                id_republica: idRepAtual,
                conteudo: texto,
            });
        },
        onSuccess: () => {
            setConteudo("");
            queryClient.invalidateQueries({ queryKey: ["mensagens-anunciante"] });
        },
    });

    function handleEnviar(e: React.FormEvent) {
        e.preventDefault();
        if (!conteudo.trim()) return;
        enviarMutation.mutate(conteudo);
    }

    if (!estudanteSelecionado) {
        return (
            <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                    <MessageSquare className="w-12 h-12 stroke-1 text-slate-300" />
                    <p className="text-sm font-medium">Selecione uma república e um estudante para ver a conversa.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between h-[75vh]">
            <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-slate-900">{estudanteSelecionado.nome}</h4>
                    <span className="text-xs text-slate-400">Conversando sobre: {republicaSelecionada?.nome}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {mensagens.map((msg: any) => {
                    const isMe = msg.id_remetente === myId;
                    return (
                        <div key={msg.id_mensagem} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`p-3 rounded-2xl text-xs max-w-[75%] ${isMe ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
                                {msg.conteudo}
                            </div>
                        </div>
                    );
                })}
            </div>

            <form onSubmit={handleEnviar} className="mt-4 flex gap-2 pt-3 border-t border-slate-100">
                <Input
                    value={conteudo}
                    onChange={(e) => setConteudo(e.target.value)}
                    placeholder="Digite sua resposta..."
                    className="rounded-xl bg-slate-50 border-slate-200"
                />
                <Button type="submit" className="bg-blue-900 hover:bg-blue-800 rounded-xl px-5">
                    <Send className="w-4 h-4 text-white" />
                </Button>
            </form>
        </div>
    );
}