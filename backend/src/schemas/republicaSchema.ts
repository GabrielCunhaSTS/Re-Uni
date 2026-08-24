import { z } from 'zod';


const localizacaoSchema = z.object({
  cep: z.string().max(9).optional().nullable(),
  endereco: z.string().max(200).optional().nullable(),
  numero: z.string().max(20).optional().nullable(),
  complemento: z.string().max(100).optional().nullable(),
  bairro: z.string().min(1, 'Bairro é obrigatório').max(100),
  cidade: z.string().min(1, 'Cidade é obrigatória').max(100),
  id_estado: z.number().int().positive('Estado é obrigatório'),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable()
});



const dadosSchema = z.object({
  quartos: z.number().int().min(0).optional(),
  banheiros: z.number().int().min(0).optional(),
  moradores: z.number().int().min(0).optional(),
  mobiliada: z.boolean().optional(),
  possui_internet: z.boolean().optional(),
  possui_garagem: z.boolean().optional(),
  possui_lavanderia: z.boolean().optional(),
  possui_area_lazer: z.boolean().optional(),
  aceita_pets: z.boolean().optional()
});


const baseRepublicaSchema = z.object({
  id_tipo_republica: z.number().int().positive('Tipo de república é obrigatório'),
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(150),
  descricao: z.string().optional().nullable(),
  valor_mensal: z.number().min(0, 'Valor mensal deve ser maior ou igual a 0'),
  vagas_total: z.number().int().min(1, 'Total de vagas deve ser no mínimo 1').default(1),
  vagas_disponiveis: z.number().int().min(0, 'Vagas disponíveis inválidas').default(1),
  localizacao: localizacaoSchema,
  dados: dadosSchema.optional()
});


export const createRepublicaSchema = baseRepublicaSchema.refine(
  data => data.vagas_disponiveis <= data.vagas_total, {
  message: "Vagas disponíveis não podem ser maiores que o total de vagas",
  path: ["vagas_disponiveis"]
});

export type CreateRepublicaInput = z.infer<typeof createRepublicaSchema>;


export const updateRepublicaSchema = baseRepublicaSchema.partial().extend({
  
  localizacao: localizacaoSchema.partial().optional(),
  dados: dadosSchema.partial().optional()
}).refine(
  data => {
    
    if (data.vagas_disponiveis !== undefined && data.vagas_total !== undefined) {
      return data.vagas_disponiveis <= data.vagas_total;
    }
    return true;
  }, {
  message: "Vagas disponíveis não podem ser maiores que o total de vagas",
  path: ["vagas_disponiveis"]
});

export type UpdateRepublicaInput = z.infer<typeof updateRepublicaSchema>;