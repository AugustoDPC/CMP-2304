import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { lancheSchema } from '../types';
import { z } from 'zod';
import { Cabecalho } from '../components/Cabecalho';
import { Carregando } from '../components/Carregando';
import { CampoTexto } from '../components/Formulario/CampoTexto';
import { Botao } from '../components/Botao/Botao';

export function LancheForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: '',
    descricao: '',
    preco: ''
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      carregarLanche(id);
    }
  }, [id]);

  async function carregarLanche(id: string) {
    setCarregando(true);
    try {
      const lanche = await api.obterLanche(id);
      setDadosFormulario({
        nome: lanche.nome,
        descricao: lanche.descricao || '',
        preco: String(lanche.preco)
      });
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar lanche');
      navigate('/lanches');
    } finally {
      setCarregando(false);
    }
  }

  function lidarComMudanca(e: React.ChangeEvent<any>) {
    const { name, value } = e.target;
    setDadosFormulario(prev => ({ ...prev, [name]: value }));
  }

  async function lidarComEnvio(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const lancheParaValidar = {
        nome: dadosFormulario.nome,
        descricao: dadosFormulario.descricao,
        preco: Number(dadosFormulario.preco)
      };

      const lancheValidado = lancheSchema.parse(lancheParaValidar);

      if (id) {
        await api.atualizarLanche(id, lancheValidado);
        alert('Lanche atualizado com sucesso!');
      } else {
        await api.criarLanche(lancheValidado);
        alert('Lanche cadastrado com sucesso!');
      }
      navigate('/lanches');
      
    } catch (erro) {
      if (erro instanceof z.ZodError) {
        const novosErros: Record<string, string> = {};
        erro.issues.forEach(issue => {
          if (issue.path[0]) {
            novosErros[issue.path[0].toString()] = issue.message;
          }
        });
        setErros(novosErros);
      } else {
        console.error(erro);
        alert('Erro ao salvar lanche');
      }
    }
  }

  if (carregando) return <Carregando />;

  return (
    <div>
      <Cabecalho titulo={id ? "Editar Lanche" : "Novo Lanche"} />
      
      <form onSubmit={lidarComEnvio} className="row g-3">
        <div className="col-md-6">
          <CampoTexto
            label="Nome do Lanche"
            name="nome"
            value={dadosFormulario.nome}
            onChange={lidarComMudanca}
            erro={erros.nome}
          />
        </div>

        <div className="col-md-6">
          <CampoTexto
            label="Preço (R$)"
            name="preco"
            type="number"
            step="0.01"
            value={dadosFormulario.preco}
            onChange={lidarComMudanca}
            erro={erros.preco}
          />
        </div>

        <div className="col-12">
          <CampoTexto
            label="Descrição"
            name="descricao"
            textarea
            rows={3}
            value={dadosFormulario.descricao}
            onChange={lidarComMudanca}
            erro={erros.descricao}
          />
        </div>

        <div className="col-12 mt-4">
          <Botao type="submit" variant="success" className="me-2">
            <i className="bi bi-check-lg me-2"></i>Salvar
          </Botao>
          <Botao variant="secondary" onClick={() => navigate('/lanches')}>
            Cancelar
          </Botao>
        </div>
      </form>
    </div>
  );
}
