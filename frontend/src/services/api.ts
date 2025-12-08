import type { Filme, Sala, Sessao, Ingresso, Lanche, Pedido } from '../types';

const API_URL = 'http://localhost:4000';

// Helper genérico para requisições
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, options);
  
  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.statusText}`);
  }

  // Handle 204 No Content or empty response
  if (response.status === 204) {
    return {} as unknown as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as unknown as T;
}

export const api = {
  // Filmes
  listarFilmes: () => request<Filme[]>('/filmes'),
  obterFilme: (id: string) => request<Filme>(`/filmes/${id}`),
  criarFilme: (filme: Filme) => request<Filme>('/filmes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filme),
  }),
  excluirFilme: (id: string) => request<void>(`/filmes/${id}`, { method: 'DELETE' }),

  // Salas
  listarSalas: () => request<Sala[]>('/salas'),
  obterSala: (id: string) => request<Sala>(`/salas/${id}`),
  criarSala: (sala: Sala) => request<Sala>('/salas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sala),
  }),
  excluirSala: (id: string) => request<void>(`/salas/${id}`, { method: 'DELETE' }),

  // Sessões
  listarSessoes: () => request<Sessao[]>('/sessoes'),
  criarSessao: (sessao: Sessao) => request<Sessao>('/sessoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sessao),
  }),
  excluirSessao: (id: string) => request<void>(`/sessoes/${id}`, { method: 'DELETE' }),

  // Ingressos
  criarIngresso: (ingresso: Ingresso) => request<Ingresso>('/ingressos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ingresso),
  }),
  listarIngressosPorSessao: (sessaoId: string) => request<Ingresso[]>(`/ingressos?sessaoId=${sessaoId}`),

  // Lanches
  listarLanches: () => request<Lanche[]>('/lanches'),
  obterLanche: (id: string) => request<Lanche>(`/lanches/${id}`),
  criarLanche: (lanche: Lanche) => request<Lanche>('/lanches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lanche),
  }),
  excluirLanche: (id: string) => request<void>(`/lanches/${id}`, { method: 'DELETE' }),

  // Pedidos
  listarPedidos: () => request<Pedido[]>('/pedidos'),
  criarPedido: (pedido: Pedido) => request<Pedido>('/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido),
  }),
};
