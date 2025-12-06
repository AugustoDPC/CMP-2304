import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Sala } from '../types';

export function Salas() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarSalas();
  }, []);

  async function carregarSalas() {
    try {
      const dados = await api.listarSalas();
      setSalas(dados);
    } catch (erro) {
      console.error('Erro ao carregar salas:', erro);
      alert('Erro ao carregar salas');
    } finally {
      setCarregando(false);
    }
  }

  async function lidarComExclusao(id: string) {
    if (confirm('Tem certeza que deseja excluir esta sala?')) {
      try {
        await api.excluirSala(id);
        carregarSalas();
      } catch (erro) {
        console.error('Erro ao excluir:', erro);
        alert('Erro ao excluir sala');
      }
    }
  }

  if (carregando) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Salas Cadastradas</h2>
        <Link to="/salas/novo" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>Nova Sala
        </Link>
      </div>

      {salas.length === 0 ? (
        <p className="text-muted">Nenhuma sala cadastrada.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Número</th>
                <th>Capacidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {salas.map((sala) => (
                <tr key={sala.id}>
                  <td>{sala.numero}</td>
                  <td>{sala.capacidade} lugares</td>
                  <td>
                    <button 
                      onClick={() => lidarComExclusao(sala.id!)} 
                      className="btn btn-outline-danger btn-sm"
                      title="Excluir"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
