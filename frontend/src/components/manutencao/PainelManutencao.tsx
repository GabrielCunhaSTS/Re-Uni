"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Wrench, AlertTriangle, CheckCircle2, Clock, Plus, Trash2, X, Lock } from "lucide-react";
import { toast } from "sonner";

interface PainelManutencaoProps {
    idRepublica: number;
    isAnunciante: boolean;
    temAluguelAtivo?: boolean;
}

export function PainelManutencao({ idRepublica, isAnunciante, temAluguelAtivo = true }: PainelManutencaoProps) {
    const queryClient = useQueryClient();
    const [modalAberto, setModalAberto] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [tipo, setTipo] = useState<"reparo" | "aviso" | "urgente">("reparo");

    const { data: manutencoes, isLoading } = useQuery({
        queryKey: ["manutencoes", idRepublica],
        queryFn: async () => {
            const response = await api.get(`/republicas/${idRepublica}/manutencoes`);
            return response.data;
        },
    });

    const criarMutation = useMutation({
        mutationFn: async (novoChamado: { titulo: string; descricao: string; tipo: string }) => {
            const response = await api.post(`/republicas/${idRepublica}/manutencoes`, novoChamado);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["manutencoes", idRepublica] });
            toast.success("Solicitação enviada com sucesso!");
            setModalAberto(false);
            setTitulo("");
            setDescricao("");
            setTipo("reparo");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.mensagem || "Erro ao enviar solicitação.");
        }
    });

    const atualizarStatusMutation = useMutation({
        mutationFn: async ({ idManutencao, status }: { idManutencao: number; status: string }) => {
            const response = await api.patch(`/manutencoes/${idManutencao}/status`, { status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["manutencoes", idRepublica] });
            toast.success("Status atualizado!");
        },
    });

    const excluirMutation = useMutation({
        mutationFn: async (idManutencao: number) => {
            const response = await api.delete(`/manutencoes/${idManutencao}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["manutencoes", idRepublica] });
            toast.success("Chamado removido!");
        },
    });

    const handleCriar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo.trim() || !descricao.trim()) {
            toast.error("Preencha todos os campos.");
            return;
        }
        criarMutation.mutate({ titulo, descricao, tipo });
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-blue-900" /> Manutenção e Avisos
                    </h3>
                    <p className="text-sm text-slate-500">Acompanhe solicitações de reparo e comunicados da república.</p>
                </div>

                {}
                {isAnunciante || temAluguelAtivo ? (
                    <button
                        onClick={() => setModalAberto(true)}
                        className="bg-blue-900 hover:bg-blue-950 text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Novo Chamado / Aviso
                    </button>
                ) : (
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-xl">
                        <Lock className="w-3.5 h-3.5" /> Apenas moradores com aluguel ativo podem criar chamados.
                    </div>
                )}
            </div>

            {}
            {isLoading ? (
                <div className="text-center py-8 text-slate-400">Carregando chamados...</div>
            ) : manutencoes?.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
                    <p className="text-slate-400 text-sm">Nenhum aviso ou solicitação registrada até o momento.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {manutencoes?.map((item: any) => (
                        <div key={item.id_manutencao} className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                                        item.tipo === 'urgente' ? 'bg-red-100 text-red-700' :
                                        item.tipo === 'aviso' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {item.tipo}
                                    </span>
                                    <h4 className="font-bold text-slate-900">{item.titulo}</h4>
                                </div>
                                <p className="text-sm text-slate-600">{item.descricao}</p>
                                <span className="text-xs text-slate-400">Criado em: {new Date(item.data_criacao).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                                {isAnunciante ? (
                                    <select
                                        value={item.status}
                                        onChange={(e) => atualizarStatusMutation.mutate({ idManutencao: item.id_manutencao, status: e.target.value })}
                                        className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white font-medium text-slate-700 focus:outline-none"
                                    >
                                        <option value="pendente">Pendente</option>
                                        <option value="em_andamento">Em Andamento</option>
                                        <option value="concluido">Concluído</option>
                                    </select>
                                ) : (
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${
                                        item.status === 'concluido' ? 'bg-emerald-100 text-emerald-800' :
                                        item.status === 'em_andamento' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {item.status === 'concluido' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                        {item.status === 'em_andamento' && <Clock className="w-3.5 h-3.5" />}
                                        {item.status === 'pendente' && <AlertTriangle className="w-3.5 h-3.5" />}
                                        {item.status.replace('_', ' ')}
                                    </span>
                                )}

                                {isAnunciante && (
                                    <button
                                        onClick={() => excluirMutation.mutate(item.id_manutencao)}
                                        className="text-slate-400 hover:text-red-600 p-1.5 transition-colors"
                                        title="Excluir chamado"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {}
            {modalAberto && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 relative animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Novo Chamado ou Aviso</h3>
                            <button onClick={() => setModalAberto(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCriar} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Título</label>
                                <input
                                    type="text"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    placeholder="Ex: Vazamento no banheiro"
                                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tipo</label>
                                <select
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value as any)}
                                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-900"
                                >
                                    <option value="reparo">Reparo / Manutenção</option>
                                    <option value="aviso">Aviso Geral</option>
                                    <option value="urgente">Urgente</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Descrição</label>
                                <textarea
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    placeholder="Descreva detalhadamente o problema ou o aviso..."
                                    rows={4}
                                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-900 resize-none"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalAberto(false)}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={criarMutation.isPending}
                                    className="bg-blue-900 hover:bg-blue-950 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all disabled:opacity-50"
                                >
                                    {criarMutation.isPending ? "Enviando..." : "Criar Chamado"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}