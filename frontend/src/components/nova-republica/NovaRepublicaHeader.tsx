"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function NovaRepublicaHeader() {
    const router = useRouter();

    return (
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <Button onClick={() => router.push("/dashboard")} variant="ghost" className="rounded-xl p-2">
                    <ArrowLeft className="w-5 h-5 text-slate-700" />
                </Button>
                <h1 className="text-xl font-extrabold text-blue-950">Cadastrar Nova República</h1>
            </div>
        </header>
    );
}