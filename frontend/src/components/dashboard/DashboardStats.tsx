"use client";

import { DollarSign, ShieldCheck, Clock, Ban } from "lucide-react";

interface DashboardStatsProps {
    estatisticas: any;
    totalAtivos: number;
    totalPendentes: number;
    totalCancelados: number;
}

export function DashboardStats({ estatisticas, totalAtivos, totalPendentes, totalCancelados }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ganho Mensal</p>
                    <h3 className="text-2xl font-extrabold text-emerald-600">
                        R$ {estatisticas?.receita_mensal ? Number(estatisticas.receita_mensal).toFixed(2) : "0.00"}
                    </h3>
                </div>
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
                    <DollarSign className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contratos Ativos</p>
                    <h3 className="text-2xl font-extrabold text-blue-950">{totalAtivos}</h3>
                </div>
                <div className="bg-blue-50 text-blue-900 p-3 rounded-2xl">
                    <ShieldCheck className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendentes</p>
                    <h3 className="text-2xl font-extrabold text-amber-600">{totalPendentes}</h3>
                </div>
                <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl">
                    <Clock className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cancelados / Outros</p>
                    <h3 className="text-2xl font-extrabold text-slate-600">{totalCancelados}</h3>
                </div>
                <div className="bg-slate-100 text-slate-500 p-3 rounded-2xl">
                    <Ban className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}