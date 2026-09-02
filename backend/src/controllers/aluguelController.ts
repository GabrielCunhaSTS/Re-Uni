import type { Request, Response } from "express";
import {
    solicitarAluguelService,
    listarAlugueisDoUsuarioService,
    atualizarStatusAluguelService,
    listarAlugueisRecebidosService,
    enviarComprovanteMatriculaService,
    avaliarComprovanteMatriculaService
} from "../services/aluguelService.js";
import { Aluguel, Usuario, Republica, LocalizacaoRepublica } from "../models/index.js";
import PDFDocument from "pdfkit";
import { Op } from "sequelize";

export const solicitarAluguel = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        const id_republica = Number(req.params.id_republica);
        const { data_inicio } = req.body;

        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }
        if (!Number.isInteger(id_republica)) {
            res.status(400).json({ mensagem: "ID da república inválido." });
            return;
        }

        const aluguelCriado = await solicitarAluguelService(id_usuario, id_republica, data_inicio);
        res.status(201).json({
            mensagem: "Solicitação de aluguel enviada com sucesso!",
            aluguel: aluguelCriado
        });
    } catch (error: any) {
        if (error.message === "REPUBLICA_LOTADA") {
            res.status(409).json({ mensagem: "Não há mais vagas disponíveis nesta república no momento." });
            return;
        }
        if (error.message === "ALUGUEL_JA_SOLICITADO") {
            res.status(409).json({ mensagem: "Você já possui uma solicitação pendente ou um aluguel ativo para esta república." });
            return;
        }
        if (error.message === "REPUBLICA_NAO_ENCONTRADA") {
            res.status(404).json({ mensagem: "República não encontrada." });
            return;
        }
        console.error("Erro ao solicitar aluguel:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const listarMeusAlugueis = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }
        const alugueis = await listarAlugueisDoUsuarioService(id_usuario);
        res.status(200).json(alugueis);
    } catch (error) {
        console.error("Erro ao listar aluguéis:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const atualizarStatusAluguel = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        const id_aluguel = Number(req.params.id_aluguel);
        const { status } = req.body;

        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }
        if (!Number.isInteger(id_aluguel)) {
            res.status(400).json({ mensagem: "ID do aluguel inválido." });
            return;
        }
        if (!status) {
            res.status(400).json({ mensagem: "O novo status é obrigatório." });
            return;
        }

        const aluguelAtualizado = await atualizarStatusAluguelService(id_aluguel, status, id_usuario);
        res.status(200).json({
            mensagem: "Status do aluguel atualizado com sucesso!",
            aluguel: aluguelAtualizado
        });
    } catch (error: any) {
        if (error.message === "ALUGUEL_NAO_ENCONTRADO") {
            res.status(404).json({ mensagem: "Aluguel não encontrado." });
            return;
        }
        if (error.message === "NAO_AUTORIZADO") {
            res.status(403).json({ mensagem: "Você não tem permissão para alterar este aluguel." });
            return;
        }
        console.error("Erro ao atualizar status do aluguel:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const listarAlugueisRecebidos = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        if (!id_usuario) {
            res.status(401).json({ mensagem: "Usuário não autenticado." });
            return;
        }
        const alugueisRecebidos = await listarAlugueisRecebidosService(id_usuario);
        res.status(200).json(alugueisRecebidos);
    } catch (error) {
        console.error("Erro ao listar aluguéis recebidos:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const enviarComprovanteMatricula = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_usuario = req.user?.id_usuario;
        const id_aluguel = Number(req.params.id_aluguel);
        const url_pdf = req.file ? `http://localhost:3001/uploads/${req.file.filename}` : req.body.url_pdf;

        if (!id_usuario) {
            res.status(401).json({ mensagem: "Não autenticado." });
            return;
        }
        if (!url_pdf) {
            res.status(400).json({ mensagem: "O arquivo PDF é obrigatório." });
            return;
        }

        const aluguelAtualizado = await enviarComprovanteMatriculaService(id_aluguel, id_usuario, url_pdf);
        res.status(200).json({ mensagem: "Comprovante enviado com sucesso!", aluguel: aluguelAtualizado });
    } catch (error: any) {
        res.status(500).json({ mensagem: error.message || "Erro interno" });
    }
};

export const avaliarComprovanteMatricula = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_anunciante = req.user?.id_usuario;
        const id_aluguel = Number(req.params.id_aluguel);
        const { status } = req.body;

        if (!id_anunciante) {
            res.status(401).json({ mensagem: "Não autenticado." });
            return;
        }

        const aluguelAtualizado = await avaliarComprovanteMatriculaService(id_aluguel, id_anunciante, status);
        res.status(200).json({ mensagem: "Matrícula avaliada com sucesso!", aluguel: aluguelAtualizado });
    } catch (error: any) {
        res.status(500).json({ mensagem: error.message || "Erro interno" });
    }
};

export const listarInquilinosDaRepublica = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_republica = Number(req.params.id_republica);

        if (!Number.isInteger(id_republica)) {
            res.status(400).json({ mensagem: "ID da república inválido." });
            return;
        }

        const alugueisAtivos = await Aluguel.findAll({
            where: {
                id_republica: id_republica,
                status: { [Op.in]: ["ativo", "aceito"] }
            },
            include: [
                {
                    model: Usuario,
                    as: "usuario",
                    attributes: ["id_usuario", "nome", "email", "telefone"]
                }
            ]
        });

        const moradores = alugueisAtivos
            .map((aluguel: any) => aluguel.usuario)
            .filter(Boolean);

        res.status(200).json(moradores);
    } catch (error) {
        console.error("Erro ao listar inquilinos da república:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const gerarContratoLocacaoPdf = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_aluguel = Number(req.params.id_aluguel);

        if (!Number.isInteger(id_aluguel)) {
            res.status(400).json({ mensagem: "ID do aluguel inválido." });
            return;
        }

        const aluguel = await Aluguel.findByPk(id_aluguel, {
            include: [
                { model: Usuario, as: "usuario" },
                {
                    model: Republica,
                    as: "republica",
                    include: [
                        { model: LocalizacaoRepublica, as: "localizacao" },
                        { model: Usuario, as: "anunciante" }
                    ]
                }
            ]
        });

        if (!aluguel) {
            res.status(404).json({ mensagem: "Contrato/Aluguel não encontrado." });
            return;
        }

        const estudante = (aluguel as any).usuario;
        const republica = (aluguel as any).republica;
        const loc = republica?.localizacao;
        const locador = republica?.anunciante;

        const doc = new PDFDocument({
            margin: 60,
            size: 'A4',
            info: {
                Title: `Contrato de Locação - ${republica?.nome}`,
                Author: 'Plataforma ReUni'
            }
        });

        const nomeFormatado = estudante?.nome ? estudante.nome.replace(/\s+/g, '_') : 'Estudante';

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=Contrato_${nomeFormatado}.pdf`);

        doc.pipe(res);


        doc.fontSize(16).font('Helvetica-Bold').text("INSTRUMENTO PARTICULAR DE CONTRATO DE LOCAÇÃO DE VAGA", { align: "center" });
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica').text("Gerado eletronicamente via Plataforma ReUni - Gestão de Moradia Estudantil", { align: "center" });
        doc.moveDown(3);


        doc.fontSize(12).font('Helvetica-Bold').text("CLÁUSULA PRIMEIRA - DAS PARTES");
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(11).text(
            "LOCADOR(A): ", { continued: true, align: "justify" }
        ).font('Helvetica-Bold').text(`${locador?.nome || "Representante da República"}`, { continued: true })
        .font('Helvetica').text(
            `, portador(a) do e-mail ${locador?.email || "não informado"} e telefone ${locador?.telefone || "não informado"}.`
        );
        doc.moveDown(0.5);
        doc.text(
            "LOCATÁRIO(A): ", { continued: true, align: "justify" }
        ).font('Helvetica-Bold').text(`${estudante?.nome || "N/A"}`, { continued: true })
        .font('Helvetica').text(
            `, portador(a) do e-mail ${estudante?.email || "não informado"} e telefone ${estudante?.telefone || "não informado"}.`
        );
        doc.moveDown(1.5);


        doc.font('Helvetica-Bold').fontSize(12).text("CLÁUSULA SEGUNDA - DO OBJETO");
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(11).text(
            `O presente instrumento tem como objeto a locação de uma vaga residencial na república denominada "${republica?.nome || "N/A"}", ` +
            `situada na ${loc?.endereco || ""}, nº ${loc?.numero || ""}, complemento ${loc?.complemento || "N/A"}, ` +
            `bairro ${loc?.bairro || ""}, CEP ${loc?.cep || ""}, na cidade de ${loc?.cidade || ""} - ${loc?.estado_uf || ""}.`,
            { align: "justify" }
        );
        doc.moveDown(1.5);


        doc.font('Helvetica-Bold').fontSize(12).text("CLÁUSULA TERCEIRA - DO VALOR E DO PAGAMENTO");
        doc.moveDown(0.5);
        const valorMensal = Number(aluguel.valor || republica?.valor_mensal || 0).toFixed(2);
        doc.font('Helvetica').fontSize(11).text(
            `O valor do aluguel mensal pactuado é de R$ ${valorMensal} (reais). ` +
            `O pagamento deverá ser efetuado mensalmente, de forma adiantada, através de PIX ou outro meio acordado via plataforma ReUni. ` +
            `O atraso no pagamento sujeitará o LOCATÁRIO(A) a multas e juros previstos no regulamento interno.`,
            { align: "justify" }
        );
        doc.moveDown(1.5);


        doc.font('Helvetica-Bold').fontSize(12).text("CLÁUSULA QUARTA - DO PRAZO");
        doc.moveDown(0.5);
        const dataInicioFormatada = aluguel.data_inicio ? new Date(aluguel.data_inicio).toLocaleDateString('pt-BR') : "aprovação da solicitação";
        doc.font('Helvetica').fontSize(11).text(
            `O presente contrato de locação terá início na data de ${dataInicioFormatada}, ` +
            `podendo ser rescindido por qualquer uma das partes mediante aviso prévio de 30 (trinta) dias, sem incidência de multa rescisória, ` +
            `desde que não haja débitos pendentes.`,
            { align: "justify" }
        );
        doc.moveDown(1.5);


        doc.font('Helvetica-Bold').fontSize(12).text("CLÁUSULA QUINTA - DOS DEVERES E OBRIGAÇÕES");
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(11).text(
            "O(A) LOCATÁRIO(A) compromete-se expressamente a:\n" +
            "a) Zelar pela boa convivência, limpeza e conservação das dependências comuns e privadas do imóvel;\n" +
            "b) Respeitar os horários de silêncio e as regras internas da república;\n" +
            "c) Não ceder, sublocar ou transferir a vaga a terceiros sem autorização prévia do LOCADOR(A);\n" +
            "d) Arcar com sua cota-parte no rateio de despesas extras (água, luz, internet), caso não estejam inclusas no valor principal.",
            { align: "justify", lineGap: 3 }
        );
        doc.moveDown(1.5);


        doc.font('Helvetica-Bold').fontSize(12).text("CLÁUSULA SEXTA - DO FORO");
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(11).text(
            `Para dirimir quaisquer controvérsias oriundas deste contrato, as partes elegem o foro da Comarca de ${loc?.cidade || "sua localidade"}, ` +
            `renunciando a qualquer outro, por mais privilegiado que seja.`,
            { align: "justify" }
        );
        doc.moveDown(3);


        const dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
        doc.text(`${loc?.cidade || "Local"}, ${dataAtual}.`, { align: "right" });
        doc.moveDown(4);


        doc.text("___________________________________________________", { align: "center" });
        doc.font('Helvetica-Bold').text("LOCADOR(A)", { align: "center" });
        doc.font('Helvetica').text(`${locador?.nome || "Representante"}`, { align: "center" });
        doc.moveDown(3);

        doc.text("___________________________________________________", { align: "center" });
        doc.font('Helvetica-Bold').text("LOCATÁRIO(A)", { align: "center" });
        doc.font('Helvetica').text(`${estudante?.nome || ""}`, { align: "center" });
        doc.moveDown(3);

        doc.text("___________________________________________________", { align: "center" });
        doc.font('Helvetica-Bold').text("TESTEMUNHA 1", { align: "center" });
        doc.moveDown(3);

        doc.text("___________________________________________________", { align: "center" });
        doc.font('Helvetica-Bold').text("TESTEMUNHA 2", { align: "center" });

        doc.end();
    } catch (error) {
        console.error("Erro ao gerar PDF do contrato:", error);
        res.status(500).json({ mensagem: "Erro interno ao gerar o contrato de locação." });
    }
};