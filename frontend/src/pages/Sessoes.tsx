import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Sessao, Filme, Sala } from '../types';
import { Cabecalho } from '../components/Cabecalho';
import { Carregando } from '../components/Carregando';
import { EstadoVazio } from '../components/EstadoVazio';
import { CartaoSessao } from '../components/CartaoSessao';

// Tipo estendido para exibição
type SessaoComDados = Sessao & {
  filme?: Filme;
  sala?: Sala;
};

export function Sessoes() {
  const [sessoes, setSessoes] = useState<SessaoComDados[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [dadosSessoes, dadosFilmes, dadosSalas] = await Promise.all([
        api.listarSessoes(),
        api.listarFilmes(),
        api.listarSalas()
      ]);

      // Cruzar dados
      const sessoesCompletas = dadosSessoes.map(sessao => ({
        ...sessao,
        filme: dadosFilmes.find(f => f.id === sessao.filmeId),
        sala: dadosSalas.find(s => s.id === sessao.salaId)
      }));

      setSessoes(sessoesCompletas);
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
      alert('Erro ao carregar sessões');
    } finally {
      setEstaCarregando(false);
    }
  }

  async function lidarComExclusao(id: string) {
    if (confirm('Tem certeza que deseja cancelar esta sessão?')) {
      try {
        await api.excluirSessao(id);
        carregarDados();
      } catch (erro) {
        console.error('Erro ao excluir:', erro);
        alert('Erro ao excluir sessão');
      }
    }
  }

  if (estaCarregando) {
    return <Carregando />;
  }

  return (
    <div>
      <Cabecalho 
        titulo="Sessões Agendadas" 
        textoBotao="Nova Sessão" 
        linkBotao="/sessoes/novo" 
      />

      {sessoes.length === 0 ? (
        <EstadoVazio mensagem="Nenhuma sessão agendada." />
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {sessoes.map((sessao) => (
            <CartaoSessao 
              key={sessao.id} 
              sessao={sessao} 
              aoExcluir={lidarComExclusao} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
