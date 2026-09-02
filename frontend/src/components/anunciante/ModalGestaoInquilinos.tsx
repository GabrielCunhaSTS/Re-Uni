"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, UserMinus, CheckCircle2, Banknote } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ModalEncerrarContrato } from "./ModalEncerrarContrato";

interface ModalGestaoInquilinosProps {
    imovelSelecionado: any;
    onClose: () => void;
}

export function ModalGestaoInquilinos({ imovelSelecionado, onClose }: ModalGestaoInquilinosProps) {
    const queryClient = useQueryClient();

    const [pagamentosConfirmados, setPagamentosConfirmados] = useState<number[]>([]);
    const [inquilinoParaEncerrar, setInquilinoParaEncerrar] = useState<any>(null);
    const [isEncerrando, setIsEncerrando] = useState(false);

    if (!imovelSelecionado) return null;

    async function handleAvaliarMatricula(idAluguel: number, status: "aprovado" | "rejeitado") {
        try {
            await api.patch(`/alugueis/${idAluguel}/matricula/avaliacao`, { status });
            toast.success(status === "aprovado" ? "Matrícula aprovada!" : "Matrícula rejeitada.");
            queryClient.invalidateQueries({ queryKey: ["dashboard-financeiro"] });
            onClose();
        } catch (error) {
            toast.error("Erro ao processar avaliação.");
        }
    }

    async function handleDarBaixaDinheiro(idAluguel: number) {
        try {
            await api.patch(`/pagamentos/${idAluguel}/baixa-manual`);
            toast.success("Pagamento em dinheiro confirmado com sucesso!");


            setPagamentosConfirmados(prev => [...prev, idAluguel]);

            queryClient.invalidateQueries({ queryKey: ["dashboard-financeiro"] });
        } catch (error) {
            toast.error("Erro ao registrar baixa no pagamento.");
        }
    }

    async function confirmarEncerramento() {
        if (!inquilinoParaEncerrar) return;

        setIsEncerrando(true);
        try {
            await api.patch(`/alugueis/${inquilinoParaEncerrar.id_aluguel}/status`, { status: "encerrado" });
            toast.success("Contrato encerrado. Vaga liberada na república!");

            queryClient.invalidateQueries({ queryKey: ["dashboard-financeiro"] });

            setInquilinoParaEncerrar(null);
            onClose();
        } catch (error) {
            toast.error("Erro ao encerrar o contrato.");
        } finally {
            setIsEncerrando(false);
        }
    }

    function handleVerPdf(url: string) {
        let pdfUrl = url;
        if (pdfUrl && !pdfUrl.startsWith('http')) {
            pdfUrl = `http://localhost:3001/${pdfUrl.replace(/\\/g, '/')}`;
        }
        window.open(pdfUrl, "_blank");
    }


    const verificaSeEstaPago = (dataPagamento: string | null) => {
        if (!dataPagamento) return false;
        const data = new Date(dataPagamento);
        const agora = new Date();
        const diffEmDias = (agora.getTime() - data.getTime()) / (1000 * 60 * 60 * 24);
        return diffEmDias <= 30;
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-extrabold text-blue-950">Gestão de Moradores</h3>
                            <p className="text-sm text-slate-500 font-medium">{imovelSelecionado.nome}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4 bg-slate-50/50">
                        {imovelSelecionado.inquilinos && imovelSelecionado.inquilinos.length > 0 ? (
                            imovelSelecionado.inquilinos.map((inquilino: any, index: number) => {

                                const pagamentoFeito = pagamentosConfirmados.includes(inquilino.id_aluguel) || verificaSeEstaPago(inquilino.data_ultimo_pagamento);

                                return (
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
                                                        onClick={() => handleVerPdf(inquilino.comprovante_matricula_url)}
                                                    >
                                                        Ver PDF
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-xs rounded-lg h-7 px-2"
                                                        onClick={() => handleAvaliarMatricula(inquilino.id_aluguel, "aprovado")}
                                                    >
                                                        Aprovar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="text-xs rounded-lg h-7 px-2"
                                                        onClick={() => handleAvaliarMatricula(inquilino.id_aluguel, "rejeitado")}
                                                    >
                                                        Recusar
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {}
                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <Banknote className="w-4 h-4 text-emerald-600" />
                                                <div>
                                                    <p className="text-xs font-bold text-slate-700">Mensalidade Atual</p>
                                                    <p className="text-[10px] text-slate-500">
                                                        {pagamentoFeito ? "Pagamento confirmado pelo sistema" : "Confirme caso o aluno tenha pago em mãos"}
                                                    </p>
                                                </div>
                                            </div>

                                            {}
                                            {pagamentoFeito ? (
                                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-100 px-3 py-1.5 rounded-lg">
                                                    <CheckCircle2 className="w-4 h-4" /> Pago
                                                </span>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-900 hover:bg-blue-800 text-white text-xs rounded-xl h-8 px-3 font-bold gap-1.5 shadow-sm"
                                                    onClick={() => handleDarBaixaDinheiro(inquilino.id_aluguel)}
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Marcar como Pago
                                                </Button>
                                            )}
                                        </div>

                                        <div className="pt-2 flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => setInquilinoParaEncerrar(inquilino)}
                                            >
                                                <UserMinus className="w-3.5 h-3.5 mr-1.5" />
                                                Encerrar Contrato
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-slate-500 text-sm py-4">
                                Nenhum morador ativo encontrado nesta república.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <ModalEncerrarContrato
                inquilino={inquilinoParaEncerrar}
                isPending={isEncerrando}
                onClose={() => setInquilinoParaEncerrar(null)}
                onConfirm={confirmarEncerramento}
            />
        </>
    );
}