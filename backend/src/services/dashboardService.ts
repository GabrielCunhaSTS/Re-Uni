import { Op } from "sequelize";
import { Republica, Aluguel } from "../models/index.js";

export const obterEstatisticasAnuncianteService = async (id_usuario_dono: number) => {
    const republicas = await Republica.findAll({ where: { id_usuario: id_usuario_dono, ativo: true } });
    
    const idsRepublicas = republicas.map((r: any) => r.id_republica);
    
    if (idsRepublicas.length === 0) {
        return { total_republicas: 0, total_vagas: 0, vagas_disponiveis: 0, inquilinos_ativos: 0, receita_mensal: 0 };
    }

    const alugueisAtivos = await Aluguel.findAll({
        where: { id_republica: { [Op.in]: idsRepublicas }, status: "ativo" },
        include: [{ model: Republica, as: "republica" }]
    });

    let total_vagas = 0;
    let vagas_disponiveis = 0;
    let receita_mensal = 0;

    republicas.forEach((r: any) => {
        total_vagas += r.vagas_total;
        vagas_disponiveis += r.vagas_disponiveis;
    });

    alugueisAtivos.forEach((a: any) => {
        receita_mensal += Number(a.republica.valor_mensal);
    });

    return {
        total_republicas: republicas.length,
        total_vagas,
        vagas_disponiveis,
        inquilinos_ativos: alugueisAtivos.length,
        receita_mensal
    };
};