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

const loginSchema = z.object({
    email: z.string().email({ message: "Digite um e-mail válido." }),
    senha: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            senha: "",
        },
    });

    const loginMutation = useMutation({
        mutationFn: async (dados: LoginForm) => {
            const response = await api.post("/auth/login", dados);
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.setItem("@ReUni:token", data.token);
            if (data.usuario) {
                localStorage.setItem("@ReUni:user", JSON.stringify(data.usuario));
                if (data.usuario.tipo === "anunciante") {
                    router.push("/dashboard");
                } else {
                    router.push("/");
                }
            } else {
                router.push("/");
            }
        },
        onError: (error: any) => {
            const mensagem = error.response?.data?.mensagem || "Erro ao fazer login.";
            toast.error(mensagem);
        },
    });

    function onSubmit(dados: LoginForm) {
        loginMutation.mutate(dados);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50/60 px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-blue-950">
                        Entrar no ReUni
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Acesse sua conta para buscar ou anunciar repúblicas.
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-700">E-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="estudante@email.com" {...field} className="rounded-xl border-slate-200 bg-slate-50" />
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
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-xs font-bold text-slate-700">Senha</FormLabel>
                                        <Link href="/esqueci-senha" className="text-xs font-semibold text-blue-600 hover:underline">
                                            Esqueceu sua senha?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} className="rounded-xl border-slate-200 bg-slate-50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-xl py-6 font-bold shadow-md"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? "Autenticando..." : "Entrar"}
                        </Button>
                    </form>
                </Form>
                <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100 space-y-2">
                    <p>
                        Caso não tenha cadastro,{" "}
                        <Link href="/register" className="font-semibold text-blue-900 hover:underline">
                            faça seu cadastro
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}