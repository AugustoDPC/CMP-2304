import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Pedido } from '../types';
import { Cabecalho } from '../components/Cabecalho';
import { Carregando } from '../components/Carregando';
import { EstadoVazio } from '../components/EstadoVazio';

export function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function carregarPedidos() {
    try {
      const dados = await api.listarPedidos();
      // Ordenar por data mais recente
      dados.sort((a, b) => new Date(b.dataPedido).getTime() - new Date(a.dataPedido).getTime());
      setPedidos(dados);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar pedidos');
    } finally {
      setCarregando(false);
    }
  }

  async function lidarComExclusao(id: string) {
    if (!confirm('Tem certeza que deseja excluir este pedido? Os ingressos também serão excluídos.')) return;
    
    try {
      // Buscar o pedido para obter os ingressos
      const pedidoParaExcluir = pedidos.find(p => p.id === id);
      
      if (pedidoParaExcluir && pedidoParaExcluir.ingressos.length > 0) {
        // Excluir todos os ingressos do pedido
        await Promise.all(
          pedidoParaExcluir.ingressos.map(ing => 
            ing.id ? api.excluirIngresso(ing.id) : Promise.resolve()
          )
        );
      }
      
      // Excluir o pedido
      await api.excluirPedido(id);
      setPedidos(pedidos.filter(p => p.id !== id));
      alert('Pedido e ingressos excluídos com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir pedido');
    }
  }

  if (carregando) return <Carregando />;

  return (
    <div>
      <Cabecalho titulo="Histórico de Pedidos" />

      {pedidos.length === 0 ? (
        <EstadoVazio mensagem="Nenhum pedido realizado." />
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Data</th>
                <th>Total</th>
                <th>Itens</th>
                <th>ID</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{new Date(pedido.dataPedido).toLocaleString()}</td>
                  <td className="fw-bold text-success">R$ {pedido.valorTotal.toFixed(2)}</td>
                  <td>
                    {pedido.ingressos.length > 0 && (
                      <div><span className="badge bg-primary">{pedido.ingressos.length} Ingressos</span></div>
                    )}
                    {pedido.lanches && pedido.lanches.length > 0 && (
                       <div className="mt-1">
                         {pedido.lanches.map((l, idx) => (
                           <span key={idx} className="badge bg-warning text-dark me-1">
                             {l.quantidade}x {l.nomeLanche}
                           </span>
                         ))}
                       </div>
                    )}
                  </td>
                  <td className="text-muted small">{pedido.id}</td>
                  <td className="text-center">
                    <div className="btn-group btn-group-sm" role="group">
                      <Link
                        to={`/pedidos/editar/${pedido.id}`}
                        className="btn btn-outline-primary"
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Link>
                      <button
                        onClick={() => pedido.id && lidarComExclusao(pedido.id)}
                        className="btn btn-outline-danger"
                        title="Excluir"
                        type="button"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
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
