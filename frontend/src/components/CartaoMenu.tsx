import { Link } from 'react-router-dom';

interface CartaoMenuProps {
  titulo: string;
  descricao: string;
  link: string;
  icone: string;
  classeIcone: string;
  classeBotao: string;
}

export function CartaoMenu({ titulo, descricao, link, icone, classeIcone, classeBotao }: CartaoMenuProps) {
  return (
    <div className="col-md-3">
      <div className="card h-100 shadow-sm hover-effect">
        <div className="card-body">
          <i className={`bi ${icone} display-4 ${classeIcone} mb-3`}></i>
          <h5 className="card-title">{titulo}</h5>
          <p className="card-text">{descricao}</p>
          <Link to={link} className={`btn ${classeBotao} stretched-link`}>Acessar</Link>
        </div>
      </div>
    </div>
  );
}
