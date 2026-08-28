"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

interface RepublicaCardProps {
    republica: any;
    onVerDetalhes: (id: number) => void;
    favoritoInicial?: boolean;
}

export function RepublicaCard({ republica, onVerDetalhes, favoritoInicial = false }: RepublicaCardProps) {
    const id = republica.id || republica.id_republica;
    const [isFavorito, setIsFavorito] = useState(favoritoInicial);

    const listaImgs = republica.imagens || republica.Imagens || republica.fotos || republica.Fotos || [];
    const imgObj = listaImgs[0];
    const urlBruta = typeof imgObj === 'string' ? imgObj : (imgObj?.url || imgObj?.Imagem?.url);

    const imagemUrl = urlBruta 
        ? (urlBruta.startsWith("http") ? urlBruta : `http://localhost:3001${urlBruta}`)
        : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80";

    async function handleToggleFavorito(e: React.MouseEvent) {
        e.stopPropagation();
        try {
            const response = await api.post(`/favoritos/${id}`);
            setIsFavorito(response.data.favoritado);
            toast.success(response.data.mensagem);
        } catch (error) {
            toast.error("Faça login para favoritar repúblicas.");
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group relative">
            <div className="h-52 bg-slate-100 relative overflow-hidden">
                <img 
                    src={imagemUrl} 
                    alt={republica.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Botão de Favorito */}
                <button 
                    onClick={handleToggleFavorito}
                    className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md hover:bg-white transition-colors"
                >
                    <Heart className={`w-5 h-5 ${isFavorito ? "text-red-500 fill-red-500" : "text-slate-600"}`} />
                </button>

                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-950 shadow-sm">
                    {republica.vagas_disponiveis > 0 ? `${republica.vagas_disponiveis} vagas` : "Lotado"}
                </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <h4 className="text-lg font-bold text-blue-950 mb-2 group-hover:text-blue-900 transition-colors">
                        {republica.nome}
                    </h4>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                        {republica.descricao || "Sem descrição disponível."}
                    </p>
                </div>
                
                <div className="border-t border-slate-100 pt-4 mt-auto">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Valor Mensal</span>
                        <span className="text-lg font-extrabold text-emerald-600">
                            R$ {republica.valor_mensal ? Number(republica.valor_mensal).toFixed(2) : "0.00"}
                        </span>
                    </div>
                    
                    <Button 
                        className="w-full bg-slate-900 hover:bg-blue-900 text-white rounded-xl py-5 transition-colors font-semibold"
                        onClick={() => onVerDetalhes(id)}
                    >
                        Ver Detalhes
                    </Button>
                </div>
            </div>
        </div>
    );
}