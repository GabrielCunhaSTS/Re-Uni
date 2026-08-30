"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, Home, Users, TrendingUp, X } from "lucide-react";
import { GerenciarComprovantes } from "@/components/anunciante/GerenciarComprovantes";
import { toast } from "sonner";

export default function DashboardFinanceiroPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [imovelSelecionado, setImovelSelecionado] = useState<any>(null);

    const { data: financeiro, isLoading } = useQuery({
        queryKey: ["dashboard-financeiro"],
        queryFn: async () => {
            const response = await api.get("/dashboard/financeiro");
            return response.data;
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-500 animate-pulse text-lg font-medium">Carregando painel financeiro...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/60 text-slate-900 pb-20 relative">
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Button onClick={() => router.push("/dashboard")} variant="ghost" className="rounded-xl p-2">
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-900 text-white p-2 rounded-xl">
                            <Home className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight text-blue-950">Controle Financeiro</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 pt-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
                        <div className="bg-emerald-100 text-emerald-800 p-4 rounded-2xl">
                            <DollarSign className="w-8 h-8" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faturamento Mensal Estimado</span>
                            <h2 className="text-3xl font-extrabold text-blue-950 mt-1">
                                R$ {financeiro?.faturamentoTotalMensal?.toFixed(2) || "0.00"}
                            </h2>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-800 p-4 rounded-2xl">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Imóveis com Aluguéis Ativos</span>
                            <h2 className="text-3xl font-extrabold text-blue-950 mt-1">
                                {financeiro?.totalImoveisAtivos || 0}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold text-blue-950">Detalhamento por República</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                                    <th className="pb-4">República</th>
                                    <th className="pb-4">Valor Mensal</th>
                                    <th className="pb-4">Inquilinos Ativos</th>
                                    <th className="pb-4">Receita do Imóvel</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {financeiro?.detalhesImoveis?.map((imovel: any) => (
                                    <tr key={imovel.id_republica} className="hover:bg-slate-50/50">
                                        <td className="py-4 font-semibold text-slate-800">{imovel.nome}</td>
                                        <td className="py-4 text-slate-600">R$ {imovel.valor_mensal.toFixed(2)}</td>
                                        <td className="py-4 text-slate-600">
                                            <div className="flex items-center gap-3">
                                                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg text-xs font-bold">
                                                    <Users className="w-3.5 h-3.5" /> {imovel.total_inquilinos}
                                                </span>
                                                {imovel.total_inquilinos > 0 && (
                                                    <button
                                                        onClick={() => setImovelSelecionado(imovel)}
                                                        className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 transition-all"
                                                    >
                                                        Ver mais
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 font-bold text-emerald-700">R$ {imovel.receita_atual.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-blue-950">Aprovação de Pagamentos</h3>
                    {financeiro?.detalhesImoveis?.map((imovel: any) => (
                        <div key={`comp-${imovel.id_republica}`} className="space-y-2">
                            <h4 className="text-sm font-bold text-slate-600">República: {imovel.nome}</h4>
                            <GerenciarComprovantes idRepublica={imovel.id_republica} />
                        </div>
                    ))}
                </div>
            </main>

            {}
            {imovelSelecionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-extrabold text-blue-950">Gestão de Moradores</h3>
                                <p className="text-sm text-slate-500 font-medium">{imovelSelecionado.nome}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                onClick={() => setImovelSelecionado(null)}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3 bg-slate-50/50">
                            {imovelSelecionado.inquilinos && imovelSelecionado.inquilinos.length > 0 ? (
                                imovelSelecionado.inquilinos.map((inquilino: any, index: number) => (
                                    <div key={index} className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col gap-3 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center shrink-0">
                                                    {inquilino.nome ? inquilino.nome.charAt(0).toUpperCase() : "U"}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{inquilino.nome || "Nome não informado"}</p>
                                                    <p className="text-xs text-slate-500">{inquilino.email || "Sem e-mail"}</p>
                                                </div>
                                            </div>
                                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-1 rounded-lg">
                                                Ativo
                                            </span>
                                        </div>

                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <div>
                                                <span className="text-xs font-bold text-slate-500 block mb-1">Status da Matrícula:</span>
                                                {inquilino.status_matricula === 'aprovado' && <span className="text-xs text-emerald-600 font-bold">✅ Aprovado</span>}
                                                {inquilino.status_matricula === 'pendente' && <span className="text-xs text-amber-600 font-bold">⏳ Aguardando envio</span>}
                                                {inquilino.status_matricula === 'rejeitado' && <span className="text-xs text-red-600 font-bold">❌ Rejeitado</span>}
                                                {inquilino.status_matricula === 'em_analise' && <span className="text-xs text-blue-600 font-bold">🔍 Em análise</span>}
                                                {!inquilino.status_matricula && <span className="text-xs text-slate-400 font-bold">Não aplicável</span>}
                                            </div>

                                            {inquilino.status_matricula === 'em_analise' && (
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-xs rounded-lg h-7 px-2"
                                                        onClick={() => {
                                                            let pdfUrl = inquilino.comprovante_matricula_url;


                                                            if (pdfUrl && !pdfUrl.startsWith('http')) {

                                                                pdfUrl = `http://localhost:3001/${pdfUrl.replace(/\\/g, '/')}`;
                                                            }

                                                            window.open(pdfUrl, "_blank");
                                                        }}
                                                    >
                                                        Ver PDF
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-xs rounded-lg h-7 px-2"
                                                        onClick={async () => {
                                                            try {
                                                                await api.patch(`/alugueis/${inquilino.id_aluguel}/matricula/avaliacao`, { status: "aprovado" });
                                                                toast.success("Matrícula aprovada!");
                                                                queryClient.invalidateQueries({ queryKey: ["dashboard-financeiro"] });
                                                                setImovelSelecionado(null);
                                                            } catch (error) {
                                                                toast.error("Erro ao aprovar.");
                                                            }
                                                        }}
                                                    >
                                                        Aprovar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="text-xs rounded-lg h-7 px-2"
                                                        onClick={async () => {
                                                            try {
                                                                await api.patch(`/alugueis/${inquilino.id_aluguel}/matricula/avaliacao`, { status: "rejeitado" });
                                                                toast.success("Matrícula rejeitada.");
                                                                queryClient.invalidateQueries({ queryKey: ["dashboard-financeiro"] });
                                                                setImovelSelecionado(null);
                                                            } catch (error) {
                                                                toast.error("Erro ao rejeitar.");
                                                            }
                                                        }}
                                                    >
                                                        Recusar
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-slate-500 text-sm py-4">
                                    Nenhum dado detalhado encontrado.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}