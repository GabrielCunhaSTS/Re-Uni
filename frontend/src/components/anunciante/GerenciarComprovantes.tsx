"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, FileText, Clock } from "lucide-react";
import { toast } from "sonner";

export function GerenciarComprovantes({ idRepublica }: { idRepublica: number }) {
    const queryClient = useQueryClient();

    const { data: comprovantes = [], isLoading } = useQuery({
        queryKey: ["comprovantes-anunciante", idRepublica],
        queryFn: async () => {
            const response = await api.get(`/comprovantes/republica/${idRepublica}`);
            return Array.isArray(response.data) ? response.data : [];
        },
        enabled: !!idRepublica,
    });

    const alterarStatusMutation = useMutation({
        mutationFn: async ({ idComprovante, status }: { idComprovante: number; status: string }) => {
            await api.patch(`/comprovantes/${idComprovante}/status`, { status });
        },
        onSuccess: () => {
            toast.success("Status do pagamento atualizado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["comprovantes-anunciante", idRepublica] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-financeiro"] }); // Atualiza os totais financeiros do painel
        },
        onError: () => {
            toast.error("Erro ao atualizar o status.");
        }
    });

    if (isLoading) {
        return <div className="p-6 text-slate-500 text-sm">Carregando comprovantes...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-extrabold text-blue-950">Comprovantes de Aluguel Recebidos</h3>
            
            {comprovantes.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl">
                    <p className="text-slate-400 text-sm">Nenhum comprovante enviado para esta república ainda.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {comprovantes.map((comp: any) => (
                        <div key={comp.id_comprovante} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 text-blue-900 p-2.5 rounded-xl">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{comp.estudante?.nome || `Inquilino (ID: ${comp.id_estudante})`}</p>
                                    <p className="text-xs text-slate-500">
                                        Mês: <strong className="text-slate-700">{comp.mes_referencia}</strong> | Valor: <strong className="text-emerald-700">R$ {Number(comp.valor || 0).toFixed(2)}</strong>
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span className="text-[11px] text-slate-400 uppercase font-semibold">Status: {comp.status}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <a 
                                    href={comp.arquivo_url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-xs font-bold text-blue-600 hover:underline mr-2"
                                >
                                    Ver Arquivo
                                </a>

                                {comp.status === "pendente" ? (
                                    <>
                                        <Button 
                                            size="sm" 
                                            onClick={() => alterarStatusMutation.mutate({ idComprovante: comp.id_comprovante, status: "aprovado" })}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 px-3 text-xs"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-1" /> Aprovar
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            onClick={() => alterarStatusMutation.mutate({ idComprovante: comp.id_comprovante, status: "rejeitado" })}
                                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-9 px-3 text-xs"
                                        >
                                            <XCircle className="w-4 h-4 mr-1" /> Rejeitar
                                        </Button>
                                    </>
                                ) : (
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${comp.status === 'aprovado' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                        {comp.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}