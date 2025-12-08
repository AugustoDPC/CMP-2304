import { Link } from 'react-router-dom';
import type { Sessao, Filme, Sala } from '../types';
import { Botao } from './Botao/Botao';
import { Cartao } from './Cards/Cartao';

type SessaoComDados = Sessao & {
  filme?: Filme;
  sala?: Sala;
};

interface CartaoSessaoProps {
  sessao: SessaoComDados;
  aoExcluir: (id: string) => void;
}

export function CartaoSessao({ sessao, aoExcluir }: CartaoSessaoProps) {
  return (
    <div className="col">
      <Cartao 
        className="h-100 border-start border-4 border-primary"
        titulo={sessao.filme?.titulo || 'Filme não encontrado'}
        rodape={
          <div className="d-flex justify-content-between w-100">
            <Link to={`/sessoes/${sessao.id}/vender`} className="btn btn-success btn-sm">
               <i className="bi bi-ticket-perforated me-1"></i>Vender Ingresso
            </Link>
            <Botao 
               variant="outline-danger" 
               tamanho="sm"
               onClick={() => sessao.id && aoExcluir(sessao.id)}
               title="Cancelar Sessão"
            >
               <i className="bi bi-trash"></i>
            </Botao>
          </div>
        }
      >
          <h6 className="card-subtitle mb-2 text-muted">
            Sala {sessao.sala?.numero || '?'} - {new Date(sessao.dataHora).toLocaleString()}
          </h6>
          <p className="card-text">
            <span className="badge bg-secondary me-2">{sessao.filme?.genero}</span>
            <span className="badge bg-info text-dark">{sessao.filme?.classificacao}</span>
          </p>
      </Cartao>
    </div>
  );
}
