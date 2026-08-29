"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
export function EnviarComprovanteModal({ idAluguel }: { idAluguel: number }) {
    const [mesReferencia, setMesReferencia] = useState(() => {
        const date = new Date();
        return date.toISOString().slice(0, 7);
    });
    const [arquivoUrl, setArquivoUrl] = useState("");
    const queryClient = useQueryClient();
    const enviarComprovanteMutation = useMutation({
        mutationFn: async () => {
            await api.post("/comprovantes", {
                id_aluguel: idAluguel,
                mes_referencia: mesReferencia,
                arquivo_url: arquivoUrl,
            });
        },
        onSuccess: () => {
            toast.success("Comprovante enviado com sucesso! Aguardando análise.");
            setArquivoUrl("");
            queryClient.invalidateQueries({ queryKey: ["comprovantes-anunciante"] });
        },
        onError: (error: any) => {
            console.error("Erro detalhado:", error.response?.data);
            toast.error("Erro ao enviar o comprovante. Tente novamente.");
        },
    });
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-extrabold text-blue-950 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-900" /> Enviar Comprovante de Pagamento
            </h4>
            <div className="space-y-3">
                <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Mês de Referência</label>
                    <Input
                        type="month"
                        value={mesReferencia}
                        onChange={(e) => setMesReferencia(e.target.value)}
                        className="rounded-xl border-slate-200"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Link do Comprovante (PDF ou Imagem)</label>
                    <Input
                        type="text"
                        placeholder="https://exemplo.com/comprovante.pdf"
                        value={arquivoUrl}
                        onChange={(e) => setArquivoUrl(e.target.value)}
                        className="rounded-xl border-slate-200"
                    />
                </div>
                <Button
                    onClick={() => enviarComprovanteMutation.mutate()}
                    disabled={enviarComprovanteMutation.isPending || !arquivoUrl}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold py-2"
                >
                    {enviarComprovanteMutation.isPending ? "Enviando..." : "Enviar para Análise"}
                </Button>
            </div>
        </div>
    );
}