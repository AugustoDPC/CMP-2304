import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { salaSchema } from '../types';
import { z } from 'zod';

export function SalaForm() {
  const navigate = useNavigate();
  const [dadosFormulario, setDadosFormulario] = useState({
    numero: '',
    fileiras: '',
    assentosPorFileira: ''
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  function lidarComMudanca(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setDadosFormulario(prev => ({ ...prev, [name]: value }));
  }

  async function lidarComEnvio(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const fileiras = Number(dadosFormulario.fileiras);
      const assentos = Number(dadosFormulario.assentosPorFileira);
      const capacidade = fileiras * assentos;

      // Validar dados básicos
      if (fileiras <= 0 || assentos <= 0) {
        setErros({ ...erros, capacidade: "Defina fileiras e assentos válidos" });
        return;
      }

      const salaParaValidar = {
        numero: Number(dadosFormulario.numero),
        capacidade: capacidade
      };

      // Validar com Zod
      const salaValidada = salaSchema.parse(salaParaValidar);

      // Gerar matriz de poltronas (false = livre)
      const poltronas = Array.from({ length: fileiras }, () => 
        Array(assentos).fill(false)
      );

      // Enviar para API
      await api.criarSala({
        ...salaValidada,
        poltronas
      });
      
      alert('Sala cadastrada com sucesso!');
      navigate('/salas');
      
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
        alert('Erro ao salvar sala');
      }
    }
  }

  return (
    <div>
      <h2 className="mb-4">Nova Sala</h2>
      <form onSubmit={lidarComEnvio} className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Número da Sala</label>
          <input 
            type="number" 
            className={`form-control ${erros.numero ? 'is-invalid' : ''}`}
            name="numero" 
            value={dadosFormulario.numero} 
            onChange={lidarComMudanca} 
          />
          {erros.numero && <div className="invalid-feedback">{erros.numero}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Quantidade de Fileiras</label>
          <input 
            type="number" 
            className="form-control"
            name="fileiras" 
            value={dadosFormulario.fileiras} 
            onChange={lidarComMudanca} 
            required
            min="1"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Assentos por Fileira</label>
          <input 
            type="number" 
            className="form-control"
            name="assentosPorFileira" 
            value={dadosFormulario.assentosPorFileira} 
            onChange={lidarComMudanca} 
            required
            min="1"
          />
        </div>

        <div className="col-12">
          <div className="alert alert-info">
            Capacidade Total Calculada: <strong>{(Number(dadosFormulario.fileiras) || 0) * (Number(dadosFormulario.assentosPorFileira) || 0)}</strong> lugares
          </div>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-success">Salvar Sala</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/salas')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
