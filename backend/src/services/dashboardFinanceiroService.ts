import { Republica, Aluguel, Usuario } from "../models/index.js";
export const obterDadosFinanceirosService = async (id_anunciante: number) => {
    const republicas = await Republica.findAll({
        where: { id_usuario: id_anunciante, ativo: true },
        include: [
            {
                model: Aluguel,
                as: "alugueis",
                where: { status: "ativo" },
                required: false,
                include: [
                    {
                        model: Usuario,
                        as: "usuario",
                        attributes: ["id_usuario", "nome", "email"]
                    }
                ]
            }
        ]
    });
    let faturamentoTotalMensal = 0;
    const detalhesImoveis: any[] = [];
    republicas.forEach((republica: any) => {
        const valorMensal = Number(republica.valor_mensal) || 0;
        const alugueisAtivos = republica.alugueis || [];
        const receitaImovel = alugueisAtivos.length * valorMensal;
        faturamentoTotalMensal += receitaImovel;
        detalhesImoveis.push({
            id_republica: republica.id_republica || republica.id,
            nome: republica.nome,
            valor_mensal: valorMensal,
            total_inquilinos: alugueisAtivos.length,
            receita_atual: receitaImovel,
            inquilinos: alugueisAtivos.map((a: any) => a.usuario)
        });
    });
    return {
        faturamentoTotalMensal,
        totalImoveisAtivos: republicas.length,
        detalhesImoveis
    };
};