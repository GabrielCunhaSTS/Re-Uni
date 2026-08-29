"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Upload, Trash2, GripHorizontal, Star } from "lucide-react";
interface FormImagensProps {
    imagensExistentes: { id_imagem?: number; url: string }[];
    setImagensExistentes: React.Dispatch<React.SetStateAction<{ id_imagem?: number; url: string }[]>>;
    novosArquivos: File[];
    setNovosArquivos: React.Dispatch<React.SetStateAction<File[]>>;
    onDeletarExistente?: (id_imagem: number) => void;
}
export function FormImagens({
    imagensExistentes,
    setImagensExistentes,
    novosArquivos,
    setNovosArquivos,
    onDeletarExistente
}: FormImagensProps) {
    const [draggedIndex, setDraggedIndex] = useState<{ tipo: 'existente' | 'novo', index: number } | null>(null);
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const arquivosArray = Array.from(files);
        setNovosArquivos((prev) => [...prev, ...arquivosArray]);
        e.target.value = "";
    }
    function removerExistente(index: number, id_imagem?: number) {
        if (id_imagem && onDeletarExistente) {
            onDeletarExistente(id_imagem);
        }
        setImagensExistentes((prev) => prev.filter((_, i) => i !== index));
    }
    function removerNovo(index: number) {
        setNovosArquivos((prev) => prev.filter((_, i) => i !== index));
    }
    function handleDragStart(tipo: 'existente' | 'novo', index: number) {
        setDraggedIndex({ tipo, index });
    }
    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
    }
    function handleDrop(tipoAlvo: 'existente' | 'novo', indexAlvo: number) {
        if (!draggedIndex) return;
        if (draggedIndex.tipo !== tipoAlvo) return;
        if (tipoAlvo === 'existente') {
            const items = [...imagensExistentes];
            const [movedItem] = items.splice(draggedIndex.index, 1);
            items.splice(indexAlvo, 0, movedItem);
            setImagensExistentes(items);
        } else {
            const items = [...novosArquivos];
            const [movedItem] = items.splice(draggedIndex.index, 1);
            items.splice(indexAlvo, 0, movedItem);
            setNovosArquivos(items);
        }
        setDraggedIndex(null);
    }
    const formatarUrl = (url?: string) => {
        if (!url) return "";
        return url.startsWith("http") ? url : `http://localhost:3001${url}`;
    };
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-950 border-b border-slate-100 pb-2 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-900" /> Imagens da República
            </h3>
            <div>
                <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-sm transition-all">
                    <Upload className="w-4 h-4" /> Selecionar Imagens do Computador
                    <input
                        type="file"
                        multiple
                        accept="image}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                {}
                {imagensExistentes.map((img, index) => (
                    <div
                        key={`existente-${index}`}
                        draggable
                        onDragStart={() => handleDragStart('existente', index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop('existente', index)}
                        className="relative group h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm cursor-grab active:cursor-grabbing"
                    >
                        <img src={formatarUrl(img.url)} alt="Foto" className="w-full h-full object-cover" />
                        {}
                        {index === 0 && (
                            <span className="absolute top-2 left-2 bg-blue-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                                <Star className="w-3 h-3 fill-current" /> Capa
                            </span>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs flex items-center gap-1">
                                <GripHorizontal className="w-4 h-4" /> Mover
                            </span>
                            <button
                                type="button"
                                onClick={() => removerExistente(index, img.id_imagem)}
                                className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-xl shadow-md transition-colors"
                                title="Remover imagem"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
                {}
                {novosArquivos.map((file, index) => {
                    const previewUrl = URL.createObjectURL(file);
                    const isPrimeiraCapa = imagensExistentes.length === 0 && index === 0;
                    return (
                        <div
                            key={`novo-${index}`}
                            draggable
                            onDragStart={() => handleDragStart('novo', index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop('novo', index)}
                            className="relative group h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm cursor-grab active:cursor-grabbing"
                        >
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            {isPrimeiraCapa && (
                                <span className="absolute top-2 left-2 bg-blue-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                                    <Star className="w-3 h-3 fill-current" /> Capa
                                </span>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs flex items-center gap-1">
                                    <GripHorizontal className="w-4 h-4" /> Mover
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removerNovo(index)}
                                    className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-xl shadow-md transition-colors"
                                    title="Remover nova imagem"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {imagensExistentes.length === 0 && novosArquivos.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-2">Nenhuma imagem adicionada ainda.</p>
            )}
        </div>
    );
}