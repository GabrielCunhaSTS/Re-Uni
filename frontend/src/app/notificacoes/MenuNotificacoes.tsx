"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Bell, Check, CheckCheck } from "lucide-react";

export function MenuNotificacoes() {
    const [aberto, setAberto] = useState(false);
    const queryClient = useQueryClient();

    const { data: notificacoes = [] } = useQuery({
        queryKey: ["notificacoes-usuario"],
        queryFn: async () => {
            const token = localStorage.getItem("@ReUni:token");
            if (!token) return [];
            const response = await api.get("/notificacoes");
            return response.data;
        },
        refetchInterval: 10000, // Atualiza a cada 10 segundos automaticamente
    });

    const naoLidas = notificacoes.filter((n: any) => !n.lida).length;

    const lerMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.patch(`/notificacoes/${id}/ler`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notificacoes-usuario"] });
        }
    });

    const lerTodasMutation = useMutation({
        mutationFn: async () => {
            await api.patch(`/notificacoes/ler-todas`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notificacoes-usuario"] });
        }
    });

    return (
        <div className="relative">
            <button 
                onClick={() => setAberto(!aberto)}
                className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-700 flex items-center justify-center"
            >
                <Bell className="w-5 h-5" />
                {naoLidas > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                        {naoLidas}
                    </span>
                )}
            </button>

            {aberto && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-left">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                            Notificações {naoLidas > 0 && <span className="bg-blue-100 text-blue-900 text-xs px-2 py-0.5 rounded-full">{naoLidas} novas</span>}
                        </h3>
                        {naoLidas > 0 && (
                            <button 
                                onClick={() => lerTodasMutation.mutate()} 
                                className="text-xs text-blue-900 hover:underline font-semibold flex items-center gap-1"
                            >
                                <CheckCheck className="w-3.5 h-3.5" /> Marcar todas como lidas
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notificacoes.length === 0 && (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                Nenhuma notificação por enquanto.
                            </div>
                        )}

                        {notificacoes.map((notif: any) => (
                            <div 
                                key={notif.id_notificacao} 
                                className={`p-4 transition-colors flex gap-3 items-start ${notif.lida ? 'bg-white opacity-75' : 'bg-blue-50/40'}`}
                            >
                                <div className="flex-1 space-y-1">
                                    <h4 className="text-xs font-bold text-blue-950">{notif.titulo}</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">{notif.mensagem}</p>
                                    <span className="text-[10px] text-slate-400">
                                        {new Date(notif.criado_em).toLocaleDateString()} às {new Date(notif.criado_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                {!notif.lida && (
                                    <button 
                                        onClick={() => lerMutation.mutate(notif.id_notificacao)}
                                        className="text-blue-900 hover:bg-blue-100 p-1.5 rounded-lg transition-colors shrink-0"
                                        title="Marcar como lida"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}