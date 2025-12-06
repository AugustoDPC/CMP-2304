import { z } from 'zod';

// --- FILMES ---
export const filmeSchema = z.object({
  id: z.string().optional(),
  titulo: z.string().min(1, "O título é obrigatório"),
  sinopse: z.string().min(10, "A sinopse deve ter no mínimo 10 caracteres"),
  duracao: z.number().min(1, "A duração deve ser maior que 0"),
  classificacao: z.string().min(1, "A classificação é obrigatória"),
  genero: z.string().min(1, "O gênero é obrigatório"),
  dataInicialExibicao: z.string().refine((val) => !isNaN(Date.parse(val)), "Data inválida"),
  dataFinalExibicao: z.string().refine((val) => !isNaN(Date.parse(val)), "Data inválida"),
});

export type Filme = z.infer<typeof filmeSchema>;

// --- SALAS ---
export const salaSchema = z.object({
  id: z.string().optional(),
  numero: z.coerce.number().min(1, "O número da sala é obrigatório"),
  capacidade: z.coerce.number().min(1, "A capacidade deve ser maior que 0"),

});

export type Sala = z.infer<typeof salaSchema> & {
  poltronas?: boolean[][];
};

// --- SESSÕES ---
export const sessaoSchema = z.object({
  id: z.string().optional(),
  filmeId: z.string().min(1, "Selecione um filme"),
  salaId: z.string().min(1, "Selecione uma sala"),
  dataHora: z.string().refine((val) => new Date(val) > new Date(), "A data deve ser futura"),
});

export type Sessao = z.infer<typeof sessaoSchema>;

// --- INGRESSOS ---
export const ingressoSchema = z.object({
  id: z.string().optional(),
  sessaoId: z.string(),
  assento: z.string().min(1, "O assento é obrigatório"),
  tipo: z.enum(['INTEIRA', 'MEIA']),
  valor: z.number(),
});

export type Ingresso = z.infer<typeof ingressoSchema>;
