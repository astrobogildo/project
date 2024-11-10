import React, { useState } from 'react';
import axios from 'axios';

function FormularioMedico({ pacientes, setPacientes, buscarPacientes }) {
  const [novoPaciente, setNovoPaciente] = useState({
    nome: '',
    idade: '',
    cpf: '',
    telefone: '',
    sintomas: '',
    diagnostico: '',
    medicamentos: []
  });

  const [novoMedicamento, setNovoMedicamento] = useState({
    nome: '',
    dosagem: '',
    instrucoes: ''
  });

  const [editandoPaciente, setEditandoPaciente] = useState(null);

  const limparFormulario = () => {
    setNovoPaciente({
      nome: '',
      idade: '',
      cpf: '',
      telefone: '',
      sintomas: '',
      diagnostico: '',
      medicamentos: []
    });
    setNovoMedicamento({
      nome: '',
      dosagem: '',
      instrucoes: ''
    });
    setEditandoPaciente(null);
  };

  const handleMudancaInputPaciente = (e) => {
    const { name, value } = e.target;
    setNovoPaciente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMudancaInputMedicamento = (e) => {
    const { name, value } = e.target;
    setNovoMedicamento(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const adicionarMedicamento = () => {
    if (novoMedicamento.nome && novoMedicamento.dosagem && novoMedicamento.instrucoes) {
      setNovoPaciente(prev => ({
        ...prev,
        medicamentos: [...prev.medicamentos, { ...novoMedicamento }]
      }));
      setNovoMedicamento({ nome: '', dosagem: '', instrucoes: '' });
    }
  };

  const removerMedicamento = (index) => {
    setNovoPaciente(prev => ({
      ...prev,
      medicamentos: prev.medicamentos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoPaciente) {
        await axios.put(`http://localhost:5000/pacientes/${editandoPaciente}`, novoPaciente);
      } else {
        await axios.post('http://localhost:5000/pacientes', novoPaciente);
      }
      await buscarPacientes();
      limparFormulario();
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
    }
  };

  const editarPaciente = (paciente) => {
    setEditandoPaciente(paciente._id);
    setNovoPaciente({
      nome: paciente.nome,
      idade: paciente.idade,
      cpf: paciente.cpf,
      telefone: paciente.telefone,
      sintomas: paciente.sintomas,
      diagnostico: paciente.diagnostico,
      medicamentos: paciente.medicamentos || []
    });
  };

  const cancelarEdicao = () => {
    limparFormulario();
  };

  const deletarPaciente = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/pacientes/${id}`);
      await buscarPacientes();
    } catch (error) {
      console.error('Erro ao deletar paciente:', error);
    }
  };

  return (
    <div>
      <h2>{editandoPaciente ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="nome"
            value={novoPaciente.nome}
            onChange={handleMudancaInputPaciente}
            placeholder="Nome do Paciente"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="idade"
            value={novoPaciente.idade}
            onChange={handleMudancaInputPaciente}
            placeholder="Idade"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="cpf"
            value={novoPaciente.cpf}
            onChange={handleMudancaInputPaciente}
            placeholder="CPF"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="telefone"
            value={novoPaciente.telefone}
            onChange={handleMudancaInputPaciente}
            placeholder="Telefone"
            required
          />
        </div>
        <div>
          <textarea
            name="sintomas"
            value={novoPaciente.sintomas}
            onChange={handleMudancaInputPaciente}
            placeholder="Sintomas"
            required
          />
        </div>
        <div>
          <textarea
            name="diagnostico"
            value={novoPaciente.diagnostico}
            onChange={handleMudancaInputPaciente}
            placeholder="Diagnóstico"
            required
          />
        </div>

        {/* Seção de Medicamentos */}
        <div>
          <h3>Adicionar Medicamento</h3>
          <input
            type="text"
            name="nome"
            value={novoMedicamento.nome}
            onChange={handleMudancaInputMedicamento}
            placeholder="Nome do Medicamento"
          />
          <input
            type="text"
            name="dosagem"
            value={novoMedicamento.dosagem}
            onChange={handleMudancaInputMedicamento}
            placeholder="Dosagem"
          />
          <input
            type="text"
            name="instrucoes"
            value={novoMedicamento.instrucoes}
            onChange={handleMudancaInputMedicamento}
            placeholder="Instruções"
          />
          <button type="button" onClick={adicionarMedicamento}>
            Adicionar Medicamento
          </button>
        </div>

        {/* Lista de Medicamentos */}
        <div>
          <h3>Medicamentos Adicionados</h3>
          <ul>
            {novoPaciente.medicamentos.map((med, index) => (
              <li key={index}>
                {med.nome} - {med.dosagem} - {med.instrucoes}
                <button type="button" onClick={() => removerMedicamento(index)}>
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <button type="submit">
            {editandoPaciente ? 'Atualizar Paciente' : 'Cadastrar Paciente'}
          </button>
          {editandoPaciente && (
            <button type="button" onClick={cancelarEdicao}>
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      {/* Lista de Pacientes */}
      <h2>Lista de Pacientes</h2>
      <ul>
        {pacientes.map((paciente) => (
          <li key={paciente._id}>
            <strong>Nome:</strong> {paciente.nome}<br />
            <strong>Idade:</strong> {paciente.idade}<br />
            <strong>CPF:</strong> {paciente.cpf}<br />
            <strong>Telefone:</strong> {paciente.telefone}<br />
            <strong>Sintomas:</strong> {paciente. sintomas}<br />
            <strong>Diagnóstico:</strong> {paciente.diagnostico}<br />
            <strong>Medicamentos:</strong>
            <ul>
              {paciente.medicamentos.map((med, index) => (
                <li key={index}>
                  {med.nome} - {med.dosagem} - {med.instrucoes}
                </li>
              ))}
            </ul>
            <button onClick={() => editarPaciente(paciente)}>Editar</button>
            <button onClick={() => deletarPaciente(paciente._id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FormularioMedico;