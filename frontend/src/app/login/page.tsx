"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

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
            }
            router.push("/dashboard"); 
        },
        onError: (error: any) => {
            const mensagem = error.response?.data?.mensagem || "Erro ao fazer login.";
            alert(mensagem); 
        },
    });

    function onSubmit(dados: LoginForm) {
        loginMutation.mutate(dados);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md border border-zinc-200">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                        Entrar no ReUni
                    </h2>
                    <p className="mt-2 text-sm text-zinc-600">
                        Acesse sua conta para buscar ou anunciar repúblicas.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="estudante@email.com" {...field} />
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
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? "Autenticando..." : "Entrar"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}