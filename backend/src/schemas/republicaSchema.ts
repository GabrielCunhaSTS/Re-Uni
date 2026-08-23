import { z } from 'zod';

export const createRepublicaSchema = z.object({
  id_tipo_republica: z.number().int().positive('Tipo de república é obrigatório'),
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(150),
  descricao: z.string().optional().nullable(),
  valor_mensal: z.number().min(0, 'Valor mensal deve ser maior ou igual a 0'),
  vagas_total: z.number().int().min(1, 'Total de vagas deve ser no mínimo 1').default(1),
  vagas_disponiveis: z.number().int().min(0, 'Vagas disponíveis inválidas').default(1),
  
  
  localizacao: z.object({
    cep: z.string().max(9).optional().nullable(),
    endereco: z.string().max(200).optional().nullable(),
    numero: z.string().max(20).optional().nullable(),
    complemento: z.string().max(100).optional().nullable(),
    bairro: z.string().min(1, 'Bairro é obrigatório').max(100),
    cidade: z.string().min(1, 'Cidade é obrigatória').max(100),
    id_estado: z.number().int().positive('Estado é obrigatório'),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable()
  }),

  
  dados: z.object({
    quartos: z.number().int().min(0).default(0),
    banheiros: z.number().int().min(0).default(0),
    moradores: z.number().int().min(0).default(0),
    mobiliada: z.boolean().default(false),
    possui_internet: z.boolean().default(false),
    possui_garagem: z.boolean().default(false),
    possui_lavanderia: z.boolean().default(false),
    possui_area_lazer: z.boolean().default(false),
    aceita_pets: z.boolean().default(false)
  }).optional()
}).refine(data => data.vagas_disponiveis <= data.vagas_total, {
  message: "Vagas disponíveis não podem ser maiores que o total de vagas",
  path: ["vagas_disponiveis"]
});

export type CreateRepublicaInput = z.infer<typeof createRepublicaSchema>;