import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Filme } from '../types';
import { Cabecalho } from '../components/Cabecalho';
import { Carregando } from '../components/Carregando';
import { EstadoVazio } from '../components/EstadoVazio';
import { CartaoFilme } from '../components/CartaoFilme';

export function Filmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(true);

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
      setEstaCarregando(false);
    }
  }

  async function lidarComExclusao(id: string) {
    if (confirm('Tem certeza que deseja excluir este filme?')) {
      try {
        await api.excluirFilme(id);
        carregarFilmes(); // Recarrega a lista para mostrar os dados atualizados
      } catch (erro) {
        console.error('Erro ao excluir:', erro);
        alert('Erro ao excluir filme');
      }
    }
  }

  if (estaCarregando) {
    return <Carregando />;
  }

  return (
    <div>
      <Cabecalho 
        titulo="Filmes em Cartaz" 
        textoBotao="Novo Filme" 
        linkBotao="/filmes/novo" 
      />

      {filmes.length === 0 ? (
        <EstadoVazio mensagem="Nenhum filme cadastrado no momento." />
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filmes.map((filme) => (
            <CartaoFilme 
              key={filme.id} 
              filme={filme} 
              aoExcluir={lidarComExclusao} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
