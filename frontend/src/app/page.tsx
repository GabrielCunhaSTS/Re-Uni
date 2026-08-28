"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, LogIn } from "lucide-react";

export default function HomePage() {
    const router = useRouter();

    const { data: republicas, isLoading, isError } = useQuery({
        queryKey: ["republicas-publicas"],
        queryFn: async () => {
            const response = await api.get("/republicas");

            return response.data.republicas || response.data; 
        },
    });

    return (
        <div className="min-h-screen bg-zinc-50">
            <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <Home className="text-zinc-900 w-6 h-6" />
                    <h1 className="text-xl font-bold text-zinc-900">ReUni</h1>
                </div>
                <div>
                    <Button onClick={() => router.push("/login")} variant="outline" size="sm">
                        <LogIn className="w-4 h-4 mr-2" />
                        Entrar / Anunciar
                    </Button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-zinc-900 mb-2">Encontre sua República</h2>
                    <p className="text-zinc-600">Explore as melhores opções de moradia estudantil disponíveis.</p>
                </div>

                {isLoading && (
                    <p className="text-zinc-500 animate-pulse">Carregando repúblicas...</p>
                )}

                {isError && (
                    <p className="text-red-500">Erro ao carregar as repúblicas. Tente novamente mais tarde.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {republicas?.length === 0 && !isLoading && (
                        <p className="text-zinc-500 col-span-full">Nenhuma república cadastrada no momento.</p>
                    )}

                    {republicas?.map((republica: any) => (
                        <div key={republica.id || republica.id_republica} className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                            <div className="h-48 bg-zinc-200 w-full flex items-center justify-center text-zinc-400">
                                Sem Imagem
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-zinc-900 mb-1">{republica.nome}</h3>
                                <p className="text-sm text-zinc-500 mb-4 line-clamp-2">
                                    {republica.descricao || "Sem descrição disponível."}
                                </p>
                                
                                <div className="mt-auto space-y-2 mb-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-600">Vagas disponíveis:</span>
                                        <span className="font-semibold text-zinc-900">{republica.vagas_disponiveis || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-600">Valor mensal:</span>
                                        <span className="font-bold text-green-600">
                                            R$ {republica.valor_mensal ? Number(republica.valor_mensal).toFixed(2) : "0.00"}
                                        </span>
                                    </div>
                                </div>
                                
                                <Button className="w-full" onClick={() => router.push(`/republicas/${republica.id || republica.id_republica}`)}>
                                    Ver Detalhes
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}