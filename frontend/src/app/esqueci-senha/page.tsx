"use client";
import { useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function EsqueciSenhaPage() {
    const [email, setEmail] = useState("");
    const [carregando, setCarregando] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Informe seu e-mail cadastrado.");
            return;
        }

        try {
            setCarregando(true);
            await api.post("/auth/esqueci-senha", { email });
            toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
            setEmail("");
        } catch (error: any) {
            toast.error(error.response?.data?.mensagem || "Erro ao solicitar recuperação.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                    <Link href="/login">
                        <Button variant="ghost" size="icon" className="rounded-xl">
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-extrabold text-blue-950">Recuperar Senha</h1>
                </div>

                <p className="text-sm text-slate-500">
                    Digite seu e-mail abaixo e enviaremos um link seguro para você redefinir sua senha.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">E-mail Cadastrado</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <Input
                                type="email"
                                placeholder="seu.email@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                        {carregando ? "Enviando e-mail..." : "Enviar Link de Recuperação"}
                    </Button>
                </form>
            </div>
        </div>
    );
}