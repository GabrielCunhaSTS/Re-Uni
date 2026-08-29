"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Star, MessageSquarePlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
interface SecaoAvaliacoesProps {
    idRepublica: number | string;
}
export function SecaoAvaliacoes({ idRepublica }: SecaoAvaliacoesProps) {
    const queryClient = useQueryClient();
    const [nota, setNota] = useState(5);
    const [comentario, setComentario] = useState("");
    const [hoverEstrela, setHoverEstrela] = useState(0);
    const { data: dadosAvaliacoes, isLoading } = useQuery({
        queryKey: ["avaliacoes-republica", idRepublica],
        queryFn: async () => {
            const response = await api.get(`/republicas/${idRepublica}/avaliacoes`);
            return response.data;
        },
        enabled: !!idRepublica,
    });
    const criarAvaliacaoMutation = useMutation({
        mutationFn: async () => {
            await api.post(`/republicas/${idRepublica}/avaliacoes`, { nota, comentario });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["avaliacoes-republica", idRepublica] });
            setComentario("");
            setNota(5);
            toast.success("Avaliação enviada com sucesso!");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.mensagem || "Erro ao enviar avaliação.");
        }
    });
    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h3 className="text-xl font-bold text-blue-950">Avaliações dos Estudantes</h3>
                    <p className="text-sm text-slate-500">Veja o que os moradores dizem sobre esta república.</p>
                </div>
                <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
                    <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                    <div>
                        <div className="text-lg font-extrabold text-slate-900 leading-none">
                            {dadosAvaliacoes?.media || "0.0"} <span className="text-xs font-normal text-slate-500">/ 5.0</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                            {dadosAvaliacoes?.total || 0} avaliações
                        </span>
                    </div>
                </div>
            </div>
            {}
            <form onSubmit={(e) => { e.preventDefault(); criarAvaliacaoMutation.mutate(); }} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                    <MessageSquarePlus className="w-4 h-4 text-blue-900" /> Deixe sua avaliação
                </h4>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((estrela) => (
                        <button
                            type="button"
                            key={estrela}
                            onMouseEnter={() => setHoverEstrela(estrela)}
                            onMouseLeave={() => setHoverEstrela(0)}
                            onClick={() => setNota(estrela)}
                            className="p-1 focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-6 h-6 ${
                                    (hoverEstrela || nota) >= estrela
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-300"
                                }`}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-slate-600">{nota} de 5 estrelas</span>
                </div>
                <textarea
                    rows={3}
                    placeholder="Conte como foi sua experiência nesta república..."
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                />
                <Button
                    type="submit"
                    disabled={criarAvaliacaoMutation.isPending}
                    className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-semibold px-6"
                >
                    {criarAvaliacaoMutation.isPending ? "Enviando..." : "Publicar Avaliação"}
                </Button>
            </form>
            {}
            <div className="space-y-4">
                {isLoading && <p className="text-slate-400 text-sm animate-pulse">Carregando avaliações...</p>}
                {dadosAvaliacoes?.avaliacoes?.length === 0 && !isLoading && (
                    <p className="text-slate-400 text-sm italic text-center py-6">Ainda não há avaliações para esta república. Seja o primeiro a avaliar!</p>
                )}
                {dadosAvaliacoes?.avaliacoes?.map((av: any) => (
                    <div key={av.id_avaliacao} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-100 text-blue-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-bold text-slate-900">{av.usuario?.nome || "Estudante ReUni"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        className={`w-3.5 h-3.5 ${av.nota >= s ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                                    />
                                ))}
                            </div>
                        </div>
                        {av.comentario && (
                            <p className="text-xs text-slate-600 leading-relaxed pl-10">
                                {av.comentario}
                            </p>
                        )}
                        <span className="text-[10px] text-slate-400 pl-10 block">
                            {new Date(av.criado_em).toLocaleDateString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}