"use client";
interface FormComodidadesProps {
    form: any;
    setForm: (form: any) => void;
}
export function FormComodidades({ form, setForm }: FormComodidadesProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-950 border-b border-slate-100 pb-2">Comodidades & Estrutura</h3>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quartos</label>
                    <input type="number" value={form.quartos} onChange={(e) => setForm({...form, quartos: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Banheiros</label>
                    <input type="number" value={form.banheiros} onChange={(e) => setForm({...form, banheiros: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Moradores</label>
                    <input type="number" value={form.moradores} onChange={(e) => setForm({...form, moradores: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm" />
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={form.mobiliada} onChange={(e) => setForm({...form, mobiliada: e.target.checked})} className="rounded text-blue-900 w-4 h-4" /> Mobiliada
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={form.possui_internet} onChange={(e) => setForm({...form, possui_internet: e.target.checked})} className="rounded text-blue-900 w-4 h-4" /> Internet Wi-Fi
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={form.possui_garagem} onChange={(e) => setForm({...form, possui_garagem: e.target.checked})} className="rounded text-blue-900 w-4 h-4" /> Garagem
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={form.possui_lavanderia} onChange={(e) => setForm({...form, possui_lavanderia: e.target.checked})} className="rounded text-blue-900 w-4 h-4" /> Lavanderia
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={form.possui_area_lazer} onChange={(e) => setForm({...form, possui_area_lazer: e.target.checked})} className="rounded text-blue-900 w-4 h-4" /> Área de Lazer
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={form.aceita_pets} onChange={(e) => setForm({...form, aceita_pets: e.target.checked})} className="rounded text-blue-900 w-4 h-4" /> Aceita Pets
                </label>
            </div>
        </div>
    );
}