import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'active fw-bold' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-film me-2 text-warning"></i>
          <span className="fw-bold">CineWeb</span>
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/filmes')}`} to="/filmes">Filmes</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/salas')}`} to="/salas">Salas</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/sessoes')}`} to="/sessoes">Sessões</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/lanches')}`} to="/lanches">Lanches</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/pedidos')}`} to="/pedidos">Pedidos</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
