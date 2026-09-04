"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { RepublicaHeader } from "@/components/detalhes/RepublicaHeader";
import { RepublicaImagens } from "@/components/detalhes/RepublicaImagens";
import { RepublicaSobreComodidades } from "@/components/detalhes/RepublicaSobreComodidades";
import { RepublicaMapa } from "@/components/detalhes/RepublicaMapa";
import { RepublicaSidebarAnunciante } from "@/components/detalhes/RepublicaSidebarAnunciante";
import { RepublicaComentarios } from "@/components/RepublicaComentarios";
import { SecaoAvaliacoes } from "@/components/republicas/SecaoAvaliacoes";
import { PainelManutencao } from "@/components/manutencao/PainelManutencao";
import { EnviarMatriculaModal } from "@/components/estudante/EnviarMatriculaModal";
import { ModalOpcoesPagamento } from "@/components/estudante/ModalPagamentoPix";
import { ModalPagamentoDespesa } from "@/components/estudante/ModalPagamentoDespesa";

export default function DetalhesRepublicaPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const [token, setToken] = useState<string | null>(null);

    const [isPixModalOpen, setIsPixModalOpen] = useState(false);
    const [despesaPagamento, setDespesaPagamento] = useState<any>(null);

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

    const { data: meuAluguel } = useQuery({
        queryKey: ["meu-aluguel-republica", id],
        queryFn: async () => {
            if (!token || !id) return null;
            try {
                const response = await api.get("/alugueis/meus");
                const dadosApi = response.data;
                const alugueis = Array.isArray(dadosApi) ? dadosApi : (dadosApi?.aluguéis || dadosApi?.data || []);

                const encontrado = alugueis.find((a: any) => {
                    const idRepAluguel = Number(a.id_republica || a.republica?.id_republica);
                    return idRepAluguel === Number(id);
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

    const idRepublicaStr = Array.isArray(id) ? id[0] : (id || "");
    const statusAluguel = meuAluguel?.status?.toLowerCase();
    const temAluguelAtivo = ["ativo", "aprovado"].includes(statusAluguel);
    const isPendente = statusAluguel === "pendente";
    const isPendenteComprovante = statusAluguel === "pendente_comprovante";
    const podeVerPainelManutencao = temAluguelAtivo || isPendenteComprovante;

    const { data: despesas = [] } = useQuery({
        queryKey: ["despesas-estudante", id],
        queryFn: async () => {
            const response = await api.get(`/despesas?id_republica=${id}`);
            return response.data;
        },
        enabled: !!id && temAluguelAtivo,
    });

    const minhasDespesasRateio = despesas.flatMap((d: any) =>
        (d.divisoes || [])
        .filter((div: any) => div.id_usuario === meuAluguel?.id_usuario)
        .map((div: any) => ({ ...div, despesa_pai: d }))
    );

    const dataUltimoPagamento = meuAluguel?.data_ultimo_pagamento;
    let estaPago = false;
    let dataProximoVencimento = "";

    if (dataUltimoPagamento) {
        const dataPagamento = new Date(dataUltimoPagamento);
        const agora = new Date();
        const diffEmDias = (agora.getTime() - dataPagamento.getTime()) / (1000 * 60 * 60 * 24);

        if (diffEmDias <= 30) {
            estaPago = true;
            const proximoData = new Date(dataPagamento);
            proximoData.setDate(proximoData.getDate() + 30);
            dataProximoVencimento = proximoData.toLocaleDateString("pt-BR");
        }
    }

    const mesReferenciaAtual = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-500 animate-pulse text-lg font-medium">Carregando detalhes...</p>
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

    return (
        <div className="min-h-screen bg-slate-50/60 text-slate-900 pb-20 relative">
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

                        {podeVerPainelManutencao && (
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
                            onSolicitar={() => {
                                if (isPendente) {
                                    toast.info("Sua solicitação está pendente! Aguarde o anunciante aprovar.");
                                    return;
                                }
                                if (podeVerPainelManutencao) {
                                    toast.info("Você já é morador desta república!");
                                    return;
                                }
                                solicitarAluguelMutation.mutate();
                            }}
                            idRepublica={Number(id)}
                        />

                        {(temAluguelAtivo || isPendenteComprovante) && meuAluguel?.id_aluguel && (
                            estaPago ? (
                                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-emerald-800">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <h3 className="font-bold text-base">Mensalidade em dia!</h3>
                                    </div>
                                    <p className="text-sm text-emerald-700/80 leading-relaxed">
                                        Tudo certo com o seu aluguel deste ciclo. O seu próximo vencimento será a partir de <strong className="text-emerald-800">{dataProximoVencimento}</strong>.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                                    <h4 className="font-bold text-blue-950 text-sm">Fatura / Aluguel</h4>
                                    <p className="text-xs text-slate-500">Realize o pagamento da sua mensalidade via PIX ou em dinheiro.</p>
                                    <Button
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                                        onClick={() => setIsPixModalOpen(true)}
                                    >
                                        Realizar Pagamento
                                    </Button>
                                </div>
                            )
                        )}

                        {minhasDespesasRateio.length > 0 && (
                            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                                <h4 className="font-bold text-blue-950 text-sm border-b border-slate-100 pb-2">Rateio de Contas</h4>

                                {minhasDespesasRateio.map((div: any) => (
                                    <div key={div.id_despesa_inquilino} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded-md uppercase">{div.despesa_pai.categoria}</span>
                                                <p className="text-sm font-bold text-slate-800 mt-1">{div.despesa_pai.titulo}</p>
                                            </div>
                                            <p className="text-sm font-extrabold text-blue-950">R$ {Number(div.valor_parte).toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                                            <p className="text-[10px] text-slate-500">Vence: {div.despesa_pai.data_vencimento}</p>
                                            {div.status_pagamento === "pago" ? (
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Pago
                                                </span>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    className="h-7 text-xs px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-bold"
                                                    onClick={() => setDespesaPagamento(div)}
                                                >
                                                    Pagar
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {temAluguelAtivo && meuAluguel?.status_matricula !== "aprovado" && meuAluguel?.id_aluguel && (
                            <EnviarMatriculaModal idAluguel={meuAluguel.id_aluguel} />
                        )}

                        {temAluguelAtivo && meuAluguel?.status_matricula === "aprovado" && meuAluguel?.id_aluguel && (
                            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1">
                                <p className="text-xs font-bold text-emerald-800">Matrícula Validada ✅</p>
                                <p className="text-[11px] text-emerald-700/80">
                                    Seu comprovante de matrícula está aprovado. Será necessário revalidar o vínculo estudantil a cada 6 meses.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {isPixModalOpen && meuAluguel && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-sm">
                        <button
                            onClick={() => setIsPixModalOpen(false)}
                            className="absolute -top-12 right-0 text-white hover:text-slate-200 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <ModalOpcoesPagamento
                            idAluguel={meuAluguel.id_aluguel}
                            valor={Number(republica.valor_mensal || republica.valor || 0)}
                            mesReferencia={mesReferenciaAtual.charAt(0).toUpperCase() + mesReferenciaAtual.slice(1)}
                        />
                    </div>
                </div>
            )}

            {despesaPagamento && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-sm">
                        <button
                            onClick={() => setDespesaPagamento(null)}
                            className="absolute -top-12 right-0 text-white hover:text-slate-200 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <ModalPagamentoDespesa
                            idDespesaInquilino={despesaPagamento.id_despesa_inquilino}
                            valor={Number(despesaPagamento.valor_parte)}
                            titulo={despesaPagamento.despesa_pai.titulo}
                            onClose={() => setDespesaPagamento(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}