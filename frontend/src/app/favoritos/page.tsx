"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { RepublicaCard } from "@/components/home/RepublicaCard";

export default function FavoritosPage() {
    const router = useRouter();

    const { data: favoritos, isLoading } = useQuery({
        queryKey: ["minhas-republicas-favoritas"],
        queryFn: async () => {
            const response = await api.get("/favoritos");
            return response.data;
        },
        refetchOnMount: "always", // <--- FORÇA O REFRESH TODA VEZ QUE A TELA FOR ABERTA
    });

    function handleVerDetalhes(idRepublica: number) {
        router.push(`/republicas/${idRepublica}`);
    }

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900">
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button onClick={() => router.push("/")} variant="ghost" className="rounded-xl p-2">
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </Button>
                    <h1 className="text-xl font-extrabold text-blue-950 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" /> Meus Favoritos
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-white h-80 rounded-2xl animate-pulse border border-slate-200"></div>
                        ))}
                    </div>
                )}

                {!isLoading && favoritos?.length === 0 && (
                    <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4 max-w-lg mx-auto">
                        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-red-500">
                            <Heart className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-blue-950">Nenhuma república favorita</h3>
                        <p className="text-slate-500 text-sm">Você ainda não salvou nenhuma república nos favoritos. Explore a home e clique no coração dos imóveis que gostar!</p>
                        <Button onClick={() => router.push("/")} className="bg-blue-900 text-white rounded-xl">
                            Explorar Repúblicas
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {favoritos?.map((republica: any) => (
                        <RepublicaCard 
                            key={republica.id_republica || republica.id} 
                            republica={republica} 
                            onVerDetalhes={handleVerDetalhes} 
                            favoritoInicial={true}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}