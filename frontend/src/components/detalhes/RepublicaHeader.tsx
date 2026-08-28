"use client";

import { MapPin } from "lucide-react";

interface RepublicaHeaderProps {
    republica: any;
}

export function RepublicaHeader({ republica }: RepublicaHeaderProps) {
    const loc = republica.localizacao;

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {republica.tipo?.nome || "Moradia Estudantil"}
                </span>
                <h2 className="text-3xl font-extrabold text-blue-950 mt-2">{republica.nome}</h2>
                {loc && (
                    <p className="text-slate-500 flex items-center gap-1.5 mt-1 text-sm">
                        <MapPin className="w-4 h-4 text-blue-900" />
                        {loc.endereco}, {loc.numero} - {loc.bairro}, {loc.cidade}
                    </p>
                )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-end min-w-[220px]">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Valor Mensal</span>
                <span className="text-3xl font-extrabold text-emerald-600 my-1">
                    R$ {Number(republica.valor_mensal).toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                    {republica.vagas_disponiveis} vagas disponíveis de {republica.vagas_total}
                </span>
            </div>
        </div>
    );
}