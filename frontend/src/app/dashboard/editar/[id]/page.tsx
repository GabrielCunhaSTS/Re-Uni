"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { FormInformacoesBasicas } from "@/components/nova-republica/FormInformacoesBasicas";
import { FormLocalizacao } from "@/components/nova-republica/FormLocalizacao";
import { FormComodidades } from "@/components/nova-republica/FormComodidades";
import { FormImagens } from "@/components/nova-republica/FormImagens";

export default function EditarRepublicaPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const queryClient = useQueryClient();

    const [imagensExistentes, setImagensExistentes] = useState<{ id_imagem?: number; url: string }[]>([]);
    const [novosArquivos, setNovosArquivos] = useState<File[]>([]);

    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        valor_mensal: "",
        vagas_total: "1",
        vagas_disponiveis: "1",
        id_tipo_republica: "1",
        cep: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        id_estado: "25",
        quartos: "1",
        banheiros: "1",
        moradores: "1",
        mobiliada: false,
        possui_internet: false,
        possui_garagem: false,
        possui_lavanderia: false,
        possui_area_lazer: false,
        aceita_pets: false,
    });

    const { data: republica, isLoading } = useQuery({
        queryKey: ["republica-editar", id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get(`/republicas/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    useEffect(() => {
        if (republica) {
            setForm({
                nome: republica.nome || "",
                descricao: republica.descricao || "",
                valor_mensal: republica.valor_mensal || "",
                vagas_total: republica.vagas_total || "1",
                vagas_disponiveis: republica.vagas_disponiveis || "1",
                id_tipo_republica: republica.id_tipo_republica || "1",
                cep: republica.localizacao?.cep || "",
                endereco: republica.localizacao?.endereco || "",
                numero: republica.localizacao?.numero || "",
                complemento: republica.localizacao?.complemento || "",
                bairro: republica.localizacao?.bairro || "",
                cidade: republica.localizacao?.cidade || "",
                id_estado: republica.localizacao?.id_estado || "25",
                quartos: republica.dados?.quartos || "1",
                banheiros: republica.dados?.banheiros || "1",
                moradores: republica.dados?.moradores || "1",
                mobiliada: !!republica.dados?.mobiliada,
                possui_internet: !!republica.dados?.possui_internet,
                possui_garagem: !!republica.dados?.possui_garagem,
                possui_lavanderia: !!republica.dados?.possui_lavanderia,
                possui_area_lazer: !!republica.dados?.possui_area_lazer,
                aceita_pets: !!republica.dados?.aceita_pets,
            });

            if (republica.imagens && Array.isArray(republica.imagens)) {
                setImagensExistentes(republica.imagens.map((img: any) => ({
                    id_imagem: img.id_imagem || img.id,
                    url: img.url
                })));
            }
        }
    }, [republica]);

    async function handleCepBlur(e: React.FocusEvent<HTMLInputElement>) {
        const cepLimpo = e.target.value.replace(/\D/g, "");
        if (cepLimpo.length !== 8) return;

        try {
            const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = await res.json();

            if (!data.erro) {
                setForm((prev) => ({
                    ...prev,
                    endereco: data.logradouro || prev.endereco,
                    bairro: data.bairro || prev.bairro,
                    cidade: data.localidade || prev.cidade,
                }));
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        }
    }

    async function handleDeletarImagemExistente(id_imagem: number) {
        try {
            await api.delete(`/republicas/${id}/imagens/${id_imagem}`);
            toast.success("Imagem removida com sucesso!");
        } catch (error) {
            toast.error("Erro ao remover imagem do servidor.");
        }
    }

    const atualizarMutation = useMutation({
        mutationFn: async () => {
            let latitude = republica?.localizacao?.latitude || -23.9608;
            let longitude = republica?.localizacao?.longitude || -46.3336;

            try {
                const queryGeo = encodeURIComponent(`${form.endereco}, ${form.numero} - ${form.bairro}, ${form.cidade}, Brasil`);
                const resGeo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${queryGeo}`);
                const dataGeo = await resGeo.json();

                if (dataGeo && dataGeo.length > 0) {
                    latitude = parseFloat(dataGeo[0].lat);
                    longitude = parseFloat(dataGeo[0].lon);
                }
            } catch (err) {
                console.warn("Mantendo coordenadas anteriores.", err);
            }

            const payload = {
                nome: form.nome.trim(),
                descricao: form.descricao?.trim() || "",
                valor_mensal: parseFloat(form.valor_mensal) || 0,
                vagas_total: parseInt(form.vagas_total, 10) || 1,
                vagas_disponiveis: parseInt(form.vagas_disponiveis, 10) || 1,
                id_tipo_republica: parseInt(form.id_tipo_republica, 10) || 1,
                localizacao: {
                    cep: form.cep?.trim() || "",
                    endereco: form.endereco?.trim() || "",
                    numero: form.numero?.trim() || "",
                    complemento: form.complemento?.trim() || "",
                    bairro: form.bairro?.trim() || "",
                    cidade: form.cidade?.trim() || "",
                    id_estado: parseInt(form.id_estado, 10) || 25,
                    latitude: Number(latitude),
                    longitude: Number(longitude)
                },
                dados: {
                    quartos: parseInt(form.quartos, 10) || 1,
                    banheiros: parseInt(form.banheiros, 10) || 1,
                    moradores: parseInt(form.moradores, 10) || 1,
                    mobiliada: Boolean(form.mobiliada),
                    possui_internet: Boolean(form.possui_internet),
                    possui_garagem: Boolean(form.possui_garagem),
                    possui_lavanderia: Boolean(form.possui_lavanderia),
                    possui_area_lazer: Boolean(form.possui_area_lazer),
                    aceita_pets: Boolean(form.aceita_pets),
                },
                // Envia a nova ordem das imagens existentes para o backend atualizar ordens/capa
                imagens_ordem: imagensExistentes.map((img, index) => ({
                    id_imagem: img.id_imagem,
                    ordem: index,
                    principal: index === 0
                }))
            };

            // Atualiza os dados principais e a ordem das imagens existentes
            await api.put(`/republicas/${id}`, payload);

            // Envia novos arquivos adicionados, se houver
            if (novosArquivos.length > 0) {
                const formData = new FormData();
                novosArquivos.forEach((file) => {
                    formData.append("imagens", file);
                });

                await api.post(`/republicas/${id}/imagens`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["minhas-republicas"] });
            queryClient.invalidateQueries({ queryKey: ["republicas-publicas"] });
            queryClient.invalidateQueries({ queryKey: ["estatisticas-dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["republica-detalhe", id] });

            toast.success("República atualizada com sucesso!");
            router.push("/dashboard");
        },
        onError: (err: any) => {
            const mensagemErro = err.response?.data?.mensagem || err.response?.data?.error || "Erro ao atualizar república.";
            toast.error(mensagemErro);
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-500 animate-pulse text-lg font-medium">Carregando dados da república...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/60 pb-20 text-slate-900">
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button onClick={() => router.push("/dashboard")} variant="ghost" className="rounded-xl p-2">
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </Button>
                    <h1 className="text-xl font-extrabold text-blue-950">Editar República</h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 pt-8">
                <form onSubmit={(e) => { e.preventDefault(); atualizarMutation.mutate(); }} className="space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <FormInformacoesBasicas form={form} setForm={setForm} />
                    <FormLocalizacao form={form} setForm={setForm} onCepBlur={handleCepBlur} />
                    <FormComodidades form={form} setForm={setForm} />
                    
                    <FormImagens 
                        imagensExistentes={imagensExistentes}
                        setImagensExistentes={setImagensExistentes}
                        novosArquivos={novosArquivos}
                        setNovosArquivos={setNovosArquivos}
                        onDeletarExistente={handleDeletarImagemExistente}
                    />

                    <Button type="submit" disabled={atualizarMutation.isPending} className="w-full bg-blue-900 hover:bg-blue-800 text-white py-6 rounded-2xl font-bold shadow-md">
                        {atualizarMutation.isPending ? "Salvando alterações..." : "Salvar Alterações"}
                    </Button>
                </form>
            </main>
        </div>
    );
}