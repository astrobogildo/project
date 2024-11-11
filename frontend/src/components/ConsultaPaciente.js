import React, { useState } from 'react';
import axios from 'axios';

function ConsultaPaciente() {
  const [cpf, setCpf] = useState('');
  const [paciente, setPaciente] = useState(null);
  const [erro, setErro] = useState('');

  const buscarPaciente = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/pacientes/cpf/${cpf}`);
      setPaciente(response.data);
      setErro('');
    } catch (error) {
      console.error('Erro ao buscar paciente:', error);
      setPaciente(null);
      setErro('Paciente não encontrado ou erro na busca.');
    }
  };

  return (
    <div>
      <h2>Consulta de Paciente</h2>
      <input
        type="text"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        placeholder="Digite o CPF do paciente"
      />
      <button onClick={buscarPaciente}>Buscar</button>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {paciente && (
        <div>
          <h3>Informações do Paciente</h3>
          <p><strong>Nome:</strong> {paciente.nome}</p>
          <p><strong>Idade:</strong> {paciente.idade}</p>
          <p><strong>CPF:</strong> {paciente.cpf}</p>
          <p><strong>Telefone:</strong> {paciente.telefone}</p>

          <h4>Sintomas:</h4>
          {Array.isArray(paciente.sintomas) && paciente.sintomas.length > 0 ? (
            <ul>
              {paciente.sintomas.map((sintoma, index) => (
                <li key={index}>{sintoma}</li>
              ))}
            </ul>
          ) : (
            <p>Nenhum sintoma encontrado.</p>
          )}

          <h4>Diagnóstico:</h4>
          {Array.isArray(paciente.diagnostico) && paciente.diagnostico.length > 0 ? (
            <ul>
              {paciente.diagnostico.map((diag, index) => (
                <li key={index}>{diag}</li>
              ))}
            </ul>
          ) : (
            <p>Nenhum diagnóstico encontrado.</p>
          )}

          <h4>Medicamentos:</h4>
          {Array.isArray(paciente.medicamentos) && paciente.medicamentos.length > 0 ? (
            <ul>
              {paciente.medicamentos.map((med, index) => (
                <li key={index}>
                  {med.nome} - Dosagem: {med.dosagem} - Instruções: {med.instrucoes}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum medicamento encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ConsultaPaciente;