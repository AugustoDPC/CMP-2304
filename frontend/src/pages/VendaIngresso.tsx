import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Sessao, Filme, Sala, Lanche } from '../types';
import { Carregando } from '../components/Carregando';
import { Cabecalho } from '../components/Cabecalho';
import { PainelSessaoIngressos } from '../components/Venda/PainelSessaoIngressos';
import { PainelLanches, type ItemLanche } from '../components/Venda/PainelLanches';
import { ResumoPedido } from '../components/Venda/ResumoPedido';

export function VendaIngresso() {
  const { id } = useParams<{ id: string }>();
  const navegar = useNavigate();
  
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [filme, setFilme] = useState<Filme | null>(null);
  const [sala, setSala] = useState<Sala | null>(null);
  const [ingressosVendidosCount, setIngressosVendidosCount] = useState(0);
  const [estaCarregando, setEstaCarregando] = useState(true);
  
  // Dados de Lanches
  const [lanchesDisponiveis, setLanchesDisponiveis] = useState<Lanche[]>([]);
  const [carrinhoLanches, setCarrinhoLanches] = useState<ItemLanche[]>([]);

  // Estado do formulário simples de ingresso
  const [tipoIngresso, setTipoIngresso] = useState<'INTEIRA' | 'MEIA'>('INTEIRA');
  const [valorIngresso, setValorIngresso] = useState('20.00'); 
  const [quantidadeIngressos, setQuantidadeIngressos] = useState(1);

  useEffect(() => {
    if (id) {
      carregarDados(id);
    }
  }, [id]);

  useEffect(() => {
    if (tipoIngresso === 'INTEIRA') setValorIngresso('20.00');
    else setValorIngresso('10.00');
  }, [tipoIngresso]);

  async function carregarDados(sessaoId: string) {
    try {
      const dadosSessao = await api.listarSessoes().then(lista => lista.find(s => s.id === sessaoId));
      
      if (!dadosSessao) {
        alert('Sessão não encontrada');
        navegar('/sessoes');
        return;
      }
      
      const [dadosFilme, dadosSala, dadosIngressos, dadosLanches] = await Promise.all([
        api.obterFilme(dadosSessao.filmeId),
        api.listarSalas().then(lista => lista.find(s => s.id === dadosSessao.salaId)),
        api.listarIngressosPorSessao(sessaoId),
        api.listarLanches()
      ]);

      if (!dadosSala) throw new Error('Sala não encontrada');

      setSessao(dadosSessao);
      setFilme(dadosFilme);
      setSala(dadosSala);
      setIngressosVendidosCount(dadosIngressos.length);
      setLanchesDisponiveis(dadosLanches);
      
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
      alert('Erro ao carregar dados da sessão');
    } finally {
      setEstaCarregando(false);
    }
  }

  function adicionarLanche(lanche: Lanche) {
    setCarrinhoLanches(prev => {
      const existente = prev.find(item => item.lanche.id === lanche.id);
      if (existente) {
        return prev.map(item => 
          item.lanche.id === lanche.id 
            ? { ...item, quantidade: item.quantidade + 1 } 
            : item
        );
      }
      return [...prev, { lanche, quantidade: 1 }];
    });
  }

  function removerLanche(lancheId: string) {
    setCarrinhoLanches(prev => {
      return prev.map(item => {
        if (item.lanche.id === lancheId) {
          return { ...item, quantidade: Math.max(0, item.quantidade - 1) };
        }
        return item;
      }).filter(item => item.quantidade > 0);
    });
  }

  const totalIngressos = Number(valorIngresso) * quantidadeIngressos;
  const totalLanches = carrinhoLanches.reduce((acc, item) => acc + (item.lanche.preco * item.quantidade), 0);
  const totalGeral = totalIngressos + totalLanches;

  async function finalizarPedido(e: React.FormEvent) {
    e.preventDefault();
    
    if (!sessao || !sala) return;

    if (ingressosVendidosCount + quantidadeIngressos > sala.capacidade) {
      alert('Não há lugares suficientes para essa quantidade de ingressos!');
      return;
    }

    if (!confirm(`Confirmar PEDIDO no valor total de R$ ${totalGeral.toFixed(2)}?`)) return;

    try {
      // 1. Gerar Ingressos
      const novosIngressos = [];
      for (let i = 0; i < quantidadeIngressos; i++) {
        const proximoNumero = ingressosVendidosCount + i + 1;
        novosIngressos.push({
            sessaoId: sessao.id!,
            assento: `Assento ${proximoNumero}`,
            tipo: tipoIngresso,
            valor: Number(valorIngresso)
        });
      }

      // 2. Preparar dados dos Lanches
      const itensPedido = carrinhoLanches.map(item => ({
        lancheId: item.lanche.id!,
        quantidade: item.quantidade,
        precoUnitario: item.lanche.preco,
        nomeLanche: item.lanche.nome
      }));

      // 3. Criar Pedido
      await api.criarPedido({
        dataPedido: new Date().toISOString(),
        ingressos: novosIngressos,
        lanches: itensPedido,
        valorTotal: totalGeral,
        sessaoId: sessao.id
      });

      // Hack para json-server: salvar ingressos avulsos para contar ocupação
      await Promise.all(novosIngressos.map(ing => api.criarIngresso(ing)));

      alert('Pedido realizado com sucesso!');
      navegar('/pedidos'); 
      
    } catch (erro) {
      console.error('Erro na venda:', erro);
      alert('Erro ao processar pedido. Tente novamente.');
    }
  }

  if (estaCarregando) return <Carregando />;
  if (!sessao || !filme || !sala) return <div>Erro ao carregar sessão.</div>;

  const lugaresDisponiveis = sala.capacidade - ingressosVendidosCount;

  return (
    <div>
       <Cabecalho titulo="Realizar Pedido" />

      <div className="row">
        {/* Coluna Esquerda: Sessão e Ingressos */}
        <div className="col-lg-6 mb-4">
          <PainelSessaoIngressos 
            filme={filme}
            sala={sala}
            sessao={sessao}
            lugaresDisponiveis={lugaresDisponiveis}
            tipoIngresso={tipoIngresso}
            setTipoIngresso={setTipoIngresso}
            quantidadeIngressos={quantidadeIngressos}
            setQuantidadeIngressos={setQuantidadeIngressos}
            valorIngresso={valorIngresso}
            totalIngressos={totalIngressos}
          />
        </div>

        {/* Coluna Direita: Lanches e Finalização */}
        <div className="col-lg-6 mb-4">
          <PainelLanches 
            lanchesDisponiveis={lanchesDisponiveis}
            carrinhoLanches={carrinhoLanches}
            adicionarLanche={adicionarLanche}
            removerLanche={removerLanche}
            totalLanches={totalLanches}
          />

          <ResumoPedido 
            totalGeral={totalGeral}
            onConfirmar={finalizarPedido}
            onCancelar={() => navegar('/sessoes')}
            desabilitado={lugaresDisponiveis <= 0 && quantidadeIngressos > 0}
          />
        </div>
      </div>
    </div>
  );
}
