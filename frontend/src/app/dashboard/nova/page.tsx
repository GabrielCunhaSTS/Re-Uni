"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { NovaRepublicaHeader } from "@/components/nova-republica/NovaRepublicaHeader";
import { FormInformacoesBasicas } from "@/components/nova-republica/FormInformacoesBasicas";
import { FormLocalizacao } from "@/components/nova-republica/FormLocalizacao";
import { FormComodidades } from "@/components/nova-republica/FormComodidades";
import { FormImagens } from "@/components/nova-republica/FormImagens";
export default function NovaRepublicaPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [imagensExistentes, setImagensExistentes] = useState<{ url: string }[]>([]);
    const [novosArquivos, setNovosArquivos] = useState<File[]>([]);
    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        valor_mensal: "",
        vagas_total: "4",
        vagas_disponiveis: "4",
        id_tipo_republica: "3",
        cep: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        id_estado: "25",
        quartos: "3",
        banheiros: "2",
        moradores: "2",
        mobiliada: true,
        possui_internet: true,
        possui_garagem: false,
        possui_lavanderia: true,
        possui_area_lazer: true,
        aceita_pets: false,
    });
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
    const criarMutation = useMutation({
        mutationFn: async () => {
            let latitude = -23.9608;
            let longitude = -46.3336;
            try {
                const queryGeo = encodeURIComponent(`${form.endereco},${form.numero} - ${form.bairro},${form.cidade}, Brasil`);
                const resGeo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${queryGeo}`);
                const dataGeo = await resGeo.json();
                if (dataGeo && dataGeo.length > 0) {
                    latitude = parseFloat(dataGeo[0].lat);
                    longitude = parseFloat(dataGeo[0].lon);
                }
            } catch (err) {
                console.warn("Mantendo coordenadas padrão.", err);
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
                }
            };
            const response = await api.post("/republicas", payload);
            const dadosResposta = response.data.republica || response.data;
            const idRepublica = dadosResposta.id_republica || dadosResposta.id;
            if (novosArquivos.length > 0 && idRepublica) {
                const formData = new FormData();
                novosArquivos.forEach((file) => {
                    formData.append("imagens", file);
                });
                await api.post(`/republicas/${idRepublica}/imagens`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
            return dadosResposta;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["minhas-republicas"] });
            queryClient.invalidateQueries({ queryKey: ["republicas-publicas"] });
            queryClient.invalidateQueries({ queryKey: ["estatisticas-dashboard"] });
            toast.success("República cadastrada com sucesso!");
            router.push("/dashboard");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.mensagem || "Erro ao cadastrar república.");
        }
    });
    return (
        <div className="min-h-screen bg-slate-50/60 pb-20 text-slate-900">
            <NovaRepublicaHeader />
            <main className="max-w-3xl mx-auto px-6 pt-8">
                <form onSubmit={(e) => { e.preventDefault(); criarMutation.mutate(); }} className="space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <FormInformacoesBasicas form={form} setForm={setForm} />
                    <FormLocalizacao form={form} setForm={setForm} onCepBlur={handleCepBlur} />
                    <FormComodidades form={form} setForm={setForm} />
                    <FormImagens
                        imagensExistentes={imagensExistentes}
                        setImagensExistentes={setImagensExistentes}
                        novosArquivos={novosArquivos}
                        setNovosArquivos={setNovosArquivos}
                    />
                    <Button type="submit" disabled={criarMutation.isPending} className="w-full bg-blue-900 hover:bg-blue-800 text-white py-6 rounded-2xl font-bold shadow-md">
                        {criarMutation.isPending ? "Cadastrando e enviando fotos..." : "Publicar República"}
                    </Button>
                </form>
            </main>
        </div>
    );
}