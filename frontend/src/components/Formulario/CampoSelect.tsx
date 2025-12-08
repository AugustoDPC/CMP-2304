import React from 'react';

interface Opcao {
  label: string;
  value: string | number;
}

interface Props {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<any>) => void;
  erro?: string;
  opcoes: Opcao[];
  className?: string;
  placeholder?: string;
}

export function CampoSelect({ 
  label, 
  name, 
  value, 
  onChange, 
  erro, 
  opcoes,
  className = '',
  placeholder = 'Selecione...'
}: Props) {
  const classes = `form-select ${erro ? 'is-invalid' : ''}`;
  const id = `select-${name}`;

  return (
    <div className={className}>
      <label htmlFor={id} className="form-label">{label}</label>
      <select
        id={id}
        name={name}
        className={classes}
        value={value}
        onChange={onChange}
      >
        <option value="">{placeholder}</option>
        {opcoes.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
      {erro && <div className="invalid-feedback">{erro}</div>}
    </div>
  );
}
