// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TelaInicial from './components/TelaInicial';
import ConsultaPaciente from './components/ConsultaPaciente';
import FormularioMedico from './components/FormularioMedico';
import NavBar from './components/NavBar';

function App() {
  const [currentPage, setCurrentPage] = useState('inicial');
  const [pacientes, setPacientes] = useState([]);
  const [userType, setUserType] = useState(null); // Corrigido para setUser Type

  const buscarPacientes = async () => {
    try {
        const response = await axios.get('http://localhost:5000/pacientes');
        setPacientes(response.data); // Atualiza a lista de pacientes
    } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
    }
};

  useEffect(() => {
    buscarPacientes();
  }, []);

  const handleSelectTipo = (tipo) => {
    setUserType(tipo); // Atualiza o tipo de usuário
    setCurrentPage(tipo === 'paciente' ? 'consulta' : 'formulario'); // Muda a página com base no tipo
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'inicial':
        return <TelaInicial onSelectTipo={handleSelectTipo} />;
      case 'consulta':
        return <ConsultaPaciente userType={userType} />; // Passa userType se necessário
      case 'formulario':
        return (
          <FormularioMedico
            pacientes={pacientes}
            setPacientes={setPacientes}
            buscarPacientes={buscarPacientes}
            userType={userType} // Passa userType se necessário
          />
        );
      default:
        return <TelaInicial onSelectTipo={handleSelectTipo} />;
    }
  };

  return (
    <div className="App">
      <NavBar setCurrentPage={setCurrentPage} />
      <div className="content">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;