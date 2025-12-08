interface EstadoVazioProps {
  mensagem: string;
}

export function EstadoVazio({ mensagem }: EstadoVazioProps) {
  return (
    <div className="text-center py-5">
      <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
      <p className="text-muted fs-5">{mensagem}</p>
    </div>
  );
}
