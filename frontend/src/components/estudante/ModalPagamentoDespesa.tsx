"use client";
import { useState } from "react";
import { QrCode, Banknote, ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export function ModalPagamentoDespesa({ idDespesaInquilino, valor, titulo, onClose }: any) {
    const [passo, setPasso] = useState<"escolha" | "pix" | "dinheiro">("escolha");
    const [qrCodeData, setQrCodeData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    async function handleGerarPix() {
        setLoading(true);
        try {
            const response = await api.post("/pagamentos/despesas/pix", { idDespesaInquilino });
            setQrCodeData(response.data.pix);
            setPasso("pix");
        } catch (error: any) {
            console.error("Erro no PIX:", error);
            const mensagem = error.response?.data?.mensagem || "Erro ao gerar o código PIX.";
            toast.error(mensagem);
        } finally {
            setLoading(false);
        }
    }

    async function handlePagarDinheiro() {
        setLoading(true);
        try {
            await api.post("/pagamentos/despesas/notificar-dinheiro", { idDespesaInquilino });
            setPasso("dinheiro");
            toast.success("O dono da república foi avisado!");
        } catch (error: any) {
            console.error("Erro no dinheiro:", error);
            const mensagem = error.response?.data?.mensagem || "Erro ao registrar intenção de pagamento.";
            toast.error(mensagem);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm max-w-sm w-full">
            {passo === "escolha" && (
                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold text-blue-950 text-lg">Pagar Despesa</h3>
                        <p className="text-sm text-slate-500">{titulo} • R$ {Number(valor).toFixed(2)}</p>
                    </div>

                    <Button
                        onClick={handleGerarPix}
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 gap-2 shadow-sm font-bold"
                    >
                        <QrCode className="w-5 h-5" /> Pagar com PIX (Chave Direta)
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

            {passo === "pix" && qrCodeData && (
                <div className="space-y-4 text-center flex flex-col items-center">
                    <Button onClick={() => setPasso("escolha")} variant="ghost" size="sm" className="mb-2 self-start text-slate-400 -ml-3">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                    </Button>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 w-full space-y-4">
                        <img
                            src={`data:image/jpeg;base64,${qrCodeData.qrCodeBase64}`}
                            alt="QR Code PIX"
                            className="w-36 h-36 mx-auto rounded-xl border border-slate-200 p-2 bg-white"
                        />

                        <div className="bg-white border border-slate-200 rounded-xl p-3 text-left">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Chave PIX do Anunciante</p>
                            <p className="text-sm font-bold text-blue-950 break-all select-all">{qrCodeData.chavePixPura}</p>
                        </div>

                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(qrCodeData.pixCopiaECola);
                                toast.success("Código Copia e Cola copiado!");
                            }}
                            variant="outline"
                            className="w-full gap-2 rounded-xl text-xs font-bold border-blue-200 text-blue-800 hover:bg-blue-50"
                        >
                            <Copy className="w-4 h-4" /> Copiar 'Copia e Cola'
                        </Button>
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
                    <div className="flex flex-col gap-2 mt-4">
                        <Button onClick={onClose} variant="default" className="w-full rounded-xl">
                            Entendi
                        </Button>
                        <Button onClick={() => setPasso("escolha")} variant="ghost" className="text-xs text-slate-400">
                            Voltar para formas de pagamento
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}