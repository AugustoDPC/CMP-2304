interface Props {
  totalGeral: number;
  onConfirmar: (e: React.FormEvent) => void;
  onCancelar: () => void;
  desabilitado: boolean;
}

export function ResumoPedido({ totalGeral, onConfirmar, onCancelar, desabilitado }: Props) {
  return (
    <div className="card shadow border-primary">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Total Pedido</h3>
          <h2 className="text-success fw-bold mb-0">R$ {totalGeral.toFixed(2)}</h2>
        </div>
        
        <div className="d-grid gap-2">
          <button 
            onClick={onConfirmar} 
            className="btn btn-success btn-lg"
            disabled={desabilitado}
          >
            <i className="bi bi-cart-check-fill me-2"></i>Confirmar Pedido
          </button>
          <button 
            type="button" 
            className="btn btn-outline-secondary" 
            onClick={onCancelar}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
