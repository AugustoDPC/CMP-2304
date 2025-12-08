import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { sessaoSchema } from '../types';
import type { Filme, Sala } from '../types';
import { z } from 'zod';
import { Cabecalho } from '../components/Cabecalho';
import { CampoTexto } from '../components/Formulario/CampoTexto';
import { CampoSelect } from '../components/Formulario/CampoSelect';
import { Botao } from '../components/Botao/Botao';

export function SessaoForm() {
  const navigate = useNavigate();
  const [dadosFormulario, setDadosFormulario] = useState({
    filmeId: '',
    salaId: '',
    dataHora: ''
  });
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [erros, setErros] = useState<Record<string, string>>({});

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [filmesCarregados, salasCarregadas] = await Promise.all([
        api.listarFilmes(),
        api.listarSalas(),
      ]);
      setFilmes(filmesCarregados);
      setSalas(salasCarregadas);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar dados');
    }
  }

  function lidarComMudanca(e: React.ChangeEvent<any>) {
    const { name, value } = e.target;
    setDadosFormulario(prev => ({ ...prev, [name]: value }));
  }

  async function lidarComEnvio(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const sessaoValidada = sessaoSchema.parse(dadosFormulario);

      await api.criarSessao(sessaoValidada);
      
      alert('Sessão agendada com sucesso!');
      navigate('/sessoes');
      
    } catch (erro) {
      if (erro instanceof z.ZodError) {
        const novosErros: Record<string, string> = {};
        
        erro.issues.forEach(issue => {
          const field = issue.path[0];
          if (field) {
            novosErros[field.toString()] = issue.message;
          }
        });
        
        setErros(novosErros);
      } else {
        console.error(erro);
        alert('Erro ao salvar sessão');
      }
    }
  }

  return (
    <div>
      <Cabecalho titulo="Agendar Sessão" />
      
      <form onSubmit={lidarComEnvio} className="row g-3">
        <div className="col-md-6">
          <CampoSelect
             label="Filme"
             name="filmeId"
             value={dadosFormulario.filmeId}
             onChange={lidarComMudanca}
             erro={erros.filmeId}
             placeholder="Selecione um Filme..."
             opcoes={filmes.map(f => ({ label: f.titulo, value: f.id! }))}
          />
        </div>

        <div className="col-md-6">
          <CampoSelect
             label="Sala"
             name="salaId"
             value={dadosFormulario.salaId}
             onChange={lidarComMudanca}
             erro={erros.salaId}
             placeholder="Selecione uma Sala..."
             opcoes={salas.map(s => ({ label: `Sala ${s.numero} (${s.capacidade} lugares)`, value: s.id! }))}
          />
        </div>

        <div className="col-md-6">
           <CampoTexto
             label="Data e Hora"
             name="dataHora"
             type="datetime-local"
             value={dadosFormulario.dataHora}
             onChange={lidarComMudanca}
             erro={erros.dataHora}
           />
        </div>

        <div className="col-12 mt-4">
          <Botao type="submit" variant="success" className="me-2">
             <i className="bi bi-calendar-check me-2"></i>Agendar Sessão
          </Botao>
          <Botao variant="secondary" onClick={() => navigate('/sessoes')}>
             Cancelar
          </Botao>
        </div>
      </form>
    </div>
  );
}
