"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MessageSquare, Home } from "lucide-react";
export default function DashboardMensagensPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [republicaSelecionada, setRepublicaSelecionada] = useState<any>(null);
    const [estudanteSelecionado, setEstudanteSelecionado] = useState<any>(null);
    const [conteudo, setConteudo] = useState("");
    const [myId, setMyId] = useState<number | null>(null);
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
    const { data: republicas = [] } = useQuery({
        queryKey: ["dashboard-republicas-chat"],
        queryFn: async () => {
            const response = await api.get("/dashboard");
            return response.data.republicas || [];
        }
    });
    const idRepAtual = republicaSelecionada?.id_republica || republicaSelecionada?.id;
    const { data: contatos = [] } = useQuery({
        queryKey: ["republica-contatos-chat", idRepAtual],
        queryFn: async () => {
            const response = await api.get(`/mensagens/contatos?id_republica=${idRepAtual}`);
            return response.data;
        },
        enabled: !!idRepAtual
    });
    const { data: mensagens = [] } = useQuery({
        queryKey: ["mensagens-anunciante", idRepAtual, estudanteSelecionado?.id_usuario],
        queryFn: async () => {
            const response = await api.get(`/mensagens?id_outro_usuario=${estudanteSelecionado.id_usuario}&id_republica=${idRepAtual}`);
            return response.data;
        },
        enabled: !!idRepAtual && !!estudanteSelecionado,
        refetchInterval: 3000,
    });
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
    return (
        <div className="min-h-screen bg-slate-50/60 text-slate-900 pb-20">
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Button onClick={() => router.push("/dashboard")} variant="ghost" className="rounded-xl p-2">
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-900 text-white p-2 rounded-xl">
                            <Home className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight text-blue-950">Central de Mensagens</h1>
                    </div>
                </div>
            </header>
            <main className="max-w-6xl mx-auto px-6 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 h-[75vh]">
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm overflow-y-auto space-y-4">
                    <h3 className="font-bold text-blue-950 text-sm uppercase tracking-wider">Suas Repúblicas</h3>
                    {republicas.map((rep: any) => {
                        const repId = rep.id_republica || rep.id;
                        const isSelected = idRepAtual === repId;
                        return (
                            <div
                                key={repId}
                                onClick={() => { setRepublicaSelecionada(rep); setEstudanteSelecionado(null); }}
                                className={`p-3 rounded-2xl cursor-pointer border transition-all ${isSelected ? 'bg-blue-50 border-blue-200 font-bold text-blue-950' : 'border-slate-100 hover:bg-slate-50 text-slate-700'}`}
                            >
                                <p className="text-sm">{rep.nome}</p>
                            </div>
                        );
                    })}
                    {republicaSelecionada && (
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                            <h3 className="font-bold text-blue-950 text-sm uppercase tracking-wider">Interessados (Mensagens)</h3>
                            {contatos.length === 0 ? (
                                <p className="text-xs text-slate-400">Nenhuma mensagem recebida para esta república ainda.</p>
                            ) : (
                                contatos.map((estudante: any) => {
                                    const isSelected = estudanteSelecionado?.id_usuario === estudante.id_usuario;
                                    return (
                                        <div
                                            key={estudante.id_usuario}
                                            onClick={() => setEstudanteSelecionado(estudante)}
                                            className={`p-3 rounded-2xl cursor-pointer border transition-all ${isSelected ? 'bg-blue-900 text-white font-bold' : 'border-slate-100 hover:bg-slate-50 text-slate-700'}`}
                                        >
                                            <p className="text-sm">{estudante.nome}</p>
                                            <span className="text-[10px] opacity-70">{estudante.email}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
                <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                    {!estudanteSelecionado ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                            <MessageSquare className="w-12 h-12 stroke-1 text-slate-300" />
                            <p className="text-sm font-medium">Selecione uma república e um estudante para ver a conversa.</p>
                        </div>
                    ) : (
                        <>
                            <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-900">{estudanteSelecionado.nome}</h4>
                                    <span className="text-xs text-slate-400">Conversando sobre: {republicaSelecionada.nome}</span>
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
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}