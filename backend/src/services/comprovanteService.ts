import { Comprovante, Aluguel, Republica, Notificacao, Usuario} from "../models/index.js";

export const criarComprovanteService = async (id_estudante: number, id_aluguel: number, arquivo_url: string, mes_referencia: string) => {
    const aluguel: any = await Aluguel.findByPk(id_aluguel, {
        include: [{ model: Republica, as: "republica" }]
    });

    if (!aluguel) throw new Error("ALUGUEL_NAO_ENCONTRADO");

    const valorMensalidade = aluguel.valor || aluguel.republica?.valor || aluguel.republica?.valor_mensal || 0;

    return await Comprovante.create({
        id_aluguel,
        id_estudante,
        arquivo_url,
        mes_referencia,
        valor: valorMensalidade,
        status: "pendente"
    });
};

export const listarComprovantesPorRepublicaService = async (id_republica: number) => {
    const alugueis = await Aluguel.findAll({ where: { id_republica }, attributes: ["id_aluguel"] });
    const idsAlugueis = alugueis.map((a: any) => a.id_aluguel);

    if (idsAlugueis.length === 0) return [];

    return await Comprovante.findAll({
        where: { id_aluguel: idsAlugueis },
        include: [
            {
                model: Usuario,
                as: "estudante",
                attributes: ["nome", "email"]
            }
        ],
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
        ? `Seu comprovante referente a ${comprovante.mes_referencia} no valor de R$ ${Number(comprovante.valor).toFixed(2)} foi aprovado.` 
        : `Seu comprovante referente a ${comprovante.mes_referencia} foi rejeitado.`;

    await Notificacao.create({
        id_usuario: comprovante.id_estudante,
        titulo,
        mensagem: mensagemTexto,
        lido: false
    });

    return comprovante;
};