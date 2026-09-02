"use client";
import { useState } from "react";
import { QrCode, Banknote, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export function ModalOpcoesPagamento({ idAluguel, mesReferencia, valor }: any) {
    const [passo, setPasso] = useState<"escolha" | "pix" | "dinheiro">("escolha");
    const [qrCodeData, setQrCodeData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    async function handleGerarPix() {
        setLoading(true);
        try {
            const response = await api.post("/pagamentos/gerar-pix", { idAluguel, mesReferencia });
            setQrCodeData(response.data);
            setPasso("pix");
        } catch (error) {
            toast.error("Erro ao gerar o código PIX.");
        } finally {
            setLoading(false);
        }
    }

    async function handlePagarDinheiro() {
        setLoading(true);
        try {
            await api.post("/pagamentos/notificar-dinheiro", { idAluguel, mesReferencia });
            setPasso("dinheiro");
            toast.success("O dono da república foi avisado!");
        } catch (error) {
            toast.error("Erro ao registrar intenção de pagamento.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm max-w-sm w-full">
            {passo === "escolha" && (
                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold text-blue-950 text-lg">Forma de Pagamento</h3>
                        <p className="text-sm text-slate-500">Referente a: {mesReferencia} • R$ {Number(valor).toFixed(2)}</p>
                    </div>

                    <Button
                        onClick={handleGerarPix}
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 gap-2 shadow-sm font-bold"
                    >
                        <QrCode className="w-5 h-5" /> Pagar com PIX (Baixa na hora)
                    </Button>

                    <Button
                        onClick={handlePagarDinheiro}
                        disabled={loading}
                        variant="outline"
                        className="w-full rounded-xl py-6 gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold"
                    >
                        <Banknote className="w-5 h-5 text-slate-500" /> Pagar em Dinheiro (Em Mãos)
                    </Button>
                </div>
            )}

            {passo === "pix" && (
                <div className="space-y-4 text-center">
                    <Button onClick={() => setPasso("escolha")} variant="ghost" size="sm" className="mb-2 -ml-2 text-slate-400">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                    </Button>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <QrCode className="w-32 h-32 mx-auto text-slate-400" />
                        <p className="text-xs text-slate-500 mt-4">Escaneie o QR Code no app do seu banco</p>
                    </div>
                </div>
            )}

            {passo === "dinheiro" && (
                <div className="text-center py-4 space-y-4">
                    <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                        <Banknote className="w-6 h-6 text-amber-600" />
                    </div>
                    <h4 className="font-bold text-amber-800 text-lg">Pagamento Presencial</h4>
                    <p className="text-sm text-amber-700/80 leading-relaxed px-4">
                        Entregue o valor diretamente para o responsável da república. Ele dará a baixa manual no sistema assim que receber.
                    </p>
                    <Button onClick={() => setPasso("escolha")} variant="ghost" className="text-xs text-slate-400 mt-4">
                        Voltar para formas de pagamento
                    </Button>
                </div>
            )}
        </div>
    );
}