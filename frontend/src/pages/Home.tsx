import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="text-center mt-5">
      <h1 className="display-4 fw-bold mb-4">Bem-vindo ao CineWeb</h1>
      <p className="lead text-muted mb-5">
        Sistema de gerenciamento de cinema simples e eficiente.
      </p>

      <div className="row justify-content-center g-4">
        <div className="col-md-3">
          <div className="card h-100 shadow-sm hover-effect">
            <div className="card-body">
              <i className="bi bi-film display-4 text-primary mb-3"></i>
              <h5 className="card-title">Filmes</h5>
              <p className="card-text">Gerencie o catálogo de filmes em cartaz.</p>
              <Link to="/filmes" className="btn btn-outline-primary stretched-link">Acessar</Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 shadow-sm hover-effect">
            <div className="card-body">
              <i className="bi bi-door-open display-4 text-success mb-3"></i>
              <h5 className="card-title">Salas</h5>
              <p className="card-text">Administre as salas e capacidades.</p>
              <Link to="/salas" className="btn btn-outline-success stretched-link">Acessar</Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 shadow-sm hover-effect">
            <div className="card-body">
              <i className="bi bi-calendar-event display-4 text-info mb-3"></i>
              <h5 className="card-title">Sessões</h5>
              <p className="card-text">Agende sessões e venda ingressos.</p>
              <Link to="/sessoes" className="btn btn-outline-info stretched-link">Acessar</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
