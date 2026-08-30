"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Building2, Users, Wrench, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ListaRepublicas } from "@/components/dashboard/ListaRepublicas";
import { ListaSolicitacoes } from "@/components/dashboard/ListaSolicitacoes";
import { ModalExcluirRepublica } from "@/components/dashboard/ModalExcluirRepublica";
import { PainelManutencao } from "@/components/manutencao/PainelManutencao";
import { PainelDespesas } from "@/components/despesas/PainelDespesas";

export default function DashboardAnunciantePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [userName, setUserName] = useState("Anunciante");
    const [abaAtiva, setAbaAtiva] = useState<"republicas" | "solicitacoes" | "manutencao" | "despesas">("republicas");
    const [republicaSelecionadaId, setRepublicaSelecionadaId] = useState<number | null>(null);
    const [republicaParaExcluir, setRepublicaParaExcluir] = useState<any | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("@ReUni:token");
        const userStr = localStorage.getItem("@ReUni:user");
        if (!token || !userStr) {
            router.push("/login");
            return;
        }
        const user = JSON.parse(userStr);
        if (user.tipo === "estudante") {
            toast.error("Área exclusiva para anunciantes.");
            router.push("/");
            return;
        }
        setUserName(user.nome || "Anunciante");
    }, [router]);

    const { data: estatisticas, isLoading: loadingEstatisticas } = useQuery({
        queryKey: ["estatisticas-dashboard"],
        queryFn: async () => {
            const response = await api.get("/dashboard");
            return response.data;
        },
    });

    useEffect(() => {
        if (estatisticas?.republicas && estatisticas.republicas.length > 0 && !republicaSelecionadaId) {
            setRepublicaSelecionadaId(estatisticas.republicas[0].id_republica);
        }
    }, [estatisticas, republicaSelecionadaId]);

    const { data: solicitacoes, isLoading: loadingSolicitacoes } = useQuery({
        queryKey: ["alugueis-recebidos"],
        queryFn: async () => {
            const response = await api.get("/alugueis/recebidos");
            return response.data;
        },
    });

    const totalAtivos = solicitacoes?.filter((s: any) => s.status === 'ativo').length || 0;
    const totalPendentes = solicitacoes?.filter((s: any) => s.status === 'pendente').length || 0;
    const totalCancelados = solicitacoes?.filter((s: any) => s.status === 'cancelado' || s.status === 'encerrado').length || 0;

    const atualizarStatusMutation = useMutation({
        mutationFn: async ({ idAluguel, novoStatus }: { idAluguel: number; novoStatus: string }) => {
            const response = await api.patch(`/alugueis/${idAluguel}/status`, { status: novoStatus });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["alugueis-recebidos"] });
            queryClient.invalidateQueries({ queryKey: ["minhas-republicas"] });
            queryClient.invalidateQueries({ queryKey: ["estatisticas-dashboard"] });
            toast.success("Status do aluguel atualizado com sucesso!");
        }
    });

    const deletarRepublicaMutation = useMutation({
        mutationFn: async (idRepublica: number) => {
            const response = await api.delete(`/republicas/${idRepublica}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["minhas-republicas"] });
            queryClient.invalidateQueries({ queryKey: ["republicas-publicas"] });
            queryClient.invalidateQueries({ queryKey: ["estatisticas-dashboard"] });
            setRepublicaParaExcluir(null);
            toast.success("República excluída com sucesso!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.mensagem || "Erro ao deletar república. Verifique se existem aluguéis ativos.");
            setRepublicaParaExcluir(null);
        }
    });

    function handleLogout() {
        localStorage.removeItem("@ReUni:token");
        localStorage.removeItem("@ReUni:user");
        router.push("/login");
    }

    const republicasLista = estatisticas?.republicas || [];

    return (
        <div className="min-h-screen bg-slate-50/60 text-slate-900 relative">
            <DashboardHeader userName={userName} onLogout={handleLogout} />
            <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
                <DashboardStats
                    estatisticas={estatisticas}
                    totalAtivos={totalAtivos}
                    totalPendentes={totalPendentes}
                    totalCancelados={totalCancelados}
                />

                <div className="flex border-b border-slate-200 gap-8 overflow-x-auto">
                    <button
                        onClick={() => setAbaAtiva("republicas")}
                        className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${abaAtiva === "republicas" ? "border-blue-900 text-blue-950" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                        <Building2 className="w-4 h-4" /> Minhas Repúblicas
                    </button>
                    <button
                        onClick={() => setAbaAtiva("solicitacoes")}
                        className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${abaAtiva === "solicitacoes" ? "border-blue-900 text-blue-950" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                        <Users className="w-4 h-4" /> Solicitações de Aluguel
                        {totalPendentes > 0 && (
                            <span className="bg-blue-900 text-white text-xs px-2 py-0.5 rounded-full">{totalPendentes}</span>
                        )}
                    </button>
                    <button
                        onClick={() => setAbaAtiva("manutencao")}
                        className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${abaAtiva === "manutencao" ? "border-blue-900 text-blue-950" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                        <Wrench className="w-4 h-4" /> Manutenção e Avisos
                    </button>
                    <button
                        onClick={() => setAbaAtiva("despesas")}
                        className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${abaAtiva === "despesas" ? "border-blue-900 text-blue-950" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                        <DollarSign className="w-4 h-4" /> Despesas e Rateio
                    </button>
                </div>

                {abaAtiva === "republicas" && (
                    <ListaRepublicas
                        republicas={republicasLista}
                        loading={loadingEstatisticas}
                        onNovaRepublica={() => router.push("/dashboard/nova")}
                        onEditar={(id) => router.push(`/dashboard/editar/${id}`)}
                        onExcluir={(rep) => setRepublicaParaExcluir(rep)}
                    />
                )}

                {abaAtiva === "solicitacoes" && (
                    <ListaSolicitacoes
                        solicitacoes={solicitacoes || []}
                        loading={loadingSolicitacoes}
                        onAtualizarStatus={(idAluguel, novoStatus) => atualizarStatusMutation.mutate({ idAluguel, novoStatus })}
                    />
                )}

                {abaAtiva === "manutencao" && (
                    <div className="space-y-6">
                        {republicasLista.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                                <p className="text-slate-400 text-sm">Você precisa cadastrar uma república para gerenciar manutenções.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <label className="text-xs font-bold text-slate-600 uppercase">Selecione a República:</label>
                                    <select
                                        value={republicaSelecionadaId || ""}
                                        onChange={(e) => setRepublicaSelecionadaId(Number(e.target.value))}
                                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-blue-900 flex-1 max-w-sm"
                                    >
                                        {republicasLista.map((rep: any) => (
                                            <option key={rep.id_republica} value={rep.id_republica}>
                                                {rep.dados?.titulo || rep.titulo || rep.nome || `República #${rep.id_republica}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {republicaSelecionadaId && (
                                    <PainelManutencao
                                        idRepublica={republicaSelecionadaId}
                                        isAnunciante={true}
                                    />
                                )}
                            </>
                        )}
                    </div>
                )}

                {abaAtiva === "despesas" && (
                    <div className="space-y-6">
                        {republicasLista.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                                <p className="text-slate-400 text-sm">Você precisa cadastrar uma república para gerenciar despesas.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <label className="text-xs font-bold text-slate-600 uppercase">Selecione a República:</label>
                                    <select
                                        value={republicaSelecionadaId || ""}
                                        onChange={(e) => setRepublicaSelecionadaId(Number(e.target.value))}
                                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-blue-900 flex-1 max-w-sm"
                                    >
                                        {republicasLista.map((rep: any) => (
                                            <option key={rep.id_republica} value={rep.id_republica}>
                                                {rep.dados?.titulo || rep.titulo || rep.nome || `República #${rep.id_republica}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {republicaSelecionadaId && (
                                    <PainelDespesas idRepublica={republicaSelecionadaId} />
                                )}
                            </>
                        )}
                    </div>
                )}
            </main>

            <ModalExcluirRepublica
                republica={republicaParaExcluir}
                isPending={deletarRepublicaMutation.isPending}
                onClose={() => setRepublicaParaExcluir(null)}
                onConfirm={() => deletarRepublicaMutation.mutate(republicaParaExcluir.id_republica)}
            />
        </div>
    );
}