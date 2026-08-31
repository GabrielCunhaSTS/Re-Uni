"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

interface ModalPagamentoPixProps {
    aluguel: {
        id_aluguel: number;
        valor: number;
    };
    onClose: () => void;
}

export function ModalPagamentoPix({ aluguel, onClose }: ModalPagamentoPixProps) {
    const [dadosPix, setDadosPix] = useState<{ qrCodeBase64: string; pixCopiaECola: string } | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [copiado, setCopiado] = useState(false);

    async function handleGerarPix() {
        try {
            setCarregando(true);

            const response = await api.post(`/despesas/aluguel/${aluguel.id_aluguel}/gerar-pix`);
            setDadosPix(response.data.pix);
            toast.success("PIX gerado com sucesso!");
        } catch (error: any) {
            console.error("Erro ao gerar PIX:", error);
            toast.error(error.response?.data?.mensagem || "Erro ao gerar PIX.");
        } finally {
            setCarregando(false);
        }
    }

    function copiarCodigoCopiaECola() {
        if (!dadosPix) return;
        navigator.clipboard.writeText(dadosPix.pixCopiaECola);
        setCopiado(true);
        toast.success("Código PIX copiado para a área de transferência!");
        setTimeout(() => setCopiado(false), 3000);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-blue-950">Pagamento via PIX</h3>
                    <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
                </div>

                {!dadosPix ? (
                    <div className="text-center space-y-4 py-4">
                        <p className="text-sm text-slate-600">
                            Gere o QR Code instantâneo para pagar a fatura de{" "}
                            <strong className="text-emerald-600 font-bold">
                                R$ {Number(aluguel.valor || 0).toFixed(2)}
                            </strong>.
                        </p>
                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-bold"
                            onClick={handleGerarPix}
                            disabled={carregando}
                        >
                            {carregando ? "Gerando PIX..." : "Gerar QR Code PIX"}
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <p className="text-xs text-slate-500">Escaneie o QR Code abaixo com o app do seu banco ou utilize o código Copia e Cola:</p>

                        {dadosPix.qrCodeBase64 && (
                            <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                <img
                                    src={`data:image/png;base64,${dadosPix.qrCodeBase64}`}
                                    alt="QR Code PIX"
                                    className="w-48 h-48 mx-auto"
                                />
                            </div>
                        )}

                        <div className="w-full space-y-2">
                            <Button
                                variant="outline"
                                className="w-full rounded-xl border-slate-200 text-slate-700 gap-2"
                                onClick={copiarCodigoCopiaECola}
                            >
                                {copiado ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                {copiado ? "Código Copiado!" : "Copiar Código PIX (Copia e Cola)"}
                            </Button>
                        </div>

                        <p className="text-[11px] text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                            ⚠️ Assim que o pagamento for aprovado pelo banco, o sistema atualizará o status desta fatura automaticamente.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}