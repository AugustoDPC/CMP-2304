import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Filmes } from './pages/Filmes';
import { FilmeForm } from './pages/FilmeForm';
import { Salas } from './pages/Salas';
import { SalaForm } from './pages/SalaForm';
import { Sessoes } from './pages/Sessoes';
import { SessaoForm } from './pages/SessaoForm';
import { VendaIngresso } from './pages/VendaIngresso';
import { Home } from './pages/Home';
import { Lanches } from './pages/Lanches';
import { LancheForm } from './pages/LancheForm';
import { Pedidos } from './pages/Pedidos';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filmes" element={<Filmes />} />
          <Route path="/filmes/novo" element={<FilmeForm />} />
          
          <Route path="/salas" element={<Salas />} />
          <Route path="/salas/novo" element={<SalaForm />} />
          
          <Route path="/sessoes" element={<Sessoes />} />
          <Route path="/sessoes/novo" element={<SessaoForm />} />
          <Route path="/sessoes" element={<Sessoes />} />
          <Route path="/sessoes/novo" element={<SessaoForm />} />
          <Route path="/sessoes/:id/vender" element={<VendaIngresso />} />

          <Route path="/lanches" element={<Lanches />} />
          <Route path="/lanches/novo" element={<LancheForm />} />
          
          <Route path="/pedidos" element={<Pedidos />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
