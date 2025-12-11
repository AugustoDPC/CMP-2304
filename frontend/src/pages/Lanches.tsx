import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Lanche } from '../types';
import { Cabecalho } from '../components/Cabecalho';
import { Carregando } from '../components/Carregando';
import { EstadoVazio } from '../components/EstadoVazio';
import { Botao } from '../components/Botao/Botao';
import { Cartao } from '../components/Cards/Cartao';

export function Lanches() {
  const [lanches, setLanches] = useState<Lanche[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarLanches();
  }, []);

  async function carregarLanches() {
    try {
      const dados = await api.listarLanches();
      setLanches(dados);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar lanches');
    } finally {
      setCarregando(false);
    }
  }

  async function lidarComExclusao(id: string) {
    if (!confirm('Tem certeza que deseja excluir este lanche?')) return;
    
    try {
      await api.excluirLanche(id);
      setLanches(lanches.filter(l => l.id !== id));
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir lanche');
    }
  }

  if (carregando) return <Carregando />;

  if (carregando) return <Carregando />;

  return (
    <div>
      <Cabecalho 
        titulo="Lanches e Combos" 
        textoBotao="Novo Lanche"
        linkBotao="/lanches/novo"
      />

      {lanches.length === 0 ? (
        <EstadoVazio mensagem="Nenhum lanche cadastrado." />
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {lanches.map((lanche) => (
            <div key={lanche.id} className="col">
              <Cartao 
                titulo={lanche.nome}
                className="h-100 shadow-sm"
                rodape={
                  <div className="d-flex justify-content-between w-100">
                    <Link
                      to={`/lanches/editar/${lanche.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      <i className="bi bi-pencil-square me-1"></i>Editar
                    </Link>
                    <Botao 
                      variant="outline-danger"
                      tamanho="sm"
                      onClick={() => lanche.id && lidarComExclusao(lanche.id)}
                    >
                       <i className="bi bi-trash"></i> Excluir
                    </Botao>
                  </div>
                }
              >
                  <p className="card-text text-muted">{lanche.descricao}</p>
                  <h4 className="text-success">R$ {lanche.preco.toFixed(2)}</h4>
              </Cartao>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
