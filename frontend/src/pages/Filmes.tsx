import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Filme } from '../types';

export function Filmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarFilmes();
  }, []);

  async function carregarFilmes() {
    try {
      const dados = await api.listarFilmes();
      setFilmes(dados);
    } catch (erro) {
      console.error('Erro ao carregar filmes:', erro);
      alert('Erro ao carregar filmes');
    } finally {
      setCarregando(false);
    }
  }

  async function lidarComExclusao(id: string) {
    if (confirm('Tem certeza que deseja excluir este filme?')) {
      try {
        await api.excluirFilme(id);
        carregarFilmes(); // Recarrega a lista
      } catch (erro) {
        console.error('Erro ao excluir:', erro);
        alert('Erro ao excluir filme');
      }
    }
  }

  if (carregando) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Filmes em Cartaz</h2>
        <Link to="/filmes/novo" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>Novo Filme
        </Link>
      </div>

      {filmes.length === 0 ? (
        <p className="text-muted">Nenhum filme cadastrado.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filmes.map((filme) => (
            <div className="col" key={filme.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{filme.titulo}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{filme.genero} - {filme.duracao} min</h6>
                  <p className="card-text text-truncate">{filme.sinopse}</p>
                  <p className="card-text"><small className="text-muted">Classificação: {filme.classificacao}</small></p>
                </div>
                <div className="card-footer bg-transparent border-top-0 d-flex justify-content-end">
                  <button 
                    onClick={() => lidarComExclusao(filme.id!)} 
                    className="btn btn-outline-danger btn-sm"
                    title="Excluir"
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
