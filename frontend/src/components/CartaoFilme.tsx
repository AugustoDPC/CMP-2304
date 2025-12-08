import type { Filme } from '../types';
import { Botao } from './Botao/Botao';
import { Cartao } from './Cards/Cartao';

interface CartaoFilmeProps {
  filme: Filme;
  aoExcluir: (id: string) => void;
}

export function CartaoFilme({ filme, aoExcluir }: CartaoFilmeProps) {
  return (
    <div className="col">
      <Cartao 
        titulo={filme.titulo}
        className="h-100"
        rodape={
          <Botao 
            variant="outline-danger" 
            tamanho="sm"
            onClick={() => filme.id && aoExcluir(filme.id)}
            title="Excluir Filme"
          >
            <i className="bi bi-trash"></i> Excluir
          </Botao>
        }
      >
        <h6 className="card-subtitle mb-2 text-muted">{filme.genero} - {filme.duracao} min</h6>
        <p className="card-text text-truncate" title={filme.sinopse}>{filme.sinopse}</p>
        <p className="card-text"><small className="text-muted">Classificação: {filme.classificacao}</small></p>
      </Cartao>
    </div>
  );
}
