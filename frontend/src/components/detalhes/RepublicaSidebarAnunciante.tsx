import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { EnviarComprovanteModal } from "@/components/estudante/EnviarComprovanteModal";
import { ChatBox } from "@/app/chat/ChatBox";

interface RepublicaSidebarAnuncianteProps {
    anunciante: {
        id_usuario: number;
        nome: string;
        email: string;
    };
    vagasDisponiveis: number;
    isPending: boolean;
    onSolicitar: () => void;
    idRepublica: number;
    aluguelAtivo?: { id_aluguel: number } | null;
}

export function RepublicaSidebarAnunciante({
    anunciante,
    vagasDisponiveis,
    isPending,
    onSolicitar,
    idRepublica,
    aluguelAtivo
}: RepublicaSidebarAnuncianteProps) {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-extrabold text-blue-950">Informações do Anunciante</h3>
                <div className="space-y-1">
                    <p className="font-bold text-slate-800">{anunciante?.nome || "Anunciante"}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> {anunciante?.email || "Não informado"}
                    </p>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-3">
                    <Button
                        onClick={onSolicitar}
                        disabled={isPending}
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold py-3 h-auto"
                    >
                        {isPending ? "Enviando solicitação..." : "Solicitar Vaga / Aluguel"}
                    </Button>
                    <p className="text-[11px] text-center text-slate-400">
                        Ao solicitar, o proprietário receberá um aviso para aprovar sua entrada.
                    </p>
                </div>

                {anunciante?.id_usuario && (
                    <ChatBox
                        idRepublica={idRepublica}
                        idAnunciante={anunciante.id_usuario}
                        nomeAnunciante={anunciante.nome}
                    />
                )}
            </div>
        </div>
    );
}