"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, ArrowLeft, User, Lock, Save } from "lucide-react";
import { toast } from "sonner";
export default function PerfilPage() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<any>(null);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    useEffect(() => {
        const userStr = localStorage.getItem("@ReUni:user");
        const token = localStorage.getItem("@ReUni:token");
        if (!token || !userStr) {
            router.push("/login");
            return;
        }
        const userData = JSON.parse(userStr);
        setUsuario(userData);
        setNome(userData.nome || "");
        setEmail(userData.email || "");
    }, [router]);
    const atualizarPerfilMutation = useMutation({
        mutationFn: async (dados: any) => {
            const response = await api.put("/perfil", dados);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Perfil atualizado com sucesso!");
            if (data.usuario) {
                localStorage.setItem("@ReUni:user", JSON.stringify(data.usuario));
                setUsuario(data.usuario);
            }
            setSenhaAtual("");
            setNovaSenha("");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.mensagem || "Erro ao atualizar perfil.");
        }
    });
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload: any = { nome, email };
        if (novaSenha) {
            payload.senhaAtual = senhaAtual;
            payload.novaSenha = novaSenha;
        }
        atualizarPerfilMutation.mutate(payload);
    }
    if (!usuario) return null;
    return (
        <div className="min-h-screen bg-slate-50/60 text-slate-900 pb-20">
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Button onClick={() => router.push(usuario.tipo === "anunciante" ? "/dashboard" : "/")} variant="ghost" className="rounded-xl p-2">
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </Button>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
                        <div className="bg-blue-900 text-white p-2 rounded-xl">
                            <Home className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight text-blue-950">ReUni</h1>
                    </div>
                </div>
            </header>
            <main className="max-w-2xl mx-auto px-6 pt-10">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-blue-950 flex items-center gap-2">
                            <User className="w-6 h-6 text-blue-900" /> Meu Perfil
                        </h2>
                        <p className="text-slate-500 text-sm">Gerencie suas informações cadastrais e segurança da conta.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Informações Pessoais</h3>
                            <div>
                                <label className="text-xs font-bold text-slate-600 block mb-1">Nome Completo</label>
                                <Input
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="rounded-xl bg-slate-50 border-slate-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600 block mb-1">E-mail</label>
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-xl bg-slate-50 border-slate-200"
                                    type="email"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600 block mb-1">Tipo de Conta</label>
                                <Input
                                    value={usuario.tipo === "anunciante" ? "Anunciante (Dono de República)" : "Estudante (Buscador de Moradia)"}
                                    disabled
                                    className="rounded-xl bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <Lock className="w-4 h-4" /> Alterar Senha (Opcional)
                            </h3>
                            <div>
                                <label className="text-xs font-bold text-slate-600 block mb-1">Senha Atual</label>
                                <Input
                                    type="password"
                                    placeholder="Digite sua senha atual para alterar"
                                    value={senhaAtual}
                                    onChange={(e) => setSenhaAtual(e.target.value)}
                                    className="rounded-xl bg-slate-50 border-slate-200"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600 block mb-1">Nova Senha</label>
                                <Input
                                    type="password"
                                    placeholder="Mínimo de 6 caracteres"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    className="rounded-xl bg-slate-50 border-slate-200"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={atualizarPerfilMutation.isPending}
                            className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-xl py-6 font-bold shadow-md gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {atualizarPerfilMutation.isPending ? "Salvando alterações..." : "Salvar Alterações"}
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}