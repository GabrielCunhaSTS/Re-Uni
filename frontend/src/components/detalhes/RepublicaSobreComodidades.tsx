"use client";
import { Bed, Bath, Users, Wifi, Car, WashingMachine } from "lucide-react";
interface RepublicaSobreComodidadesProps {
    republica: any;
}
export function RepublicaSobreComodidades({ republica }: RepublicaSobreComodidadesProps) {
    const dados = republica.dados;
    return (
        <>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-blue-950">Sobre a República</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                    {republica.descricao || "Nenhuma descrição detalhada fornecida pelo anunciante."}
                </p>
            </div>
            {dados && (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold text-blue-950">Comodidades e Estrutura</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <Bed className="w-5 h-5 text-blue-900" />
                            <span className="text-sm font-medium text-slate-700">{dados.quartos} Quartos</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <Bath className="w-5 h-5 text-blue-900" />
                            <span className="text-sm font-medium text-slate-700">{dados.banheiros} Banheiros</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <Users className="w-5 h-5 text-blue-900" />
                            <span className="text-sm font-medium text-slate-700">{dados.moradores} Moradores</span>
                        </div>
                        {dados.possui_internet && (
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <Wifi className="w-5 h-5 text-blue-900" />
                                <span className="text-sm font-medium text-slate-700">Internet Wi-Fi</span>
                            </div>
                        )}
                        {dados.possui_garagem && (
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <Car className="w-5 h-5 text-blue-900" />
                                <span className="text-sm font-medium text-slate-700">Garagem</span>
                            </div>
                        )}
                        {dados.possui_lavanderia && (
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <WashingMachine className="w-5 h-5 text-blue-900" />
                                <span className="text-sm font-medium text-slate-700">Lavanderia</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}