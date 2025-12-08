import React from 'react';

interface Props {
  children: React.ReactNode;
  titulo?: string;
  rodape?: React.ReactNode;
  className?: string;
  corDeFundo?: string;
  tamanhoSombra?: 'sm' | 'md' | 'lg' | 'none';
}

export function Cartao({ 
  children, 
  titulo, 
  rodape, 
  className = '',
  tamanhoSombra = 'sm'
}: Props) {
  const classeSombra = tamanhoSombra !== 'none' ? `shadow-${tamanhoSombra}` : '';
  
  return (
    <div className={`card ${classeSombra} ${className} h-100`}>
      {titulo && (
        <div className="card-header bg-transparent border-bottom-0 pb-0 pt-3">
          <h5 className="card-title fw-bold mb-0">{titulo}</h5>
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
      {rodape && (
        <div className="card-footer bg-transparent border-top-0 pt-0 text-end">
          {rodape}
        </div>
      )}
    </div>
  );
}
