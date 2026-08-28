"use client";

import { Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
    userName: string;
    onLogout: () => void;
}

export function DashboardHeader({ userName, onLogout }: DashboardHeaderProps) {
    return (
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
            <div className="flex items-center gap-3">
                <div className="bg-blue-900 text-white p-2 rounded-xl">
                    <Home className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-xl font-extrabold text-blue-950">ReUni</h1>
                    <span className="text-xs text-slate-400 font-medium">Painel do Anunciante</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <span className="text-sm text-slate-600 hidden sm:block">
                    Olá, <strong className="text-slate-900">{userName}</strong>
                </span>
                <Button onClick={onLogout} variant="outline" size="sm" className="rounded-xl border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                </Button>
            </div>
        </header>
    );
}