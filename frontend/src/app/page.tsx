"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, LogIn, UserPlus, Search, MapPin, LogOut, LayoutDashboard, Heart, SlidersHorizontal, User } from "lucide-react";
import { RepublicaCard } from "@/components/home/RepublicaCard";
import { MenuNotificacoes } from "./notificacoes/MenuNotificacoes";
import { MapaGeral } from "@/components/home/MapaGeral";

export default function HomePage() {
    const router = useRouter();
    
    const [cidadeBusca, setCidadeBusca] = useState("");
    const [precoMin, setPrecoMin] = useState("");
    const [precoMax, setPrecoMax] = useState("");
    const [pesquisaGeral, setPesquisaGeral] = useState("");
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

    useEffect(() => {
        const userStr = localStorage.getItem("@ReUni:user");
        const token = localStorage.getItem("@ReUni:token");
        if (userStr && token) {
            try {
                setUsuarioLogado(JSON.parse(userStr));
            } catch (e) {
                setUsuarioLogado(null);
            }
        }
    }, []);

    const { data: republicas = [], isLoading, isError } = useQuery({
        queryKey: ["republicas-publicas", cidadeBusca, precoMin, precoMax, pesquisaGeral],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (cidadeBusca) params.append("cidade", cidadeBusca);
            if (precoMin) params.append("preco_min", precoMin);
            if (precoMax) params.append("preco_max", precoMax);
            if (pesquisaGeral) params.append("pesquisa", pesquisaGeral);

            const endpoint = `/republicas/buscar?${params.toString()}`;
            const response = await api.get(endpoint);
            return Array.isArray(response.data) ? response.data : response.data.republicas || [];
        },
    });

    const { data: favoritosIds = [] } = useQuery({
        queryKey: ["ids-meus-favoritos"],
        queryFn: async () => {
            const token = localStorage.getItem("@ReUni:token");
            if (!token) return [];
            const response = await api.get("/favoritos");
            const lista = Array.isArray(response.data) ? response.data : [];
            return lista.map((f: any) => f.id_republica || f.id || f.republica?.id_republica || f.republica?.id).filter(Boolean);
        },
        enabled: !!usuarioLogado,
    });

    function handleLogout() {
        localStorage.removeItem("@ReUni:token");
        localStorage.removeItem("@ReUni:user");
        setUsuarioLogado(null);
        router.refresh();
    }

    function handleVerDetalhes(idRepublica: number) {
        const token = localStorage.getItem("@ReUni:token");
        if (!token) {
            router.push("/login");
        } else {
            router.push(`/republicas/${idRepublica}`);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
                    <div className="bg-blue-900 text-white p-2 rounded-xl">
                        <Home className="w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tight text-blue-950">ReUni</h1>
                </div>

                <div className="flex items-center gap-4">
                    {usuarioLogado ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-600 hidden sm:block">
                                Olá, <strong className="text-slate-900">{usuarioLogado.nome}</strong>
                            </span>

                            <MenuNotificacoes />

                            <Button onClick={() => router.push("/favoritos")} variant="outline" className="rounded-xl border-slate-200 text-red-600 hover:text-red-700 hover:bg-red-50">
                                <Heart className="w-4 h-4 mr-2 fill-red-500 text-red-500" /> Favoritos
                            </Button>

                            {usuarioLogado.tipo === "anunciante" && (
                                <Button onClick={() => router.push("/dashboard")} variant="outline" className="rounded-xl border-slate-200">
                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                    Painel
                                </Button>
                            )}

                            <Button onClick={() => router.push("/perfil")} variant="outline" className="rounded-xl border-slate-200 text-slate-700">
                                <User className="w-4 h-4 mr-2" /> Meu Perfil
                            </Button>

                            <Button onClick={handleLogout} variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl">
                                <LogOut className="w-4 h-4 mr-2" />
                                Sair
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button onClick={() => router.push("/login")} variant="ghost" className="text-slate-700 hover:text-blue-900 font-medium rounded-xl">
                                <LogIn className="w-4 h-4 mr-2" />
                                Entrar
                            </Button>
                            <Button onClick={() => router.push("/register")} className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-sm">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Registrar-se
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            <section className="max-w-7xl mx-auto px-6 pt-12 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="border-l-4 border-blue-900 pl-4 py-1">
                            <span className="text-xs font-bold tracking-wider text-blue-900 uppercase">Moradia Estudantil Inteligente</span>
                            <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-950 tracking-tight leading-tight mt-1">
                                Encontre a república ideal para sua jornada.
                            </h2>
                        </div>
                        <p className="text-slate-600 text-lg max-w-xl">
                            Pesquise por localização, preço e tipo de moradia de forma simples, rápida e totalmente segura.
                        </p>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                            <img 
                                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" 
                                alt="Ambiente aconchegante" 
                                className="w-full h-72 object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* BARRA DE PESQUISA E FILTROS */}
                <div className="mt-10 bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-100 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex-1 w-full">
                            <MapPin className="text-slate-400 w-5 h-5 shrink-0" />
                            <input 
                                type="text" 
                                placeholder="Digite a cidade (ex: Santos, São Vicente)..."
                                value={cidadeBusca}
                                onChange={(e) => setCidadeBusca(e.target.value)}
                                className="bg-transparent border-none outline-none w-full text-slate-800 placeholder:text-slate-400 text-sm"
                            />
                        </div>

                        <Button 
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            variant="outline" 
                            className="rounded-xl border-slate-200 h-12 px-5 gap-2 text-slate-700 w-full md:w-auto"
                        >
                            <SlidersHorizontal className="w-4 h-4" /> Filtros por Preço
                        </Button>
                    </div>

                    {mostrarFiltros && (
                        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-600 block mb-1">Preço Mínimo (R$)</label>
                                <input 
                                    type="number" 
                                    placeholder="Ex: 500" 
                                    value={precoMin} 
                                    onChange={(e) => setPrecoMin(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600 block mb-1">Preço Máximo (R$)</label>
                                <input 
                                    type="number" 
                                    placeholder="Ex: 1500" 
                                    value={precoMax} 
                                    onChange={(e) => setPrecoMax(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600 block mb-1">Pesquisar por Nome/Descrição</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Moradia perto da faculdade" 
                                    value={pesquisaGeral} 
                                    onChange={(e) => setPesquisaGeral(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* SEÇÃO DO MAPA INTERATIVO GERAL */}
            <section className="max-w-7xl mx-auto px-6 mb-12">
                <div className="mb-4 flex flex-col">
                    <h3 className="text-xl font-extrabold text-blue-950">Explorar por Mapa</h3>
                    <p className="text-sm text-slate-500">Visualize a localização exata de todas as repúblicas disponíveis.</p>
                </div>
                <MapaGeral />
            </section>

            <main className="max-w-7xl mx-auto px-6 pb-20">
                <div className="mb-8 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-blue-950">Repúblicas em Destaque</h3>
                    <span className="text-sm text-slate-500 font-medium">{republicas?.length || 0} imóveis encontrados</span>
                </div>

                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-white h-80 rounded-2xl animate-pulse border border-slate-200"></div>
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center">
                        Erro ao carregar as repúblicas. Verifique se o backend está rodando.
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {republicas?.length === 0 && !isLoading && (
                        <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center">
                            <p className="text-slate-500 text-lg">Nenhuma república encontrada com esses critérios de filtro.</p>
                        </div>
                    )}

                    {republicas?.map((republica: any) => {
                        const republicaId = republica.id || republica.id_republica;
                        const isFavoritoUser = favoritosIds.includes(republicaId);

                        return (
                            <RepublicaCard 
                                key={republicaId} 
                                republica={republica} 
                                onVerDetalhes={handleVerDetalhes} 
                                favoritoInicial={isFavoritoUser}
                            />
                        );
                    })}
                </div>
            </main>
        </div>
    );
}