"use client";

import { MessageSquare, Sparkles, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListaSolicitacoesProps {
    solicitacoes: any[];
    loading: boolean;
    onAtualizarStatus: (idAluguel: number, status: string) => void;
}

export function ListaSolicitacoes({ solicitacoes, loading, onAtualizarStatus }: ListaSolicitacoesProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-blue-950">Solicitações de Moradia</h2>
                <p className="text-slate-500 text-sm">Gerencie os estudantes interessados em ocupar vagas nas suas repúblicas.</p>
            </div>

            {loading && <p className="text-slate-400 animate-pulse">Carregando solicitações...</p>}

            <div className="space-y-4">
                {solicitacoes?.length === 0 && !loading && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                        Nenhuma solicitação de aluguel recebida no momento.
                    </div>
                )}

                {solicitacoes?.map((solicitacao: any) => (
                    <div key={solicitacao.id_aluguel} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h4 className="font-bold text-blue-950 text-base">{solicitacao.usuario?.nome}</h4>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${
                                    solicitacao.status === 'pendente' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                    solicitacao.status === 'ativo' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                    'bg-slate-100 text-slate-600'
                                }`}>
                                    {solicitacao.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">
                                Interessado na república: <strong className="text-slate-700">{solicitacao.republica?.nome}</strong>
                            </p>
                            <div className="text-xs text-slate-400 flex gap-4 pt-1">
                                <span>📧 {solicitacao.usuario?.email}</span>
                                {solicitacao.usuario?.telefone && <span>📞 {solicitacao.usuario?.telefone}</span>}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-xl border-slate-200 text-blue-900 hover:bg-blue-50"
                                onClick={() => alert("Funcionalidade de chat integrada em breve!")}
                            >
                                <MessageSquare className="w-4 h-4 mr-1.5" /> Chat
                            </Button>

                            <button 
                                onClick={() => alert("Módulo de gestão extra (Em breve)")}
                                className="p-2 text-slate-400 hover:text-blue-900 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors"
                            >
                                <Sparkles className="w-4 h-4" />
                            </button>

                            {solicitacao.status === 'pendente' && (
                                <>
                                    <Button 
                                        size="sm" 
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm"
                                        onClick={() => onAtualizarStatus(solicitacao.id_aluguel, 'ativo')}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1" /> Aprovar
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="destructive"
                                        className="rounded-xl"
                                        onClick={() => onAtualizarStatus(solicitacao.id_aluguel, 'cancelado')}
                                    >
                                        <XCircle className="w-4 h-4 mr-1" /> Recusar
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}