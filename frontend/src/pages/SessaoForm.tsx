import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { sessaoSchema, type Filme, type Sala } from '../types';
import { z } from 'zod';

export function SessaoForm() {
  const navigate = useNavigate();
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  
  const [dadosFormulario, setDadosFormulario] = useState({
    filmeId: '',
    salaId: '',
    dataHora: ''
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  useEffect(() => {
    carregarOpcoes();
  }, []);

  async function carregarOpcoes() {
    try {
      const [dadosFilmes, dadosSalas] = await Promise.all([
        api.listarFilmes(),
        api.listarSalas()
      ]);
      setFilmes(dadosFilmes);
      setSalas(dadosSalas);
    } catch (erro) {
      console.error('Erro ao carregar opções:', erro);
      alert('Erro ao carregar filmes e salas');
    }
  }

  function lidarComMudanca(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
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

    } catch (erro: unknown) {


      if (erro instanceof z.ZodError) {
        const novosErros: Record<string, string> = {};

        erro.issues.forEach(issue => {
          const field = issue.path[0]; 

          if (typeof field === "string") {
            novosErros[field] = issue.message;
          }
        });

        setErros(novosErros);
        return;
      }

      console.error(erro);
      alert('Erro ao agendar sessão');
    }
  }


  return (
    <div>
      <h2 className="mb-4">Agendar Sessão</h2>
      <form onSubmit={lidarComEnvio} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Filme</label>
          <select 
            className={`form-select ${erros.filmeId ? 'is-invalid' : ''}`}
            name="filmeId" 
            value={dadosFormulario.filmeId} 
            onChange={lidarComMudanca}
          >
            <option value="">Selecione um filme...</option>
            {filmes.map(filme => (
              <option key={filme.id} value={filme.id}>
                {filme.titulo}
              </option>
            ))}
          </select>
          {erros.filmeId && <div className="invalid-feedback">{erros.filmeId}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Sala</label>
          <select 
            className={`form-select ${erros.salaId ? 'is-invalid' : ''}`}
            name="salaId" 
            value={dadosFormulario.salaId} 
            onChange={lidarComMudanca}
          >
            <option value="">Selecione uma sala...</option>
            {salas.map(sala => (
              <option key={sala.id} value={sala.id}>
                Sala {sala.numero} ({sala.capacidade} lugares)
              </option>
            ))}
          </select>
          {erros.salaId && <div className="invalid-feedback">{erros.salaId}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Data e Horário</label>
          <input 
            type="datetime-local" 
            className={`form-control ${erros.dataHora ? 'is-invalid' : ''}`}
            name="dataHora" 
            value={dadosFormulario.dataHora} 
            onChange={lidarComMudanca} 
          />
          {erros.dataHora && <div className="invalid-feedback">{erros.dataHora}</div>}
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-success">Agendar Sessão</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/sessoes')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
