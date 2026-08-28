"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Plus, Trash2, Edit } from "lucide-react";

export default function DashboardAnunciantePage() {
    const router = useRouter();
    const [userName, setUserName] = useState("Anunciante");

    useEffect(() => {
        const token = localStorage.getItem("@ReUni:token");
        const userStr = localStorage.getItem("@ReUni:user");
        
        if (!token || !userStr) {
            router.push("/login");
            return;
        }

        const user = JSON.parse(userStr);

        if (user.tipo === "estudante") {
            alert("Área exclusiva para anunciantes.");
            router.push("/");
            return;
        }

        setUserName(user.nome || "Anunciante");
    }, [router]);

    const { data: republicas, isLoading, isError } = useQuery({
        queryKey: ["minhas-republicas"],
        queryFn: async () => {
            const response = await api.get("/republicas/minhas"); 
            return response.data;
        },
    });

    function handleLogout() {
        localStorage.removeItem("@ReUni:token");
        localStorage.removeItem("@ReUni:user");
        router.push("/login");
    }

    return (
        <div className="min-h-screen bg-zinc-50">
            <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <Home className="text-zinc-900 w-6 h-6" />
                    <h1 className="text-xl font-bold text-zinc-900">ReUni <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md ml-2 border">Painel do Anunciante</span></h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-600 hidden sm:block">
                        Olá, <strong className="text-zinc-900">{userName}</strong>
                    </span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                    </Button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900">Minhas Repúblicas</h2>
                        <p className="text-zinc-600">Gerencie seus imóveis anunciados na plataforma.</p>
                    </div>
                    <Button onClick={() => router.push("/dashboard/nova")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nova República
                    </Button>
                </div>

                {isLoading && (
                    <p className="text-zinc-500 animate-pulse">Carregando suas repúblicas...</p>
                )}

                {isError && (
                    <p className="text-red-500">Erro ao carregar seus imóveis. Verifique sua API ou se a rota /dashboard/republicas está correta.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {republicas?.length === 0 && !isLoading && (
                        <div className="col-span-full bg-white rounded-xl border border-zinc-200 p-8 text-center">
                            <p className="text-zinc-500 mb-4">Você ainda não cadastrou nenhuma república.</p>
                            <Button onClick={() => router.push("/dashboard/nova")}>Cadastrar Agora</Button>
                        </div>
                    )}

                    {republicas?.map((republica: any) => (
                        <div key={republica.id || republica.id_republica} className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="h-40 bg-zinc-200 w-full flex items-center justify-center text-zinc-400">
                                Sem Imagem
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-zinc-900 mb-1">{republica.nome}</h3>
                                <p className="text-sm text-zinc-500 mb-4 line-clamp-2">
                                    {republica.descricao || "Sem descrição disponível."}
                                </p>
                                
                                <div className="mt-auto space-y-2 mb-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-600">Vagas:</span>
                                        <span className="font-semibold text-zinc-900">{republica.vagas_disponiveis || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-600">Valor:</span>
                                        <span className="font-bold text-green-600">
                                            R$ {republica.valor_mensal ? Number(republica.valor_mensal).toFixed(2) : "0.00"}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1" size="sm">
                                        <Edit className="w-4 h-4 mr-1" /> Editar
                                    </Button>
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}