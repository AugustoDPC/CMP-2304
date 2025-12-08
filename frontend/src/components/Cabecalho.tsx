import { Link } from 'react-router-dom';

interface CabecalhoProps {
  titulo: string;
  textoBotao?: string;
  linkBotao?: string;
}

export function Cabecalho({ titulo, textoBotao, linkBotao }: CabecalhoProps) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>{titulo}</h2>
      {textoBotao && linkBotao && (
        <Link to={linkBotao} className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>{textoBotao}
        </Link>
      )}
    </div>
  );
}
