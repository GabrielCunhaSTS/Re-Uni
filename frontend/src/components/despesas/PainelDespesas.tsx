"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, CheckCircle2, Clock, AlertCircle, Plus } from "lucide-react";
import { toast } from "sonner";

interface PainelDespesasProps {
    idRepublica: number;
}

export function PainelDespesas({ idRepublica }: PainelDespesasProps) {
    const queryClient = useQueryClient();

    const [tituloDespesa, setTituloDespesa] = useState("");
    const [categoriaDespesa, setCategoriaDespesa] = useState("agua");
    const [valorTotalDespesa, setValorTotalDespesa] = useState("");
    const [dataVencimentoDespesa, setDataVencimentoDespesa] = useState("");
    const [inquilinosSelecionados, setInquilinosSelecionados] = useState<number[]>([]);


    const { data: estudantes = [] } = useQuery({
        queryKey: ["inquilinos-republica", idRepublica],
        queryFn: async () => {
            if (!idRepublica) return [];
            const response = await api.get(`/alugueis/republicas/${idRepublica}/inquilinos`);
            return response.data;
        },
        enabled: !!idRepublica,
    });

    const { data: despesas = [], isLoading: loadingDespesas } = useQuery({
        queryKey: ["despesas", idRepublica],
        queryFn: async () => {
            if (!idRepublica) return [];
            const response = await api.get(`/despesas?id_republica=${idRepublica}`);
            return response.data;
        },
        enabled: !!idRepublica,
    });

    const criarDespesaMutation = useMutation({
        mutationFn: async (dados: any) => {
            const response = await api.post("/despesas", dados);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Despesa cadastrada e dividida com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["despesas", idRepublica] });
            setTituloDespesa("");
            setValorTotalDespesa("");
            setDataVencimentoDespesa("");
            setInquilinosSelecionados([]);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.mensagem || "Erro ao cadastrar despesa.");
        },
    });

    const pagarFaturaMutation = useMutation({
        mutationFn: async (idDespesaInquilino: number) => {
            const response = await api.patch(`/despesas/${idDespesaInquilino}/pagar`, {});
            return response.data;
        },
        onSuccess: () => {
            toast.success("Pagamento confirmado!");
            queryClient.invalidateQueries({ queryKey: ["despesas", idRepublica] });
        },
        onError: () => {
            toast.error("Erro ao registrar pagamento.");
        },
    });

    function handleCheckboxChange(id: number) {
        if (inquilinosSelecionados.includes(id)) {
            setInquilinosSelecionados(inquilinosSelecionados.filter((item) => item !== id));
        } else {
            setInquilinosSelecionados([...inquilinosSelecionados, id]);
        }
    }

    function handleCriarDespesa(e: React.FormEvent) {
        e.preventDefault();
        if (!idRepublica) {
            toast.error("Selecione uma república válida.");
            return;
        }
        if (inquilinosSelecionados.length === 0) {
            toast.error("Selecione ao menos um morador para o rateio.");
            return;
        }
        criarDespesaMutation.mutate({
            id_republica: idRepublica,
            titulo: tituloDespesa,
            categoria: categoriaDespesa,
            valor_total: Number(valorTotalDespesa),
            data_vencimento: dataVencimentoDespesa,
            ids_inquilinos: inquilinosSelecionados,
        });
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-900" /> Adicionar Nova Conta
                </h3>
                <form onSubmit={handleCriarDespesa} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-600 block mb-1">Título da Conta</label>
                            <Input placeholder="Ex: Conta de Luz - Março" value={tituloDespesa} onChange={(e) => setTituloDespesa(e.target.value)} required className="rounded-xl bg-slate-50 border-slate-200" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-600 block mb-1">Categoria</label>
                            <select value={categoriaDespesa} onChange={(e) => setCategoriaDespesa(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none">
                                <option value="agua">Água</option>
                                <option value="luz">Luz</option>
                                <option value="internet">Internet</option>
                                <option value="compras">Compras</option>
                                <option value="outro">Outro</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-600 block mb-1">Valor Total (R$)</label>
                            <Input type="number" step="0.01" placeholder="150.00" value={valorTotalDespesa} onChange={(e) => setValorTotalDespesa(e.target.value)} required className="rounded-xl bg-slate-50 border-slate-200" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-600 block mb-1">Data de Vencimento</label>
                            <Input type="date" value={dataVencimentoDespesa} onChange={(e) => setDataVencimentoDespesa(e.target.value)} required className="rounded-xl bg-slate-50 border-slate-200" />
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-blue-900" /> Selecione os Moradores para o Rateio
                        </label>
                        {estudantes.length === 0 ? (
                            <p className="text-xs text-slate-400">Nenhum morador ativo encontrado nesta república.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-100 rounded-2xl bg-slate-50">
                                {estudantes.map((est: any) => (
                                    <label key={est.id_usuario} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={inquilinosSelecionados.includes(est.id_usuario)}
                                            onChange={() => handleCheckboxChange(est.id_usuario)}
                                            className="w-4 h-4 rounded text-blue-900 focus:ring-blue-900"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{est.nome}</p>
                                            <p className="text-xs text-slate-400">{est.email}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <Button type="submit" disabled={criarDespesaMutation.isPending} className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-xl py-6 font-bold shadow-md">
                        {criarDespesaMutation.isPending ? "Cadastrando e Dividindo..." : "Cadastrar e Dividir Automaticamente"}
                    </Button>
                </form>
            </div>

            <div className="space-y-6 pt-4">
                <h3 className="text-lg font-bold text-slate-900">Histórico de Contas e Rateio</h3>
                {loadingDespesas ? (
                    <p className="text-sm text-slate-500">Carregando despesas...</p>
                ) : despesas.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                        <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="text-slate-500 font-medium">Nenhuma despesa cadastrada para esta república.</p>
                    </div>
                ) : (
                    despesas.map((desp: any) => (
                        <div key={desp.id_despesa} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                                <div>
                                    <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-900 rounded-full uppercase tracking-wider">{desp.categoria}</span>
                                    <h4 className="text-xl font-bold text-slate-900 mt-1">{desp.titulo}</h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-400 block">Valor Total</span>
                                    <span className="text-xl font-extrabold text-blue-950">R$ {Number(desp.valor_total).toFixed(2)}</span>
                                    <span className="text-xs text-slate-500 block">Vencimento: {desp.data_vencimento}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Divisão entre Moradores</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {desp.divisoes?.map((div: any) => (
                                        <div key={div.id_despesa_inquilino} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{div.usuario?.nome || `Usuário #${div.id_usuario}`}</p>
                                                <p className="text-xs text-slate-500">Parte: R$ {Number(div.valor_parte).toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {div.status_pagamento === "pago" ? (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                                        <CheckCircle2 className="w-4 h-4" /> Pago
                                                    </span>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                                            <Clock className="w-4 h-4" /> Pendente
                                                        </span>
                                                        <Button
                                                            onClick={() => pagarFaturaMutation.mutate(div.id_despesa_inquilino)}
                                                            size="sm"
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                                                        >
                                                            Pagar
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}