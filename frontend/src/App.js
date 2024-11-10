import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const response = await axios.get('http://localhost:5000/projects');
    setProjects(response.data);
  };

  const handleAddProject = async () => {
    await axios.post('http://localhost:5000/projects', newProject);
    setNewProject({ name: '', description: '' });
    fetchProjects();
  };

  return (
    <div>
      <h1>Lista de Projetos</h1>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>{project.name}: {project.description}</li>
        ))}
      </ul>
      <h2>Adicionar Novo Projeto</h2>
      <input
        type="text"
        placeholder="Nome do Projeto"
        value={newProject.name}
        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Descrição do Projeto"
        value={newProject.description}
        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
      />
      <button onClick={handleAddProject}>Adicionar Projeto</button>
    </div>
  );
}

export default App;