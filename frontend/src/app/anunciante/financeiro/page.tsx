"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { CheckCircle2, Clock, Home } from "lucide-react";

export default function FinanceiroAnunciantePage() {
    const { data: republicas, isLoading } = useQuery({
        queryKey: ["financeiro-anunciante"],
        queryFn: async () => {
            const response = await api.get("/alugueis/recebidos");
            return response.data;
        }
    });

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Carregando painel financeiro...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div>
                <h1 className="text-2xl font-extrabold text-blue-950">Controle de Pagamentos</h1>
                <p className="text-sm text-slate-500">Acompanhe em tempo real quais inquilinos já realizaram o pagamento via PIX.</p>
            </div>

            <div className="space-y-6">
                {(!republicas || republicas.length === 0) ? (
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-400">
                        Nenhuma república encontrada.
                    </div>
                ) : (
                    republicas.map((rep: any) => (
                        <div key={rep.id_republica} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-900 text-white p-2 rounded-xl">
                                        <Home className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-blue-950">{rep.nome}</h3>
                                </div>
                                <span className="text-xs font-semibold text-slate-500">
                                    Valor Mensal: <strong className="text-slate-900">R$ {Number(rep.valor_mensal || 0).toFixed(2)}</strong>
                                </span>
                            </div>

                            <div className="p-6 divide-y divide-slate-100">
                                {(!rep.aluguéis || rep.aluguéis.length === 0) ? (
                                    <p className="text-sm text-slate-400 text-center py-4">Nenhum aluguel registrado para esta república.</p>
                                ) : (
                                    rep.aluguéis.map((aluguel: any) => {
                                        const isPago = aluguel.status === "ativo" || aluguel.status === "pago";

                                        return (
                                            <div key={aluguel.id_aluguel} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-slate-800 text-sm">
                                                        {aluguel.usuario?.nome || "Inquilino"}
                                                    </h4>
                                                    <p className="text-xs text-slate-500">
                                                        E-mail: {aluguel.usuario?.email} | Início do contrato: {aluguel.data_inicio}
                                                    </p>
                                                </div>

                                                <div>
                                                    {isPago ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <CheckCircle2 className="w-4 h-4" /> Pago via PIX
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                            <Clock className="w-4 h-4" /> Pendente
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}