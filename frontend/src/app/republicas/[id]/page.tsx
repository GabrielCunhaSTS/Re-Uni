"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { RepublicaHeader } from "@/components/detalhes/RepublicaHeader";
import { RepublicaImagens } from "@/components/detalhes/RepublicaImagens";
import { RepublicaSobreComodidades } from "@/components/detalhes/RepublicaSobreComodidades";
import { RepublicaMapa } from "@/components/detalhes/RepublicaMapa";
import { RepublicaSidebarAnunciante } from "@/components/detalhes/RepublicaSidebarAnunciante";
import { RepublicaComentarios } from "@/components/RepublicaComentarios";
import { SecaoAvaliacoes } from "@/components/republicas/SecaoAvaliacoes";
import { EnviarComprovanteModal } from "@/components/estudante/EnviarComprovanteModal";
import { PainelManutencao } from "@/components/manutencao/PainelManutencao";

export default function DetalhesRepublicaPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("@ReUni:token");
        if (!storedToken) {
            router.push("/login");
        } else {
            setToken(storedToken);
        }
    }, [router]);

    const { data: republica, isLoading, isError } = useQuery({
        queryKey: ["republica-detalhe", id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get(`/republicas/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

const { data: aluguelAtivo } = useQuery({
        queryKey: ["meu-aluguel-republica", id],
        queryFn: async () => {
            if (!token || !id) return null;
            try {
                const response = await api.get("/alugueis/meus");


                const dadosApi = response.data;
                const aluguéis = Array.isArray(dadosApi)
                    ? dadosApi
                    : (dadosApi?.aluguéis || dadosApi?.alugueis || dadosApi?.data || []);

                console.log("Aluguéis do usuário normalizados:", aluguéis);

                const encontrado = aluguéis.find((a: any) => {
                    const idRepAluguel = Number(a.id_republica || a.Republica?.id_republica || a.republica_id);
                    const statusAluguel = a.status?.toLowerCase();


                    const ehDaRepublica = idRepAluguel === Number(id);
                    const estaValido = statusAluguel === "ativo" || statusAluguel === "aprovado" || statusAluguel === "pendente_comprovante";

                    return ehDaRepublica && estaValido;
                });

                return encontrado || null;
            } catch (err) {
                console.error("Erro ao buscar aluguéis:", err);
                return null;
            }
        },
        enabled: !!id && !!token,
    });

    const solicitarAluguelMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post(`/republicas/${id}/alugueis`, {
                data_inicio: new Date().toISOString().split("T")[0]
            });
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.mensagem || "Solicitação de aluguel enviada com sucesso!");
        },
        onError: (error: any) => {
            const mensagem = error.response?.data?.mensagem || "Erro ao solicitar aluguel.";
            toast.error(mensagem);
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-500 animate-pulse text-lg font-medium">Carregando detalhes da república...</p>
            </div>
        );
    }

    if (isError || !republica) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <p className="text-red-500 text-lg font-medium mb-4">República não encontrada ou erro ao carregar.</p>
                <Button onClick={() => router.push("/")} variant="outline" className="rounded-xl">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o início
                </Button>
            </div>
        );
    }

    const idRepublicaStr = Array.isArray(id) ? id[0] : (id || "");

    return (
        <div className="min-h-screen bg-slate-50/60 text-slate-900 pb-20">
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Button onClick={() => router.push("/")} variant="ghost" className="rounded-xl p-2">
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </Button>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
                        <div className="bg-blue-900 text-white p-2 rounded-xl">
                            <Home className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight text-blue-950">ReUni</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 pt-8 space-y-8">
                <RepublicaHeader republica={republica} />
                <RepublicaImagens republica={republica} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <RepublicaSobreComodidades republica={republica} />

                        <RepublicaMapa localizacao={republica?.localizacao} />

                        {}
                        {}
                        {id && aluguelAtivo && Number(aluguelAtivo.id_republica || aluguelAtivo.Republica?.id_republica || aluguelAtivo.republica_id) === Number(id) && (
                            <PainelManutencao
                                idRepublica={Number(id)}
                                isAnunciante={false}
                                temAluguelAtivo={true}
                            />
                        )}

                        {id && <RepublicaComentarios idRepublica={idRepublicaStr} />}
                        {id && <SecaoAvaliacoes idRepublica={idRepublicaStr} />}
                    </div>

                    <div className="space-y-6">
                        <RepublicaSidebarAnunciante
                            anunciante={republica.anunciante}
                            vagasDisponiveis={republica.vagas_disponiveis}
                            isPending={solicitarAluguelMutation.isPending}
                            onSolicitar={() => solicitarAluguelMutation.mutate()}
                            idRepublica={Number(id)}
                        />

                        {aluguelAtivo?.id_aluguel && (
                            <EnviarComprovanteModal idAluguel={aluguelAtivo.id_aluguel} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}