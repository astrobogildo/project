// src/components/NavBar.js
import React from 'react';
import './NavBar.css'; // Vamos criar este arquivo de estilo

function NavBar({ setCurrentPage }) {
  return (
    <nav className="navbar">
      <ul>
        <li><button onClick={() => setCurrentPage('inicial')}>Tela Inicial</button></li>
        <li><button onClick={() => setCurrentPage('consulta')}>Consulta de Paciente</button></li>
        <li><button onClick={() => setCurrentPage('formulario')}>Formulário Médico</button></li>
      </ul>
    </nav>
  );
}

export default NavBar;