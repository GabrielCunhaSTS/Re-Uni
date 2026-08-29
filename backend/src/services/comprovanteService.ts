import { Comprovante, Aluguel, Notificacao } from "../models/index.js";

export const criarComprovanteService = async (id_estudante: number, id_aluguel: number, arquivo_url: string, mes_referencia: string) => {
    return await Comprovante.create({
        id_aluguel,
        id_estudante,
        arquivo_url,
        mes_referencia,
        status: "pendente"
    });
};

export const listarComprovantesPorRepublicaService = async (id_republica: number) => {
    const alugueis = await Aluguel.findAll({ where: { id_republica }, attributes: ["id_aluguel"] });
    const idsAlugueis = alugueis.map((a: any) => a.id_aluguel);

    if (idsAlugueis.length === 0) return [];

    return await Comprovante.findAll({
        where: { id_aluguel: idsAlugueis },
        order: [["criado_em", "DESC"]]
    });
};

export const atualizarStatusComprovanteService = async (id_comprovante: number, status: string) => {
    const comprovante: any = await Comprovante.findByPk(id_comprovante);
    if (!comprovante) throw new Error("Comprovante não encontrado.");

    comprovante.status = status;
    await comprovante.save();

    
    const titulo = status === "aprovado" ? "Pagamento Aprovado! 🎉" : "Comprovante Rejeitado";
    const mensagemTexto = status === "aprovado" 
        ? `Seu comprovante de ${comprovante.mes_referencia} foi aprovado pelo anunciante.` 
        : `Seu comprovante de ${comprovante.mes_referencia} foi rejeitado. Verifique os dados enviados.`;

    await Notificacao.create({
        id_usuario: comprovante.id_estudante,
        titulo,
        mensagem: mensagemTexto,
        lido: false
    });

    return comprovante;
};