"use client";

import { MapPin } from "lucide-react";

interface RepublicaMapaProps {
    localizacao: any;
}

export function RepublicaMapa({ localizacao }: RepublicaMapaProps) {
    if (!localizacao) return null;

    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-blue-950 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-900" /> Localização no Mapa
            </h3>
            <p className="text-slate-500 text-sm">
                {localizacao.endereco}, {localizacao.numero} - {localizacao.bairro}, {localizacao.cidade}
            </p>
            <div className="w-full h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-inner mt-4">
                <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(`${localizacao.endereco}, ${localizacao.numero} - ${localizacao.bairro}, ${localizacao.cidade}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
            </div>
        </div>
    );
}