"use client";
import { UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalEncerrarContratoProps {
    inquilino: any;
    isPending: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ModalEncerrarContrato({ inquilino, isPending, onClose, onConfirm }: ModalEncerrarContratoProps) {
    if (!inquilino) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-100 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="bg-red-50 text-red-600 p-3 rounded-2xl">
                        <UserMinus className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-blue-950">Encerrar Contrato</h3>
                        <p className="text-xs text-slate-500">Esta ação liberará a vaga na república.</p>
                    </div>
                </div>
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    Tem certeza de que deseja encerrar o contrato de <strong className="text-slate-900">{inquilino.nome}</strong>? O morador será desligado do aluguel e a vaga ficará disponível imediatamente.
                </p>
                <div className="flex items-center gap-3 justify-end pt-2">
                    <Button
                        variant="outline"
                        className="rounded-xl border-slate-200 text-slate-700"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 shadow-md"
                        onClick={onConfirm}
                        disabled={isPending}
                    >
                        {isPending ? "Encerrando..." : "Sim, Encerrar Contrato"}
                    </Button>
                </div>
            </div>
        </div>
    );
}