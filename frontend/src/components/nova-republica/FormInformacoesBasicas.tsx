"use client";

interface FormInformacoesBasicasProps {
    form: any;
    setForm: (form: any) => void;
}

export function FormInformacoesBasicas({ form, setForm }: FormInformacoesBasicasProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-950 border-b border-slate-100 pb-2">Informações Principais</h3>
            
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome da República</label>
                    <input 
                        type="text" 
                        required
                        placeholder="Ex: República Universitária Boa Vista"
                        value={form.nome}
                        onChange={(e) => setForm({...form, nome: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrição</label>
                    <textarea 
                        rows={3}
                        value={form.descricao}
                        onChange={(e) => setForm({...form, descricao: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Valor Mensal (R$)</label>
                    <input 
                        type="number" 
                        step="0.01"
                        required
                        placeholder="850.00"
                        value={form.valor_mensal}
                        onChange={(e) => setForm({...form, valor_mensal: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vagas Totais</label>
                    <input 
                        type="number" 
                        required
                        value={form.vagas_total}
                        onChange={(e) => setForm({...form, vagas_total: e.target.value, vagas_disponiveis: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de República</label>
                    <select 
                        value={form.id_tipo_republica}
                        onChange={(e) => setForm({...form, id_tipo_republica: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-900"
                    >
                        <option value="1">Masculina</option>
                        <option value="2">Feminina</option>
                        <option value="3">Mista</option>
                        <option value="4">Apartamento Compartilhado</option>
                    </select>
                </div>
            </div>
        </div>
    );
}