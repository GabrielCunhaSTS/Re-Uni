import { ChatBox } from "@/app/chat/ChatBox";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface AnuncianteProps {
    anunciante: {
        id_usuario: number;
        nome: string;
        email: string;
    };
    vagasDisponiveis: number;
    isPending: boolean;
    onSolicitar: () => void;
    idRepublica: number; // Adicione o ID da república nas props se já não tiver
}

export function RepublicaSidebarAnunciante({ anunciante, vagasDisponiveis, isPending, onSolicitar, idRepublica }: AnuncianteProps) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div>
                <h3 className="text-lg font-bold text-blue-950">Informações do Anunciante</h3>
                <p className="font-semibold text-slate-800 mt-2">{anunciante?.nome}</p>
                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                    <Mail className="w-4 h-4" /> {anunciante?.email}
                </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-3">
                <Button 
                    onClick={onSolicitar}
                    disabled={isPending}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-xl py-6 font-bold shadow-md"
                >
                    {isPending ? "Enviando..." : "Solicitar Vaga / Aluguel"}
                </Button>
                <p className="text-xs text-slate-400 text-center">
                    Ao solicitar, o proprietário receberá um aviso para aprovar sua entrada.
                </p>

                {anunciante?.id_usuario && (
                    <div className="pt-2">
                        <ChatBox 
                            idRepublica={idRepublica}
                            idAnunciante={anunciante.id_usuario}
                            nomeAnunciante={anunciante.nome}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}