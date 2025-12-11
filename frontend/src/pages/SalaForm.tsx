import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { salaSchema } from '../types';
import { z } from 'zod';
import { Cabecalho } from '../components/Cabecalho';
import { CampoTexto } from '../components/Formulario/CampoTexto';
import { Botao } from '../components/Botao/Botao';

export function SalaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  
  const [dadosFormulario, setDadosFormulario] = useState({
    numero: '',
    capacidade: ''
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      carregarSala(id);
    }
  }, [id]);

  async function carregarSala(id: string) {
    setCarregando(true);
    try {
      const sala = await api.obterSala(id);
      setDadosFormulario({
        numero: String(sala.numero),
        capacidade: String(sala.capacidade)
      });
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar sala');
      navigate('/salas');
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
      const salaParaValidar = {
        numero: Number(dadosFormulario.numero),
        capacidade: Number(dadosFormulario.capacidade),
        poltronas: id ? [] : [[]] 
      };

      const salaValidada = salaSchema.parse(salaParaValidar);

      if (id) {
        await api.atualizarSala(id, salaValidada);
        alert('Sala atualizada com sucesso!');
      } else {
        await api.criarSala(salaValidada);
        alert('Sala cadastrada com sucesso!');
      }
      navigate('/salas');
      
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
        alert('Erro ao salvar sala');
      }
    }
  }

  if (carregando) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <Cabecalho titulo={id ? "Editar Sala" : "Nova Sala"} />
      
      <form onSubmit={lidarComEnvio} className="row g-3">
        <div className="col-md-6">
          <CampoTexto
            label="Número da Sala"
            name="numero"
            type="number"
            value={dadosFormulario.numero}
            onChange={lidarComMudanca}
            erro={erros.numero}
          />
        </div>

        <div className="col-md-6">
          <CampoTexto
            label="Capacidade de Pessoas"
            name="capacidade"
            type="number"
            value={dadosFormulario.capacidade}
            onChange={lidarComMudanca}
            erro={erros.capacidade}
          />
        </div>
        
        <div className="col-12 mt-4">
          <Botao type="submit" variant="success" className="me-2">
            <i className="bi bi-check-lg me-2"></i>Salvar Sala
          </Botao>
          <Botao variant="secondary" onClick={() => navigate('/salas')}>
            Cancelar
          </Botao>
        </div>
      </form>
    </div>
  );
}
