import { Manutencao } from '../models/Manutencao.js';
import { Notificacao, Republica } from '../models/index.js';

interface CriarManutencaoDTO {
    titulo: string;
    descricao: string;
    tipo?: 'reparo' | 'aviso' | 'urgente';
}

export const manutencaoService = {
    async listarPorRepublica(idRepublica: number | string) {
        return await Manutencao.findAll({
            where: { id_republica: idRepublica },
            order: [['data_criacao', 'DESC']]
        });
    },

    async criar(idRepublica: number | string, idUsuario: number | string, dados: CriarManutencaoDTO) {
        const novaManutencao = await Manutencao.create({
            id_republica: idRepublica,
            id_usuario: idUsuario,
            titulo: dados.titulo,
            descricao: dados.descricao,
            tipo: dados.tipo || 'reparo',
            status: 'pendente'
        });


        try {
            const republica = await Republica.findByPk(idRepublica);
            if (republica && (republica as any).id_usuario) {
                await Notificacao.create({
                    id_usuario: (republica as any).id_usuario,
                    mensagem: `Novo chamado de manutenção aberto: "${dados.titulo}"`
                });
            }
        } catch (notifError) {
            console.error("Erro ao gerar notificação para o anunciante:", notifError);
        }

        return novaManutencao;
    },

    async atualizarStatus(idManutencao: number | string, status: 'pendente' | 'em_andamento' | 'concluido') {
        const manutencao: any = await Manutencao.findByPk(idManutencao);
        if (!manutencao) {
            throw new Error("Chamado não encontrado.");
        }

        manutencao.status = status;
        await manutencao.save();

        try {
            const statusTexto = status === 'em_andamento' ? 'em andamento' : status === 'concluido' ? 'concluído' : 'pendente';
            await Notificacao.create({
                id_usuario: manutencao.id_usuario,
                mensagem: `O seu chamado "${manutencao.titulo}" foi atualizado para: ${statusTexto}.`
            });
        } catch (notifError) {
            console.error("Erro ao gerar notificação para o estudante:", notifError);
        }

        return manutencao;
    },

    async remover(idManutencao: number | string) {
        const manutencao: any = await Manutencao.findByPk(idManutencao);
        if (!manutencao) {
            throw new Error("Chamado não encontrado.");
        }
        await manutencao.destroy();
        return true;
    }
};