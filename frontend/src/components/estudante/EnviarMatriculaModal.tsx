"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function EnviarMatriculaModal({ idAluguel }: { idAluguel: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const [arquivo, setArquivo] = useState<File | null>(null);
    const queryClient = useQueryClient();

    const uploadMutation = useMutation({
        mutationFn: async () => {
            if (!arquivo) throw new Error("Selecione um arquivo PDF.");
            const formData = new FormData();
            formData.append("arquivo", arquivo);

            const response = await api.post(`/alugueis/${idAluguel}/matricula`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success("Comprovante de matrícula enviado para análise!");
            setIsOpen(false);
            setArquivo(null);
            queryClient.invalidateQueries({ queryKey: ["meu-aluguel-republica"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.mensagem || "Erro ao enviar comprovante.");
        }
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl gap-2 font-bold py-3 h-auto">
                    <FileText className="w-5 h-5" />
                    Validar Matrícula (Obrigatório)
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-blue-950">Comprovante de Matrícula</DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Envie um PDF atualizado do seu comprovante de matrícula para validar seu perfil de estudante.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Arquivo (PDF)</label>
                        <Input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                            className="rounded-xl border-slate-200 cursor-pointer file:text-indigo-900 file:font-bold file:border-0 file:bg-indigo-50 file:px-4 file:py-1 file:rounded-lg file:mr-3"
                        />
                    </div>

                    <Button
                        onClick={() => uploadMutation.mutate()}
                        disabled={uploadMutation.isPending || !arquivo}
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        {uploadMutation.isPending ? "Enviando..." : "Enviar para Análise"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}