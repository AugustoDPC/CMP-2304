import type { Filme, Sala, Sessao } from '../../types';

interface Props {
  sessao: Sessao;
  filme: Filme;
  sala: Sala;
  lugaresDisponiveis: number;
  tipoIngresso: 'INTEIRA' | 'MEIA';
  setTipoIngresso: (v: 'INTEIRA' | 'MEIA') => void;
  quantidadeIngressos: number;
  setQuantidadeIngressos: (v: number) => void;
  valorIngresso: string;
  totalIngressos: number;
}

export function PainelSessaoIngressos({
  filme,
  sala,
  sessao,
  lugaresDisponiveis,
  tipoIngresso,
  setTipoIngresso,
  quantidadeIngressos,
  setQuantidadeIngressos,
  valorIngresso,
  totalIngressos
}: Props) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">1. Sessão e Ingressos</h5>
      </div>
      <div className="card-body">
        <h5 className="card-title">{filme.titulo}</h5>
        <p className="card-text text-muted mb-1">
          Sala {sala.numero} | {new Date(sessao.dataHora).toLocaleString()}
        </p>
        <p className={lugaresDisponiveis > 0 ? 'text-success' : 'text-danger fw-bold'}>
          {lugaresDisponiveis} lugares livres
        </p>
        <hr />

        {lugaresDisponiveis <= 0 ? (
          <div className="alert alert-warning">Sessão Esgotada</div>
        ) : (
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Tipo</label>
              <select 
                className="form-select"
                value={tipoIngresso}
                onChange={(e) => setTipoIngresso(e.target.value as 'INTEIRA' | 'MEIA')}
              >
                <option value="INTEIRA">Inteira</option>
                <option value="MEIA">Meia-Entrada</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Qtd</label>
              <input 
                type="number" 
                className="form-control"
                value={quantidadeIngressos}
                onChange={(e) => setQuantidadeIngressos(Math.max(1, Number(e.target.value)))}
                min="1"
                max={lugaresDisponiveis}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Valor Unit.</label>
              <input 
                type="text" 
                className="form-control"
                value={valorIngresso}
                readOnly
              />
            </div>
            <div className="col-12 text-end">
              <h5 className="text-primary">Subtotal Ingressos: R$ {totalIngressos.toFixed(2)}</h5>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
