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
  // Poltronas será uma matriz de booleanos (true = ocupada, false = livre) ou objetos
  // Para simplificar no cadastro, vamos gerar automaticamente baseado na capacidade ou dimensões fixas
  // Mas no schema de validação de cadastro, talvez não precisemos passar as poltronas explicitamente
});

export type Sala = z.infer<typeof salaSchema> & {
  poltronas?: boolean[][]; // Matriz de assentos
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

// --- LANCHES ---
export const lancheSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "O nome do lanche é obrigatório"),
  descricao: z.string().optional(),
  preco: z.coerce.number().min(0, "O preço deve ser maior ou igual a zero"),
});

export type Lanche = z.infer<typeof lancheSchema>;

// --- PEDIDOS ---
// Um pedido contém ingressos e lanches
export const pedidoSchema = z.object({
  id: z.string().optional(),
  dataPedido: z.string(), // ISO Date
  ingressos: z.array(ingressoSchema),
  lanches: z.array(z.object({
    lancheId: z.string(),
    quantidade: z.number().min(1),
    precoUnitario: z.number(), // Preço no momento da compra
    nomeLanche: z.string() // Snapshot do nome
  })).optional(),
  valorTotal: z.number(),
  sessaoId: z.string().optional() // Para facilitar rastreio
});

export type Pedido = z.infer<typeof pedidoSchema>;
