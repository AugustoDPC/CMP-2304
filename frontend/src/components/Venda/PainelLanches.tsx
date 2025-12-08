import type { Lanche } from '../../types';

export interface ItemLanche {
  lanche: Lanche;
  quantidade: number;
}

interface Props {
  lanchesDisponiveis: Lanche[];
  carrinhoLanches: ItemLanche[];
  adicionarLanche: (l: Lanche) => void;
  removerLanche: (id: string) => void;
  totalLanches: number;
}

export function PainelLanches({
  lanchesDisponiveis,
  carrinhoLanches,
  adicionarLanche,
  removerLanche,
  totalLanches
}: Props) {
  
  const pegarQuantidade = (id: string) => carrinhoLanches.find(i => i.lanche.id === id)?.quantidade || 0;

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body p-0">
        {lanchesDisponiveis.length === 0 ? (
          <p className="p-3 text-muted text-center">Nenhum lanche disponível.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {lanchesDisponiveis.map(lanche => (
              <li key={lanche.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold">{lanche.nome}</div>
                  <small className="text-muted">R$ {lanche.preco.toFixed(2)}</small>
                </div>
                <div className="btn-group btn-group-sm">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => lanche.id && removerLanche(lanche.id)}
                    disabled={pegarQuantidade(lanche.id!) === 0}
                  >-</button>
                  <button type="button" className="btn btn-outline-secondary" disabled>
                    {pegarQuantidade(lanche.id!)}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-primary"
                    onClick={() => adicionarLanche(lanche)}
                  >+</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="p-3 text-end border-top bg-light">
          <h5 className="text-warning text-dark-shadow">Subtotal Lanches: R$ {totalLanches.toFixed(2)}</h5>
        </div>
      </div>
    </div>
  );
}
