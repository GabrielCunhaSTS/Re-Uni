"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from "lucide-react";
interface RepublicaImagensProps {
    republica: any;
}
export function RepublicaImagens({ republica }: RepublicaImagensProps) {
    const [indiceAtivo, setIndiceAtivo] = useState<number | null>(null);
    const formatarUrl = (url?: string) => {
        if (!url) return "";
        return url.startsWith("http") ? url : `http://localhost:3001${url}`;
    };
    const imagens = republica.imagens || republica.Imagens || republica.fotos || republica.Fotos || [];
    const primeiraImagemUrl = formatarUrl(imagens[0]?.url) || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";
    const abrirModal = (index: number) => {
        setIndiceAtivo(index);
    };
    const fecharModal = () => {
        setIndiceAtivo(null);
    };
    const proximaImagem = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (indiceAtivo !== null && indiceAtivo < imagens.length - 1) {
            setIndiceAtivo(indiceAtivo + 1);
        }
    };
    const imagemAnterior = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (indiceAtivo !== null && indiceAtivo > 0) {
            setIndiceAtivo(indiceAtivo - 1);
        }
    };
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                {}
                <div
                    className="h-80 md:h-[400px] bg-slate-100 cursor-pointer relative group overflow-hidden"
                    onClick={() => imagens.length > 0 && abrirModal(0)}
                >
                    <img
                        src={primeiraImagemUrl}
                        alt={republica.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-sm">
                        Clique para ampliar
                    </div>
                </div>
                {}
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50/50">
                    {imagens.slice(1, 5).map((img: any, idx: number) => {
                        const realIndex = idx + 1;
                        const imgUrl = formatarUrl(img.url);
                        return (
                            <div
                                key={idx}
                                className="h-44 rounded-2xl overflow-hidden bg-slate-200 cursor-pointer relative group"
                                onClick={() => abrirModal(realIndex)}
                            >
                                <img src={imgUrl} alt="Detalhe" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        );
                    })}
                    {imagens.length <= 1 && (
                        <div className="col-span-2 flex items-center justify-center text-slate-400 text-sm">
                            Sem imagens adicionais
                        </div>
                    )}
                </div>
            </div>
            {}
            {indiceAtivo !== null && imagens.length > 0 && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={fecharModal}
                >
                    <button
                        onClick={fecharModal}
                        className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        {}
                        {indiceAtivo > 0 && (
                            <button
                                onClick={imagemAnterior}
                                className="absolute left-4 z-10 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-md transition-all shadow-lg"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
                        <img
                            src={formatarUrl(imagens[indiceAtivo]?.url)}
                            alt="Ampliada"
                            className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl"
                        />
                        {}
                        {indiceAtivo < imagens.length - 1 && (
                            <button
                                onClick={proximaImagem}
                                className="absolute right-4 z-10 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-md transition-all shadow-lg"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                    <div className="absolute bottom-6 text-white/80 text-sm font-medium">
                        {indiceAtivo + 1} de {imagens.length}
                    </div>
                </div>
            )}
        </>
    );
}