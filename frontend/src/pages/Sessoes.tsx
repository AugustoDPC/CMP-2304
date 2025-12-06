import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Sessao, Filme, Sala } from '../types';

// Tipo estendido para exibição
type SessaoComDados = Sessao & {
  filme?: Filme;
  sala?: Sala;
};

export function Sessoes() {
  const [sessoes, setSessoes] = useState<SessaoComDados[]>([]);
  const [carregando, setCarregando] = useState(true);

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
      setCarregando(false);
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

  if (carregando) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Sessões Agendadas</h2>
        <Link to="/sessoes/novo" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>Nova Sessão
        </Link>
      </div>

      {sessoes.length === 0 ? (
        <p className="text-muted">Nenhuma sessão agendada.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {sessoes.map((sessao) => (
            <div className="col" key={sessao.id}>
              <div className="card h-100 shadow-sm border-start border-4 border-primary">
                <div className="card-body">
                  <h5 className="card-title">{sessao.filme?.titulo || 'Filme não encontrado'}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Sala {sessao.sala?.numero || '?'} - {new Date(sessao.dataHora).toLocaleString()}
                  </h6>
                  <p className="card-text">
                    <span className="badge bg-secondary me-2">{sessao.filme?.genero}</span>
                    <span className="badge bg-info text-dark">{sessao.filme?.classificacao}</span>
                  </p>
                </div>
                <div className="card-footer bg-transparent border-top-0 d-flex justify-content-between">
                  <Link to={`/sessoes/${sessao.id}/vender`} className="btn btn-success btn-sm">
                    <i className="bi bi-ticket-perforated me-1"></i>Vender Ingresso
                  </Link>
                  <button 
                    onClick={() => lidarComExclusao(sessao.id!)} 
                    className="btn btn-outline-danger btn-sm"
                    title="Cancelar Sessão"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
