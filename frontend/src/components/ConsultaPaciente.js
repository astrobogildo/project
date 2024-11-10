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
          <p>Nome: {paciente.nome}</p>
          <p>Idade: {paciente.idade}</p>
          <p>CPF: {paciente.cpf}</p>
          <p>Telefone: {paciente.telefone}</p>
          <p>Sintomas: {paciente.sintomas}</p>
          <p>Diagnóstico: {paciente.diagnostico}</p>
          <h4>Medicamentos:</h4>
          <ul>
            {paciente.medicamentos.map((med, index) => (
              <li key={index}>
                {med.nome} - Dosagem: {med.dosagem} - Instruções: {med.instrucoes}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ConsultaPaciente;