"use client";
interface FormLocalizacaoProps {
    form: any;
    setForm: (form: any) => void;
    onCepBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}
export function FormLocalizacao({ form, setForm, onCepBlur }: FormLocalizacaoProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-950 border-b border-slate-100 pb-2">Localização (Busca Automática via CEP)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CEP</label>
                    <input
                        type="text"
                        placeholder="11013-000"
                        maxLength={9}
                        value={form.cep}
                        onBlur={onCepBlur}
                        onChange={(e) => setForm({...form, cep: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Endereço / Rua</label>
                    <input
                        type="text"
                        required
                        placeholder="Rua do Comércio"
                        value={form.endereco}
                        onChange={(e) => setForm({...form, endereco: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Número</label>
                    <input
                        type="text"
                        required
                        placeholder="45"
                        value={form.numero}
                        onChange={(e) => setForm({...form, numero: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bairro</label>
                    <input
                        type="text"
                        required
                        placeholder="Centro"
                        value={form.bairro}
                        onChange={(e) => setForm({...form, bairro: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cidade</label>
                    <input
                        type="text"
                        required
                        placeholder="Santos"
                        value={form.cidade}
                        onChange={(e) => setForm({...form, cidade: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    />
                </div>
            </div>
        </div>
    );
}