"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Building2, Users } from "lucide-react";
import { toast } from "sonner";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ListaRepublicas } from "@/components/dashboard/ListaRepublicas";
import { ListaSolicitacoes } from "@/components/dashboard/ListaSolicitacoes";
import { ModalExcluirRepublica } from "@/components/dashboard/ModalExcluirRepublica";

export default function DashboardAnunciantePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [userName, setUserName] = useState("Anunciante");
    const [abaAtiva, setAbaAtiva] = useState<"republicas" | "solicitacoes">("republicas");
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

    // Busca as estatísticas e a lista unificada de repúblicas com os favoritos do backend
    const { data: estatisticas, isLoading: loadingEstatisticas } = useQuery({
        queryKey: ["estatisticas-dashboard"],
        queryFn: async () => {
            const response = await api.get("/dashboard");
            return response.data;
        },
    });

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

                <div className="flex border-b border-slate-200 gap-8">
                    <button 
                        onClick={() => setAbaAtiva("republicas")}
                        className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${abaAtiva === "republicas" ? "border-blue-900 text-blue-950" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                        <Building2 className="w-4 h-4" /> Minhas Repúblicas
                    </button>
                    <button 
                        onClick={() => setAbaAtiva("solicitacoes")}
                        className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${abaAtiva === "solicitacoes" ? "border-blue-900 text-blue-950" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                        <Users className="w-4 h-4" /> Solicitações de Aluguel
                        {totalPendentes > 0 && (
                            <span className="bg-blue-900 text-white text-xs px-2 py-0.5 rounded-full">{totalPendentes}</span>
                        )}
                    </button>
                </div>

                {abaAtiva === "republicas" && (
                    <ListaRepublicas 
                        republicas={estatisticas?.republicas || []}
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