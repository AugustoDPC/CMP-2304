import { useState, useEffect } from 'react';
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

  if (carregando) return <Carregando />;

  return (
    <div>
      <Cabecalho titulo="Histórico de Pedidos" />

      {pedidos.length === 0 ? (
        <EstadoVazio mensagem="Nenhum pedido realizado." />
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Data</th>
                <th>Total</th>
                <th>Itens</th>
                <th>ID</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
