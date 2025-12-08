import React from 'react';

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' |
               'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: Variant;
  tamanho?: 'sm' | 'lg';
  className?: string;
}

export function Botao({ 
  children, 
  variant = 'primary', 
  tamanho, 
  className = '', 
  ...props 
}: Props) {
  const classeTamanho = tamanho ? `btn-${tamanho}` : '';
  const classes = `btn btn-${variant} ${classeTamanho} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
