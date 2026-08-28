"use client";

import { Button } from "@/components/ui/button";

interface RepublicaSidebarAnuncianteProps {
    anunciante: any;
    vagasDisponiveis: number;
    isPending: boolean;
    onSolicitar: () => void;
}

export function RepublicaSidebarAnunciante({ anunciante, vagasDisponiveis, isPending, onSolicitar }: RepublicaSidebarAnuncianteProps) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
            <h3 className="text-lg font-bold text-blue-950">Informações do Anunciante</h3>
            
            {anunciante ? (
                <div className="space-y-3 text-sm text-slate-600 border-b border-slate-100 pb-6">
                    <p className="font-semibold text-slate-900 text-base">{anunciante.nome}</p>
                    <p>📧 {anunciante.email}</p>
                    {anunciante.telefone && <p>📞 {anunciante.telefone}</p>}
                </div>
            ) : (
                <p className="text-sm text-slate-400">Informações indisponíveis.</p>
            )}

            <div className="space-y-3">
                <Button 
                    onClick={onSolicitar}
                    disabled={isPending || vagasDisponiveis <= 0}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white py-6 rounded-2xl font-bold shadow-md transition-all"
                >
                    {isPending ? "Enviando..." : vagasDisponiveis > 0 ? "Solicitar Vaga / Aluguel" : "República Lotada"}
                </Button>
                <p className="text-xs text-center text-slate-400">
                    Ao solicitar, o proprietário receberá um aviso para aprovar sua entrada.
                </p>
            </div>
        </div>
    );
}