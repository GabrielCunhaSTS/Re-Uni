"use client";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
interface ModalExcluirRepublicaProps {
    republica: any;
    isPending: boolean;
    onClose: () => void;
    onConfirm: () => void;
}
export function ModalExcluirRepublica({ republica, isPending, onClose, onConfirm }: ModalExcluirRepublicaProps) {
    if (!republica) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-100 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="bg-red-50 text-red-600 p-3 rounded-2xl">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-blue-950">Excluir República</h3>
                        <p className="text-xs text-slate-500">Esta ação não poderá ser desfeita.</p>
                    </div>
                </div>
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    Tem certeza de que deseja remover o imóvel <strong className="text-slate-900">{republica.nome}</strong> do sistema?
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
                        {isPending ? "Excluindo..." : "Sim, Excluir"}
                    </Button>
                </div>
            </div>
        </div>
    );
}