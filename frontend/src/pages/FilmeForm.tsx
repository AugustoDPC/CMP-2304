import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { filmeSchema } from '../types';
import { z } from 'zod';
import { CampoTexto } from '../components/Formulario/CampoTexto';
import { CampoSelect } from '../components/Formulario/CampoSelect';
import { Botao } from '../components/Botao/Botao';

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

  function lidarComMudanca(e: React.ChangeEvent<any>) {
    const { name, value } = e.target;
    setDadosFormulario(prev => ({ ...prev, [name]: value }));
  }

  async function lidarComEnvio(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      // Converter tipos para validação
      const filmeParaValidar = {
        ...dadosFormulario,
        duracao: Number(dadosFormulario.duracao),
      };

      // Validar com Zod
      const filmeValidado = filmeSchema.parse(filmeParaValidar);

      // Enviar para API
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
          <CampoTexto
            label="Título"
            name="titulo"
            value={dadosFormulario.titulo}
            onChange={lidarComMudanca}
            erro={erros.titulo}
          />
        </div>

        <div className="col-md-6">
          <CampoSelect
            label="Gênero"
            name="genero"
            value={dadosFormulario.genero}
            onChange={lidarComMudanca}
            erro={erros.genero}
            opcoes={[
              { label: 'Ação', value: 'Ação' },
              { label: 'Comédia', value: 'Comédia' },
              { label: 'Drama', value: 'Drama' },
              { label: 'Terror', value: 'Terror' },
              { label: 'Ficção', value: 'Ficção' }
            ]}
          />
        </div>

        <div className="col-md-4">
          <CampoTexto
            label="Duração (minutos)"
            name="duracao"
            type="number"
            value={dadosFormulario.duracao}
            onChange={lidarComMudanca}
            erro={erros.duracao}
          />
        </div>

        <div className="col-md-4">
          <CampoSelect
            label="Classificação"
            name="classificacao"
            value={dadosFormulario.classificacao}
            onChange={lidarComMudanca}
            erro={erros.classificacao}
            opcoes={[
               { label: 'Livre', value: 'Livre' },
               { label: '10 anos', value: '10 anos' },
               { label: '12 anos', value: '12 anos' },
               { label: '14 anos', value: '14 anos' },
               { label: '16 anos', value: '16 anos' },
               { label: '18 anos', value: '18 anos' }
            ]}
          />
        </div>

        <div className="col-12">
          <CampoTexto
            label="Sinopse"
            name="sinopse"
            textarea
            rows={3}
            value={dadosFormulario.sinopse}
            onChange={lidarComMudanca}
            erro={erros.sinopse}
          />
        </div>

        <div className="col-md-6">
          <CampoTexto
            label="Data Início Exibição"
            name="dataInicialExibicao"
            type="date"
            value={dadosFormulario.dataInicialExibicao}
            onChange={lidarComMudanca}
            erro={erros.dataInicialExibicao}
          />
        </div>

        <div className="col-md-6">
          <CampoTexto
            label="Data Final Exibição"
            name="dataFinalExibicao"
            type="date"
            value={dadosFormulario.dataFinalExibicao}
            onChange={lidarComMudanca}
            erro={erros.dataFinalExibicao}
          />
        </div>

        <div className="col-12 mt-4">
          <Botao type="submit" variant="success" className="me-2">
            <i className="bi bi-check-lg me-2"></i>Salvar Filme
          </Botao>
          <Botao variant="secondary" onClick={() => navigate('/filmes')}>
            Cancelar
          </Botao>
        </div>
      </form>
    </div>
  );
}
