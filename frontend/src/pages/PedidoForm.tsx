import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Pedido } from '../types';
import { Cabecalho } from '../components/Cabecalho';
import { Carregando } from '../components/Carregando';
import { Botao } from '../components/Botao/Botao';


export function PedidoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [pedido, setPedido] = useState<Pedido | null>(null);


  useEffect(() => {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    if (!id) {
      navigate('/pedidos');
      return;
    }

    try {
      const pedidoCarregado = await api.obterPedido(id);
      setPedido(pedidoCarregado);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar pedido');
      navigate('/pedidos');
    } finally {
      setCarregando(false);
    }
  }

  function atualizarLanche(index: number, campo: 'quantidade', valor: number) {
    if (!pedido || !pedido.lanches) return;
    
    const lanchesAtualizados = [...pedido.lanches];
    lanchesAtualizados[index] = {
      ...lanchesAtualizados[index],
      [campo]: valor
    };
    
    // Recalcular valor total
    const valorIngressos = pedido.ingressos.reduce((acc, ing) => acc + ing.valor, 0);
    const valorLanches = lanchesAtualizados.reduce((acc, l) => acc + (l.quantidade * l.precoUnitario), 0);
    
    setPedido({
      ...pedido,
      lanches: lanchesAtualizados,
      valorTotal: valorIngressos + valorLanches
    });
  }

  function removerLanche(index: number) {
    if (!pedido || !pedido.lanches) return;
    
    const lanchesAtualizados = pedido.lanches.filter((_, i) => i !== index);
    
    // Recalcular valor total
    const valorIngressos = pedido.ingressos.reduce((acc, ing) => acc + ing.valor, 0);
    const valorLanches = lanchesAtualizados.reduce((acc, l) => acc + (l.quantidade * l.precoUnitario), 0);
    
    setPedido({
      ...pedido,
      lanches: lanchesAtualizados,
      valorTotal: valorIngressos + valorLanches
    });
  }

  function removerIngresso(index: number) {
    if (!pedido) return;
    
    const ingressosAtualizados = pedido.ingressos.filter((_, i) => i !== index);
    
    // Recalcular valor total
    const valorIngressos = ingressosAtualizados.reduce((acc, ing) => acc + ing.valor, 0);
    const valorLanches = pedido.lanches?.reduce((acc, l) => acc + (l.quantidade * l.precoUnitario), 0) ?? 0;
    
    setPedido({
      ...pedido,
      ingressos: ingressosAtualizados,
      valorTotal: valorIngressos + valorLanches
    });
  }

  function atualizarIngresso(index: number, novoTipo: 'INTEIRA' | 'MEIA') {
    if (!pedido) return;
    
    const ingressosAtualizados = [...pedido.ingressos];
    const ingressoAtual = ingressosAtualizados[index];
    
    // Calcular o preço base (inteira) e o novo valor
    const precoBase = ingressoAtual.tipo === 'INTEIRA' ? ingressoAtual.valor : ingressoAtual.valor * 2;
    const novoValor = novoTipo === 'INTEIRA' ? precoBase : precoBase / 2;
    
    ingressosAtualizados[index] = {
      ...ingressoAtual,
      tipo: novoTipo,
      valor: novoValor
    };
    
    // Recalcular valor total
    const valorIngressos = ingressosAtualizados.reduce((acc, ing) => acc + ing.valor, 0);
    const valorLanches = pedido.lanches?.reduce((acc, l) => acc + (l.quantidade * l.precoUnitario), 0) ?? 0;
    
    setPedido({
      ...pedido,
      ingressos: ingressosAtualizados,
      valorTotal: valorIngressos + valorLanches
    });
  }

  async function salvarPedido() {
    if (!pedido || !id) return;

    try {
      await api.atualizarPedido(id, pedido);
      alert('Pedido atualizado com sucesso!');
      navigate('/pedidos');
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar pedido');
    }
  }

  if (carregando) return <Carregando />;
  if (!pedido) return <div>Pedido não encontrado</div>;

  return (
    <div>
      <Cabecalho titulo="Editar Pedido" />
      
      <div className="card mb-4">
        <div className="card-header">
          <strong>Informações do Pedido</strong>
        </div>
        <div className="card-body">
          <p><strong>ID:</strong> {pedido.id}</p>
          <p><strong>Data:</strong> {new Date(pedido.dataPedido).toLocaleString()}</p>
          <p><strong>Valor Total:</strong> <span className="text-success fw-bold">R$ {pedido.valorTotal.toFixed(2)}</span></p>
        </div>
      </div>

      {/* Ingressos */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <strong>Ingressos ({pedido.ingressos.length})</strong>
        </div>
        <div className="card-body">
          {pedido.ingressos.length === 0 ? (
            <p className="text-muted">Nenhum ingresso neste pedido.</p>
          ) : (
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Assento</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {pedido.ingressos.map((ingresso, index) => (
                  <tr key={index}>
                    <td>{ingresso.assento}</td>
                    <td style={{ width: '120px' }}>
                      <select
                        className="form-select form-select-sm"
                        value={ingresso.tipo}
                        onChange={(e) => atualizarIngresso(index, e.target.value as 'INTEIRA' | 'MEIA')}
                      >
                        <option value="INTEIRA">Inteira</option>
                        <option value="MEIA">Meia</option>
                      </select>
                    </td>
                    <td>R$ {ingresso.valor.toFixed(2)}</td>
                    <td>
                      <Botao
                        variant="outline-danger"
                        tamanho="sm"
                        onClick={() => removerIngresso(index)}
                      >
                        <i className="bi bi-trash"></i>
                      </Botao>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Lanches */}
      <div className="card mb-4">
        <div className="card-header">
          <strong>Lanches ({pedido.lanches?.length || 0})</strong>
        </div>
        <div className="card-body">
          {!pedido.lanches || pedido.lanches.length === 0 ? (
            <p className="text-muted">Nenhum lanche neste pedido.</p>
          ) : (
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Lanche</th>
                  <th>Quantidade</th>
                  <th>Preço Unit.</th>
                  <th>Subtotal</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {pedido.lanches.map((lanche, index) => (
                  <tr key={index}>
                    <td>{lanche.nomeLanche}</td>
                    <td style={{ width: '100px' }}>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={lanche.quantidade}
                        min={1}
                        onChange={(e) => atualizarLanche(index, 'quantidade', parseInt(e.target.value) || 1)}
                      />
                    </td>
                    <td>R$ {lanche.precoUnitario.toFixed(2)}</td>
                    <td>R$ {(lanche.quantidade * lanche.precoUnitario).toFixed(2)}</td>
                    <td>
                      <Botao
                        variant="outline-danger"
                        tamanho="sm"
                        onClick={() => removerLanche(index)}
                      >
                        <i className="bi bi-trash"></i>
                      </Botao>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="d-flex gap-2">
        <Botao variant="success" onClick={salvarPedido}>
          <i className="bi bi-check-lg me-2"></i>Salvar Alterações
        </Botao>
        <Botao variant="secondary" onClick={() => navigate('/pedidos')}>
          Cancelar
        </Botao>
      </div>
    </div>
  );
}
