"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const registerSchema = z.object({
    nome: z.string().min(2, { message: "O nome deve ter no mínimo 2 caracteres." }),
    email: z.string().email({ message: "Digite um e-mail válido." }),
    senha: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
    tipo: z.enum(["estudante", "anunciante"], { message: "Selecione o tipo de conta." }),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const form = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            nome: "",
            email: "",
            senha: "",
            tipo: "estudante",
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (dados: RegisterForm) => {
            const response = await api.post("/auth/register", dados);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Conta criada com sucesso! Faça login para continuar.");
            router.push("/login");
        },
        onError: (error: any) => {
            const mensagem = error.response?.data?.mensagem || "Erro ao criar conta. Tente novamente.";
            toast.error(mensagem);
        },
    });

    function onSubmit(dados: RegisterForm) {
        registerMutation.mutate(dados);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50/60 px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-blue-950">
                        Crie sua conta no ReUni
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Cadastre-se para encontrar moradias ou anunciar repúblicas.
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-700">Nome Completo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Seu nome" {...field} className="rounded-xl border-slate-200 bg-slate-50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-700">E-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="seuemail@exemplo.com" {...field} className="rounded-xl border-slate-200 bg-slate-50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="senha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-700">Senha</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Mínimo de 6 caracteres" {...field} className="rounded-xl border-slate-200 bg-slate-50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tipo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-700">Tipo de Conta</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-900"
                                        >
                                            <option value="estudante">Estudante (Busco moradia)</option>
                                            <option value="anunciante">Anunciante (Quero anunciar repúblicas)</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-xl py-6 font-bold shadow-md"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? "Criando conta..." : "Cadastrar"}
                        </Button>
                    </form>
                </Form>
                <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100">
                    Já possui uma conta?{" "}
                    <Link href="/login" className="font-semibold text-blue-900 hover:underline">
                        Faça login
                    </Link>
                </div>
            </div>
        </div>
    );
}