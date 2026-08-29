"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare } from "lucide-react";

interface ChatBoxProps {
    idRepublica: number;
    idAnunciante: number;
    nomeAnunciante: string;
}

export function ChatBox({ idRepublica, idAnunciante, nomeAnunciante }: ChatBoxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [conteudo, setConteudo] = useState("");
    const [myId, setMyId] = useState<number | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        const userStr = localStorage.getItem("@ReUni:user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setMyId(user.id_usuario || user.id);
            } catch (e) {
                setMyId(null);
            }
        }
    }, []);

    const { data: mensagens = [] } = useQuery({
        queryKey: ["mensagens", idRepublica, idAnunciante],
        queryFn: async () => {
            const response = await api.get(`/mensagens?id_outro_usuario=${idAnunciante}&id_republica=${idRepublica}`);
            return response.data;
        },
        enabled: isOpen && !!myId,
        refetchInterval: 3000,
    });

    const enviarMutation = useMutation({
        mutationFn: async (texto: string) => {
            await api.post("/mensagens", {
                id_destinatario: idAnunciante,
                id_republica: idRepublica,
                conteudo: texto,
            });
        },
        onSuccess: () => {
            setConteudo("");
            queryClient.invalidateQueries({ queryKey: ["mensagens", idRepublica, idAnunciante] });
        },
    });

    function handleEnviar(e: React.FormEvent) {
        e.preventDefault();
        if (!conteudo.trim()) return;
        enviarMutation.mutate(conteudo);
    }

    return (
        <div>
            {!isOpen ? (
                <Button onClick={() => setIsOpen(true)} className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl gap-2 w-full">
                    <MessageSquare className="w-4 h-4" /> Conversar com o Anunciante
                </Button>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-4 w-full max-w-md flex flex-col h-96">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                        <h4 className="font-bold text-slate-800 text-sm">Chat com {nomeAnunciante}</h4>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs font-bold">Fechar</button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {mensagens.map((msg: any) => {
                            // Se o remetente da mensagem for o usuário logado, joga para a direita (azul). Senão, esquerda.
                            const isMe = msg.id_remetente === myId;
                            return (
                                <div key={msg.id_mensagem} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${isMe ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
                                        {msg.conteudo}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <form onSubmit={handleEnviar} className="mt-3 flex gap-2 pt-2 border-t border-slate-100">
                        <Input 
                            value={conteudo} 
                            onChange={(e) => setConteudo(e.target.value)} 
                            placeholder="Digite sua dúvida..." 
                            className="rounded-xl text-xs bg-slate-50 border-slate-200"
                        />
                        <Button type="submit" size="icon" className="bg-blue-900 hover:bg-blue-800 rounded-xl shrink-0">
                            <Send className="w-4 h-4 text-white" />
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
}