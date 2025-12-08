import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Sala } from '../types';
import { Cabecalho } from '../components/Cabecalho';
import { Carregando } from '../components/Carregando';
import { EstadoVazio } from '../components/EstadoVazio';

export function Salas() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(true);

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
      setEstaCarregando(false);
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

  if (estaCarregando) {
    return <Carregando />;
  }

  return (
    <div>
      <Cabecalho 
        titulo="Salas Cadastradas" 
        textoBotao="Nova Sala" 
        linkBotao="/salas/novo" 
      />

      {salas.length === 0 ? (
        <EstadoVazio mensagem="Nenhuma sala cadastrada." />
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
