"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const MapComponents = dynamic(
    async () => {
        const L = (await import("leaflet"));
        const ReactLeaflet = await import("react-leaflet");
        
        const customIcon = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });

        function MapInvalidator({ center }: { center: [number, number] }) {
            const map = ReactLeaflet.useMap();
            useEffect(() => {
                map.setView(center, 13);
                const timer = setTimeout(() => {
                    map.invalidateSize();
                }, 200);
                return () => clearTimeout(timer);
            }, [map, center]);
            return null;
        }

        return function LeafletMap({ republicas, router, userCenter }: { republicas: any[]; router: any; userCenter: [number, number] }) {
            return (
                <ReactLeaflet.MapContainer 
                    center={userCenter} 
                    zoom={13} 
                    scrollWheelZoom={false} 
                    style={{ width: "100%", height: "100%" }}
                >
                    <MapInvalidator center={userCenter} />
                    <ReactLeaflet.TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {republicas.map((rep: any) => {
                        const lat = rep.localizacao?.latitude;
                        const lng = rep.localizacao?.longitude;
                        if (!lat || !lng) return null;

                        return (
                            <ReactLeaflet.Marker 
                                key={rep.id_republica || rep.id} 
                                position={[Number(lat), Number(lng)]} 
                                icon={customIcon}
                            >
                                <ReactLeaflet.Popup>
                                    <div className="space-y-2 p-1 text-slate-900">
                                        <h4 className="font-bold text-sm text-blue-950">{rep.nome}</h4>
                                        <p className="text-xs text-slate-600">{rep.localizacao?.endereco || "Endereço não informado"}</p>
                                        <Button 
                                            size="sm" 
                                            onClick={() => router.push(`/republicas/${rep.id_republica || rep.id}`)}
                                            className="w-full bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs py-1 h-auto"
                                        >
                                            Ver Detalhes
                                        </Button>
                                    </div>
                                </ReactLeaflet.Popup>
                            </ReactLeaflet.Marker>
                        );
                    })}
                </ReactLeaflet.MapContainer>
            );
        };
    },
    { ssr: false }
);

export function MapaGeral() {
    const router = useRouter();
    const [republicas, setRepublicas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // Coordenadas padrão iniciais (ex: Santos/SP)
    const [center, setCenter] = useState<[number, number]>([-23.9608, -46.3331]);

    useEffect(() => {
        // Tenta obter a localização atual do usuário via navegador
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    setCenter([userLat, userLng]);
                },
                (error) => {
                    console.warn("Usuário negou a permissão de geolocalização ou ocorreu um erro:", error.message);
                },
                { timeout: 10000 }
            );
        }

        async function fetchRepublicas() {
            try {
                const response = await api.get("/republicas");
                const dados = Array.isArray(response.data) ? response.data : response.data.republicas || [];
                setRepublicas(dados);
            } catch (error) {
                console.error("Erro ao carregar repúblicas para o mapa:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchRepublicas();
    }, []);

    return (
        <div className="w-full h-[500px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
            {loading ? (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium">
                    Carregando mapa interativo...
                </div>
            ) : (
                <MapComponents republicas={republicas} router={router} userCenter={center} />
            )}
        </div>
    );
}