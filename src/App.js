import React, { useState, useEffect } from "react";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "./services/api";

function App() {
  const [repositories,setRepositories] = useState([]);
  const [title,setTitle] = useState('');
  const [owner,setOwner] = useState('');
  const [techs,setTechs] = useState('');

  useEffect(() => {
    api.get('/repositories').then(res => {
      setRepositories(res.data);
    })
  }, []);

  async function handleAddRepository() {
    const { data } = await api.post('/repositories', {title,owner,techs:techs.split(',').map(s=>s.trim())});
    if (data.error) alert(data.error);
    else setRepositories([...repositories, data])
  }

  async function handleLike(id) {
    const { data } = await api.post('/repositories/'+id+'/like');
    if (data.error) alert(data.error);
    else setRepositories(repositories.map(r=> {
      if (r.id == id) r.likes = data.likes;
      return r;
    }))
  }

  async function handleRemoveRepository(id) {
    const res = await api.delete('/repositories/'+id);
    if (res.status == 204) setRepositories(repositories.filter(repo=>repo.id!=id))
    else alert('Repositório não encontrado');
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repo => (
          <li key={repo.id}>
            {repo.title} <span className="ml-2">{repo.likes} 👍</span>
            <button onClick={() => handleLike(repo.id)}>
              Like
            </button>
            <button onClick={() => handleRemoveRepository(repo.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>
      
      <div className="form-group">
        <label>Título do Projeto</label>
        <input className="form-control w-50" onChange={e=>setTitle(e.target.value)} value={title}/>
      </div>
      <div className="form-group">
        <label>Dono do projeto</label>
        <input className="form-control w-50" onChange={e=>setOwner(e.target.value)} value={owner}/>
      </div>
      <div className="form-group">
        <label>Tecnologias</label>
        <input className="form-control w-50" onChange={e=>setTechs(e.target.value)} value={techs}></input>
      </div>
      <div className="form-group">
        <button onClick={handleAddRepository}>Adicionar</button>
      </div>
    </div>
  );
}

export default App;
