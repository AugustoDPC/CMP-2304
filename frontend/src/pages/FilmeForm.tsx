import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { filmeSchema } from '../types';
import { z } from 'zod';

export function FilmeForm() {
  const navigate = useNavigate();
  const [dadosFormulario, setDadosFormulario] = useState({
    titulo: '',
    sinopse: '',
    duracao: '',
    classificacao: '',
    genero: '',
    dataInicialExibicao: '',
    dataFinalExibicao: ''
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  function lidarComMudanca(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setDadosFormulario(prev => ({ ...prev, [name]: value }));
  }

  async function lidarComEnvio(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const filmeParaValidar = {
        ...dadosFormulario,
        duracao: Number(dadosFormulario.duracao),
      };

      const filmeValidado = filmeSchema.parse(filmeParaValidar);

      await api.criarFilme(filmeValidado);
      
      alert('Filme cadastrado com sucesso!');
      navigate('/filmes');
      
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
        alert('Erro ao salvar filme');
      }
    }
  }

  return (
    <div>
      <h2 className="mb-4">Novo Filme</h2>
      <form onSubmit={lidarComEnvio} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Título</label>
          <input 
            type="text" 
            className={`form-control ${erros.titulo ? 'is-invalid' : ''}`}
            name="titulo" 
            value={dadosFormulario.titulo} 
            onChange={lidarComMudanca} 
          />
          {erros.titulo && <div className="invalid-feedback">{erros.titulo}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Gênero</label>
          <select 
            className={`form-select ${erros.genero ? 'is-invalid' : ''}`}
            name="genero" 
            value={dadosFormulario.genero} 
            onChange={lidarComMudanca}
          >
            <option value="">Selecione...</option>
            <option value="Ação">Ação</option>
            <option value="Comédia">Comédia</option>
            <option value="Drama">Drama</option>
            <option value="Terror">Terror</option>
            <option value="Ficção">Ficção</option>
          </select>
          {erros.genero && <div className="invalid-feedback">{erros.genero}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Duração (minutos)</label>
          <input 
            type="number" 
            className={`form-control ${erros.duracao ? 'is-invalid' : ''}`}
            name="duracao" 
            value={dadosFormulario.duracao} 
            onChange={lidarComMudanca} 
          />
          {erros.duracao && <div className="invalid-feedback">{erros.duracao}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Classificação</label>
          <select 
            className={`form-select ${erros.classificacao ? 'is-invalid' : ''}`}
            name="classificacao" 
            value={dadosFormulario.classificacao} 
            onChange={lidarComMudanca}
          >
            <option value="">Selecione...</option>
            <option value="Livre">Livre</option>
            <option value="10 anos">10 anos</option>
            <option value="12 anos">12 anos</option>
            <option value="14 anos">14 anos</option>
            <option value="16 anos">16 anos</option>
            <option value="18 anos">18 anos</option>
          </select>
          {erros.classificacao && <div className="invalid-feedback">{erros.classificacao}</div>}
        </div>

        <div className="col-12">
          <label className="form-label">Sinopse</label>
          <textarea 
            className={`form-control ${erros.sinopse ? 'is-invalid' : ''}`}
            name="sinopse" 
            rows={3}
            value={dadosFormulario.sinopse} 
            onChange={lidarComMudanca} 
          ></textarea>
          {erros.sinopse && <div className="invalid-feedback">{erros.sinopse}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Data Início Exibição</label>
          <input 
            type="date" 
            className={`form-control ${erros.dataInicialExibicao ? 'is-invalid' : ''}`}
            name="dataInicialExibicao" 
            value={dadosFormulario.dataInicialExibicao} 
            onChange={lidarComMudanca} 
          />
          {erros.dataInicialExibicao && <div className="invalid-feedback">{erros.dataInicialExibicao}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Data Final Exibição</label>
          <input 
            type="date" 
            className={`form-control ${erros.dataFinalExibicao ? 'is-invalid' : ''}`}
            name="dataFinalExibicao" 
            value={dadosFormulario.dataFinalExibicao} 
            onChange={lidarComMudanca} 
          />
          {erros.dataFinalExibicao && <div className="invalid-feedback">{erros.dataFinalExibicao}</div>}
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-success">Salvar Filme</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/filmes')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
