// src/components/TelaInicial/TelaInicial.js
import React from 'react';
import './TelaInicial.css';

function TelaInicial({ onSelectTipo }) {
  return (
    <div className="tela-inicial">
      <h1>Selecione o tipo de usuário</h1>
      <div className="button-container">
        <button className="tipo-button" onClick={() => onSelectTipo('paciente')}>
          Paciente
        </button>
        <button className="tipo-button" onClick={() => onSelectTipo('medico')}>
          Médico
        </button>
      </div>
    </div>
  );
}

export default TelaInicial;