import React, { useState } from 'react';
import axios from 'axios';

function FormularioMedico({ pacientes, setPacientes, buscarPacientes }) {
  const [novoPaciente, setNovoPaciente] = useState({
    nome: '',
    idade: '',
    cpf: '',
    telefone: '',
    medicamentos: [],
    sintomas: [],
    diagnostico: []
  });

  const [novoMedicamento, setNovoMedicamento] = useState({
    nome: '',
    dosagem: '',
    instrucoes: ''
  });

  const [novoSintoma, setNovoSintoma] = useState('');
  const [novoDiagnostico, setNovoDiagnostico] = useState('');

  const [editandoPaciente, setEditandoPaciente] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [cpfPesquisa, setCpfPesquisa] = useState('');
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null);

  const limparFormulario = () => {
    setNovoPaciente({
      nome: '',
      idade: '',
      cpf: '',
      telefone: '',
      medicamentos: [],
      sintomas: [],
      diagnostico: []
    });
    setNovoMedicamento({ nome: '', dosagem: '', instrucoes: '' });
    setNovoSintoma('');
    setNovoDiagnostico('');
    setEditandoPaciente(null);
    setMensagem('');
    setPacienteEncontrado(null);
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

  const adicionarSintoma = () => {
    if (novoSintoma) {
      setNovoPaciente(prev => ({
        ...prev,
        sintomas: [...prev.sintomas, novoSintoma]
      }));
      setNovoSintoma('');
    }
  };

  const removerSintoma = (index) => {
    setNovoPaciente(prev => ({
      ...prev,
      sintomas: prev.sintomas.filter((_, i) => i !== index)
    }));
  };

  const adicionarDiagnostico = () => {
    if (novoDiagnostico) {
      setNovoPaciente(prev => ({
        ...prev,
        diagnostico: [...prev.diagnostico, novoDiagnostico]
      }));
      setNovoDiagnostico('');
    }
  };

  const removerDiagnostico = (index) => {
    setNovoPaciente(prev => ({
      ...prev,
      diagnostico: prev.diagnostico.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoPaciente) {
        await axios.put(`http://localhost:5000/pacientes/${editandoPaciente}`, novoPaciente);
        setMensagem('Paciente atualizado com sucesso!');
      } else {
        await axios.post('http://localhost:5000/pacientes', novoPaciente);
        setMensagem('Paciente cadastrado com sucesso!');
      }
      await buscarPacientes();
      limparFormulario();
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
      setMensagem('Erro ao salvar paciente. Tente novamente.');
    }
  };

  const pesquisarPaciente = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/pacientes/cpf/${cpfPesquisa}`);
      setPacienteEncontrado(response.data);
      setMensagem('');
    } catch (error) {
      console.error('Erro ao buscar paciente:', error);
      setPacienteEncontrado(null);
      setMensagem('Paciente não encontrado.');
    }
  };

  const editarPaciente = (paciente) => {
    setEditandoPaciente(paciente._id);
    setNovoPaciente({
      nome: paciente.nome,
      idade: paciente.idade,
      cpf: paciente.cpf,
      telefone: paciente.telefone,
      medicamentos: paciente.medicamentos,
      sintomas: Array.isArray(paciente.sintomas) ? paciente.sintomas : [],
      diagnostico: Array.isArray(paciente.diagnostico) ? paciente.diagnostico : []
    });
  };

  const cancelarEdicao = () => {
    limparFormulario();
  };

  const deletarPaciente = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/pacientes/${id}`);
      await buscarPacientes();
      setMensagem('Paciente deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar paciente:', error);
      setMensagem('Erro ao deletar paciente. Tente novamente.');
    }
  };

  return (
    <div>
      <h2>{editandoPaciente ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}</h2>
      {mensagem && <p>{mensagem}</p>}
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
          <h4>Medicamentos</h4>
          {novoPaciente.medicamentos.map((med, index) => (
            <div key={index}>
              <p>{med.nome} - {med.dosagem} - {med.instrucoes} <button type="button" onClick={() => removerMedicamento(index)}>Remover</button></p>
            </div>
          ))}
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
          <button type="button" onClick={adicionarMedicamento}>Adicionar Medicamento</button>
        </div>
        <div>
          <h4>Sintomas</h4>
          {novoPaciente.sintomas.map((sintoma, index) => (
            <div key={index}>
              <p>{sintoma} <button type="button" onClick={() => removerSintoma(index)}>Remover</button></p>
            </div>
          ))}
          <input
            type="text"
            value={novoSintoma}
            onChange={(e) => setNovoSintoma(e.target.value)}
            placeholder="Adicionar Sintoma"
          />
          <button type="button" onClick={adicionarSintoma}>Adicionar Sintoma</button>
        </div>
        <div>
          <h4>Diagnósticos</h4>
          {novoPaciente.diagnostico.map((diag, index) => (
            <div key={index}>
              <p>{diag} <button type="button" onClick={() => removerDiagnostico(index)}>Remover</button></p>
            </div>
          ))}
          <input
            type="text"
            value={novoDiagnostico}
            onChange={(e) => setNovoDiagnostico(e.target.value)}
            placeholder="Adicionar Diagnóstico"
          />
          <button type="button" onClick={adicionarDiagnostico}>Adicionar Diagnóstico</button>
        </div>
        <div>
          <button type="submit">
            {editandoPaciente ? 'Atualizar Paciente ' : 'Cadastrar Paciente'}
          </button>
          {editandoPaciente && <button type="button" onClick={cancelarEdicao}>Cancelar</button>}
        </div>
      </form>

      {/* Barra de Pesquisa */}
      <div>
        <h3>Pesquisar Paciente pelo CPF</h3>
        <input
          type="text"
          value={cpfPesquisa}
          onChange={(e) => setCpfPesquisa(e.target.value)}
          placeholder="Digite o CPF"
        />
        <button onClick={pesquisarPaciente}>Pesquisar</button>
      </div>

      {/* Detalhes do Paciente Encontrado */}
      {pacienteEncontrado && (
        <div>
          <h3>Detalhes do Paciente</h3>
          <p><strong>Nome:</strong> {pacienteEncontrado.nome}</p>
          <p><strong>Idade:</strong> {pacienteEncontrado.idade}</p>
          <p><strong>CPF:</strong> {pacienteEncontrado.cpf}</p>
          <p><strong>Telefone:</strong> {pacienteEncontrado.telefone}</p>
          <h4>Sintomas</h4>
          <ul>
            {Array.isArray(pacienteEncontrado.sintomas) ? pacienteEncontrado.sintomas.map((sintoma, index) => (
              <li key={index}>{sintoma}</li>
            )) : <li>Nenhum sintoma registrado.</li>}
          </ul>
          <h4>Diagnósticos</h4>
          <ul>
            {Array.isArray(pacienteEncontrado.diagnostico) ? pacienteEncontrado.diagnostico.map((diag, index) => (
              <li key={index}>{diag}</li>
            )) : <li>Nenhum diagnóstico registrado.</li>}
          </ul>
          <h4>Medicamentos</h4>
          <ul>
            {Array.isArray(pacienteEncontrado.medicamentos) ? pacienteEncontrado.medicamentos.map((med, index) => (
              <li key={index}>
                {med.nome} - {med.dosagem} - {med.instrucoes}
              </li>
            )) : <li>Nenhum medicamento registrado.</li>}
          </ul>
          <button onClick={() => editarPaciente(pacienteEncontrado)}>Editar</button>
          <button onClick={() => deletarPaciente(pacienteEncontrado._id)}>Deletar</button>
        </div>
      )}

      {/* Lista de Pacientes */}
      <h2>Lista de Pacientes</h2>
<ul>
  {pacientes.length > 0 ? (
    pacientes.map((paciente) => (
      <li key={paciente._id}>
        <strong>Nome:</strong> {paciente.nome}<br />
        <strong>Idade:</strong> {paciente.idade}<br />
        <strong>CPF:</strong> {paciente.cpf}<br />
        <strong>Telefone:</strong> {paciente.telefone}<br />
        <h4>Sintomas</h4>
        <ul>
          {Array.isArray(paciente.sintomas) ? paciente.sintomas.map((sintoma, index) => (
            <li key={index}>{sintoma}</li>
          )) : <li>Nenhum sintoma registrado.</li>}
        </ul>
        <h4>Diagnósticos</h4>
        <ul>
          {Array.isArray(paciente.diagnostico) ? paciente.diagnostico.map((diag, index) => (
            <li key={index}>{diag}</li>
          )) : <li>Nenhum diagnóstico registrado.</li>}
        </ul>
        <h4>Medicamentos</h4>
        <ul>
          {Array.isArray(paciente.medicamentos) ? paciente.medicamentos.map((med, index) => (
            <li key={index}>
              {med.nome} - {med.dosagem} - {med.instrucoes}
            </li>
          )) : <li>Nenhum medicamento registrado.</li>}
        </ul>
        <button onClick={() => editarPaciente(paciente)}>Editar</button>
        <button onClick={() => deletarPaciente(paciente._id)}>Deletar</button>
      </li>
    ))
  ) : <li>Nenhum paciente cadastrado.</li>}
</ul>
    </div>
  );
}

export default FormularioMedico;