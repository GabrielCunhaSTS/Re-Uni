"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const [userName, setUserName] = useState("Estudante");

    useEffect(() => {
        const token = localStorage.getItem("@ReUni:token");
        const user = localStorage.getItem("@ReUni:user");
        
        if (!token) {
            router.push("/login");
        } else if (user) {
            setUserName(JSON.parse(user).nome || "Estudante");
        }
    }, [router]);

    const { data: republicas, isLoading, isError } = useQuery({
        queryKey: ["republicas"],
        queryFn: async () => {
            const response = await api.get("/republicas"); 
            
            return response.data.republicas; 
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
                    <h1 className="text-xl font-bold text-zinc-900">ReUni</h1>
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
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-zinc-900">Repúblicas Disponíveis</h2>
                    <p className="text-zinc-600">Encontre o lugar ideal para sua jornada universitária.</p>
                </div>

                {isLoading && (
                    <p className="text-zinc-500 animate-pulse">Carregando repúblicas...</p>
                )}

                {isError && (
                    <p className="text-red-500">Erro ao carregar os dados. Verifique sua API.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {republicas?.length === 0 && !isLoading && (
                        <p className="text-zinc-500 col-span-full">Nenhuma república cadastrada ainda.</p>
                    )}

                    {republicas?.map((republica: any) => (
                        <div key={republica.id} className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                            {/* Imagem Placeholder (Pode substituir pela imagem real depois) */}
                            <div className="h-48 bg-zinc-200 w-full object-cover flex items-center justify-center text-zinc-400">
                                Sem Imagem
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-zinc-900 mb-1">{republica.nome}</h3>
                                <p className="text-sm text-zinc-500 mb-4 line-clamp-2">
                                    {republica.descricao || "Sem descrição disponível."}
                                </p>
                                
                                <div className="mt-auto space-y-2">
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
                                
                                <Button className="w-full mt-6">Ver Detalhes</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}