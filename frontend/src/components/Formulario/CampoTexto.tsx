import React from 'react';

interface Props {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<any>) => void;
  erro?: string;
  type?: 'text' | 'number' | 'date' | 'datetime-local' | 'email' | 'password';
  textarea?: boolean;
  rows?: number;
  step?: string;
  placeholder?: string;
  className?: string;
}

export function CampoTexto({ 
  label, 
  name, 
  value, 
  onChange, 
  erro, 
  type = 'text', 
  textarea = false, 
  rows = 3,
  step,
  placeholder,
  className = ''
}: Props) {
  const classes = `form-control ${erro ? 'is-invalid' : ''}`;
  const id = `campo-${name}`;

  return (
    <div className={className}>
      <label htmlFor={id} className="form-label">{label}</label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          className={classes}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          className={classes}
          value={value}
          onChange={onChange}
          step={step}
          placeholder={placeholder}
        />
      )}
      {erro && <div className="invalid-feedback">{erro}</div>}
    </div>
  );
}
