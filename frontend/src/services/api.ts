import type { Filme, Sala, Sessao, Ingresso } from '../types';

const API_URL = 'http://localhost:4000';


async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, options);
  
  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.statusText}`);
  }


  if (response.status === 204) {
    return {} as unknown as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as unknown as T;
}

export const api = {
  listarFilmes: () => request<Filme[]>('/filmes'),
  obterFilme: (id: string) => request<Filme>(`/filmes/${id}`),
  criarFilme: (filme: Filme) => request<Filme>('/filmes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filme),
  }),
  excluirFilme: (id: string) => request<void>(`/filmes/${id}`, { method: 'DELETE' }),

  listarSalas: () => request<Sala[]>('/salas'),
  criarSala: (sala: Sala) => request<Sala>('/salas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sala),
  }),
  excluirSala: (id: string) => request<void>(`/salas/${id}`, { method: 'DELETE' }),

  listarSessoes: () => request<Sessao[]>('/sessoes'),
  criarSessao: (sessao: Sessao) => request<Sessao>('/sessoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sessao),
  }),
  excluirSessao: (id: string) => request<void>(`/sessoes/${id}`, { method: 'DELETE' }),

  criarIngresso: (ingresso: Ingresso) => request<Ingresso>('/ingressos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ingresso),
  }),
  listarIngressosPorSessao: (sessaoId: string) => request<Ingresso[]>(`/ingressos?sessaoId=${sessaoId}`),
};
