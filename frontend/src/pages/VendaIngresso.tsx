import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Sessao, Filme, Sala, Ingresso } from '../types';

type AssentoStatus = 'livre' | 'ocupado' | 'selecionado';

interface AssentoUI {
  id: string; // Ex: A1, A2...
  status: AssentoStatus;
}

export function VendaIngresso() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [filme, setFilme] = useState<Filme | null>(null);
  const [sala, setSala] = useState<Sala | null>(null);
  const [assentos, setAssentos] = useState<AssentoUI[]>([]);
  const [carregando, setCarregando] = useState(true);
  
  // Estado para assentos selecionados: Map<AssentoID, TipoIngresso>
  const [selecionados, setSelecionados] = useState<Map<string, 'INTEIRA' | 'MEIA'>>(new Map());

  useEffect(() => {
    if (id) {
      carregarDados(id);
    }
  }, [id]);

  async function carregarDados(sessaoId: string) {
    try {
      const dadosSessao = await api.listarSessoes().then(lista => lista.find(s => s.id === sessaoId));
      
      if (!dadosSessao) {
        alert('Sessão não encontrada');
        navigate('/sessoes');
        return;
      }
      
      const [dadosFilme, dadosSala, dadosIngressos] = await Promise.all([
        api.obterFilme(dadosSessao.filmeId),
        api.listarSalas().then(lista => lista.find(s => s.id === dadosSessao.salaId)),
        api.listarIngressosPorSessao(sessaoId)
      ]);

      if (!dadosSala) throw new Error('Sala não encontrada');

      setSessao(dadosSessao);
      setFilme(dadosFilme);
      setSala(dadosSala);

      // Gerar mapa de assentos
      gerarAssentos(dadosSala.capacidade, dadosIngressos);
      
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
      alert('Erro ao carregar dados da sessão');
    } finally {
      setCarregando(false);
    }
  }

  function gerarAssentos(capacidade: number, ingressosVendidos: Ingresso[]) {
    const assentosGerados: AssentoUI[] = [];
    const assentosOcupados = new Set(ingressosVendidos.map(i => i.assento));
    
    // Gera assentos A1, A2... B1, B2... (10 por fileira)
    const colunas = 10;
    const fileiras = Math.ceil(capacidade / colunas);
    
    let contador = 0;
    for (let i = 0; i < fileiras; i++) {
      const letra = String.fromCharCode(65 + i); // A, B, C...
      for (let j = 1; j <= colunas; j++) {
        if (contador >= capacidade) break;
        
        const idAssento = `${letra}${j}`;
        assentosGerados.push({
          id: idAssento,
          status: assentosOcupados.has(idAssento) ? 'ocupado' : 'livre'
        });
        contador++;
      }
    }
    setAssentos(assentosGerados);
  }

  function alternarAssento(assentoId: string) {
    const novosSelecionados = new Map(selecionados);
    if (novosSelecionados.has(assentoId)) {
      novosSelecionados.delete(assentoId);
    } else {
      novosSelecionados.set(assentoId, 'INTEIRA'); // Default
    }
    setSelecionados(novosSelecionados);
  }

  function mudarTipoIngresso(assentoId: string, tipo: 'INTEIRA' | 'MEIA') {
    const novosSelecionados = new Map(selecionados);
    novosSelecionados.set(assentoId, tipo);
    setSelecionados(novosSelecionados);
  }

  async function finalizarVenda() {
    if (selecionados.size === 0) return;
    
    if (!confirm(`Confirmar venda de ${selecionados.size} ingressos?`)) return;

    try {
      const promises = Array.from(selecionados.entries()).map(([assento, tipo]) => {
        return api.criarIngresso({
          sessaoId: sessao!.id!,
          assento,
          tipo,
          valor: tipo === 'INTEIRA' ? 20 : 10 // Preço fixo por enquanto
        });
      });

      await Promise.all(promises);
      
      alert('Venda realizada com sucesso!');
      navigate('/sessoes');
      
    } catch (erro) {
      console.error('Erro na venda:', erro);
      alert('Erro ao processar venda');
    }
  }

  const total = Array.from(selecionados.values()).reduce((acc, tipo) => acc + (tipo === 'INTEIRA' ? 20 : 10), 0);

  if (carregando) return <div className="text-center mt-5">Carregando...</div>;

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col">
          <h2>Venda de Ingressos</h2>
          <h5 className="text-muted">{filme?.titulo}</h5>
          <p>Sala {sala?.numero} - {new Date(sessao!.dataHora).toLocaleString()}</p>
        </div>
      </div>

      <div className="row">
        {/* Mapa de Assentos */}
        <div className="col-md-7 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white text-center">TELA</div>
            <div className="card-body text-center">
              <div className="d-flex flex-wrap justify-content-center gap-2" style={{ maxWidth: '400px', margin: '0 auto' }}>
                {assentos.map(assento => {
                  const isSelected = selecionados.has(assento.id);
                  let btnClass = 'btn-outline-secondary';
                  if (assento.status === 'ocupado') btnClass = 'btn-danger disabled';
                  else if (isSelected) btnClass = 'btn-success';

                  return (
                    <button
                      key={assento.id}
                      className={`btn ${btnClass} btn-sm`}
                      style={{ width: '40px', height: '40px' }}
                      onClick={() => assento.status === 'livre' && alternarAssento(assento.id)}
                      disabled={assento.status === 'ocupado'}
                    >
                      {assento.id}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 d-flex justify-content-center gap-3">
                <div><span className="badge bg-secondary">Livre</span></div>
                <div><span className="badge bg-success">Selecionado</span></div>
                <div><span className="badge bg-danger">Ocupado</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo da Compra */}
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-header">Resumo da Compra</div>
            <div className="card-body">
              {selecionados.size === 0 ? (
                <p className="text-muted text-center">Selecione assentos no mapa.</p>
              ) : (
                <ul className="list-group list-group-flush mb-3">
                  {Array.from(selecionados.entries()).map(([assento, tipo]) => (
                    <li key={assento} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>Assento <strong>{assento}</strong></span>
                      <select 
                        className="form-select form-select-sm w-auto"
                        value={tipo}
                        onChange={(e) => mudarTipoIngresso(assento, e.target.value as 'INTEIRA' | 'MEIA')}
                      >
                        <option value="INTEIRA">Inteira (R$ 20)</option>
                        <option value="MEIA">Meia (R$ 10)</option>
                      </select>
                    </li>
                  ))}
                </ul>
              )}
              
              <div className="d-flex justify-content-between align-items-center border-top pt-3">
                <h4>Total:</h4>
                <h4 className="text-primary">R$ {total.toFixed(2)}</h4>
              </div>
              
              <button 
                className="btn btn-primary w-100 mt-3" 
                disabled={selecionados.size === 0}
                onClick={finalizarVenda}
              >
                Finalizar Venda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
