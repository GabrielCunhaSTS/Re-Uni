"use client";
import { useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { Suspense } from "react";

function FormResetarSenha() {
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [carregando, setCarregando] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Token de recuperação inválido ou ausente.");
            return;
        }
        if (novaSenha !== confirmaSenha) {
            toast.error("As senhas não coincidem.");
            return;
        }
        if (novaSenha.length < 6) {
            toast.error("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        try {
            setCarregando(true);
            await api.post("/auth/resetar-senha", { token, novaSenha });
            toast.success("Senha redefinida com sucesso! Faça login com a nova senha.");
            router.push("/login");
        } catch (error: any) {
            toast.error(error.response?.data?.mensagem || "Erro ao redefinir senha.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div>
                <h1 className="text-xl font-extrabold text-blue-950">Nova Senha</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Insira sua nova senha abaixo para concluir a recuperação.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Nova Senha</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <Input
                            type="password"
                            placeholder="********"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            className="pl-10 rounded-xl border-slate-200 py-2.5"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Confirmar Nova Senha</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <Input
                            type="password"
                            placeholder="********"
                            value={confirmaSenha}
                            onChange={(e) => setConfirmaSenha(e.target.value)}
                            className="pl-10 rounded-xl border-slate-200 py-2.5"
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={carregando}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold py-3 h-auto"
                >
                    {carregando ? "Salvando..." : "Salvar Nova Senha"}
                </Button>
            </form>
        </div>
    );
}

export default function ResetarSenhaPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <Suspense fallback={<p className="text-slate-500">Carregando...</p>}>
                <FormResetarSenha />
            </Suspense>
        </div>
    );
}