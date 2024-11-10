// src/components/NavBar.js
import React from 'react';
import './NavBar.css';

function NavBar({ setCurrentPage }) {
  return (
    <nav style={{
      backgroundColor: '#f8f9fa',
      padding: '10px',
      marginBottom: '20px'
    }}>
      <ul style={{
        listStyle: 'none',
        display: 'flex',
        justifyContent: 'space-around',
        padding: 0
      }}>
        <li>
          <button onClick={() => setCurrentPage('inicial')}>Tela Inicial</button>
        </li>
        <li>
          <button onClick={() => setCurrentPage('consulta')}>Consulta de Paciente</button>
        </li>
        <li>
          <button onClick={() => setCurrentPage('formulario')}>Formulário Médico</button>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;