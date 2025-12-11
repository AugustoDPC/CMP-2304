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
  // Atualizar Filme
  atualizarFilme: (id: string, filme: Filme) => request<Filme>(`/filmes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(filme) }),

  // Salas
  listarSalas: () => request<Sala[]>('/salas'),
  obterSala: (id: string) => request<Sala>(`/salas/${id}`),
  criarSala: (sala: Sala) => request<Sala>('/salas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sala),
  }),
  excluirSala: (id: string) => request<void>(`/salas/${id}`, { method: 'DELETE' }),
  // Atualizar Sala
  atualizarSala: (id: string, sala: Sala) => request<Sala>(`/salas/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sala) }),

  // Sessões
  listarSessoes: () => request<Sessao[]>('/sessoes'),
  obterSessao: (id: string) => request<Sessao>(`/sessoes/${id}`),
  criarSessao: (sessao: Sessao) => request<Sessao>('/sessoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sessao),
  }),
  excluirSessao: (id: string) => request<void>(`/sessoes/${id}`, { method: 'DELETE' }),
  // Atualizar Sessão
  atualizarSessao: (id: string, sessao: Sessao) => request<Sessao>(`/sessoes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sessao) }),

  // Ingressos
  criarIngresso: (ingresso: Ingresso) => request<Ingresso>('/ingressos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ingresso),
  }),
  listarIngressosPorSessao: (sessaoId: string) => request<Ingresso[]>(`/ingressos?sessaoId=${sessaoId}`),
  excluirIngresso: (id: string) => request<void>(`/ingressos/${id}`, { method: 'DELETE' }),

  // Lanches
  listarLanches: () => request<Lanche[]>('/lanches'),
  obterLanche: (id: string) => request<Lanche>(`/lanches/${id}`),
  criarLanche: (lanche: Lanche) => request<Lanche>('/lanches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lanche),
  }),
  excluirLanche: (id: string) => request<void>(`/lanches/${id}`, { method: 'DELETE' }),
  // Atualizar Lanche
  atualizarLanche: (id: string, lanche: Lanche) => request<Lanche>(`/lanches/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lanche) }),

  // Pedidos
  listarPedidos: () => request<Pedido[]>('/pedidos'),
  obterPedido: (id: string) => request<Pedido>(`/pedidos/${id}`),
  criarPedido: (pedido: Pedido) => request<Pedido>('/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido),
  }),
  atualizarPedido: (id: string, pedido: Pedido) => request<Pedido>(`/pedidos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido),
  }),
  // Excluir Pedido
  excluirPedido: (id: string) => request<void>(`/pedidos/${id}`, { method: 'DELETE' }),
};
