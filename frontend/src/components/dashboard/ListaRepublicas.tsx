"use client";

import { Building2, Plus, Edit, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListaRepublicasProps {
    republicas: any[];
    loading: boolean;
    onNovaRepublica: () => void;
    onEditar: (id: number) => void;
    onExcluir: (republica: any) => void;
}

export function ListaRepublicas({ republicas, loading, onNovaRepublica, onEditar, onExcluir }: ListaRepublicasProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-blue-950">Imóveis Cadastrados</h2>
                    <p className="text-slate-500 text-sm">Gerencie suas moradias e vagas disponíveis.</p>
                </div>
                <Button onClick={onNovaRepublica} className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-sm">
                    <Plus className="w-4 h-4 mr-2" /> Nova República
                </Button>
            </div>

            {loading && <p className="text-slate-400 animate-pulse">Carregando seus imóveis...</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {republicas?.length === 0 && !loading && (
                    <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                        <p className="text-slate-500">Você ainda não cadastrou nenhuma república.</p>
                        <Button onClick={onNovaRepublica} className="bg-blue-900 text-white">Cadastrar Agora</Button>
                    </div>
                )}

                {republicas?.map((republica: any) => {
                    return (
                        <div key={republica.id_republica} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group relative">
                            <div className="h-40 bg-slate-100 overflow-hidden relative">
                                {(() => {
                                    const listaImgs = republica.imagens || republica.Imagens || republica.fotos || republica.Fotos || [];
                                    const imgObj = listaImgs[0];
                                    const primeiraImagem = typeof imgObj === 'string' ? imgObj : (imgObj?.url || imgObj?.Imagem?.url);

                                    return primeiraImagem ? (
                                        <img 
                                            src={
                                                primeiraImagem.startsWith("http") 
                                                    ? primeiraImagem 
                                                    : `http://localhost:3001${primeiraImagem}`
                                            } 
                                            alt={republica.nome} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium text-xs">
                                            Sem imagem
                                        </div>
                                    );
                                })()}

                                {/* SELO DE FAVORITOS NO CANTO SUPERIOR DIREITO */}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-slate-100">
                                    <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                                    <span className="text-xs font-bold text-slate-800">
                                        {republica.totalFavoritos || 0}
                                    </span>
                                </div>
                            </div>
                        
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <h3 className="text-base font-bold text-blue-950 mb-1">{republica.nome}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2">
                                        {republica.descricao || "Sem descrição disponível."}
                                    </p>
                                </div>
                                
                                <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Vagas disponíveis:</span>
                                        <span className="font-bold text-slate-800">{republica.vagas_disponiveis} / {republica.vagas_total}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Valor mensal:</span>
                                        <span className="font-bold text-emerald-600">R$ {Number(republica.valor_mensal).toFixed(2)}</span>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        className="flex-1 rounded-xl text-xs h-9 border-slate-200" 
                                        size="sm"
                                        onClick={() => onEditar(republica.id_republica)}
                                    >
                                        <Edit className="w-3.5 h-3.5 mr-1" /> Editar
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="text-red-600 hover:bg-red-50 rounded-xl h-9 px-3 border-slate-200" 
                                        size="sm"
                                        onClick={() => onExcluir(republica)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}