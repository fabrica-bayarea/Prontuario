import React from 'react';
import { Search, Filter, FileText, Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Pacientes.css';

const mockPacientes = [
  {
    id: 1,
    iniciais: 'MS',
    nome: 'Maria Silva',
    area: 'Psicologia',
    cpf: '123.***.***-89',
    ultimoAcolhimento: '10/05/2026',
    status: 'Aprovado',
    corStatus: 'aprovado',
  },
  {
    id: 2,
    iniciais: 'JP',
    nome: 'João Pereira',
    area: 'Direito',
    cpf: '987.***.***-12',
    ultimoAcolhimento: '08/05/2026',
    status: 'Em Análise',
    corStatus: 'analise',
  },
  {
    id: 3,
    iniciais: 'AS',
    nome: 'Ana Souza',
    area: 'Nutrição',
    cpf: '456.***.***-34',
    ultimoAcolhimento: '01/05/2026',
    status: 'Reprovado',
    corStatus: 'reprovado',
  },
  {
    id: 4,
    iniciais: 'CG',
    nome: 'Carlos Gomes',
    area: 'Serviço Social',
    cpf: '789.***.***-56',
    ultimoAcolhimento: '12/04/2026',
    status: 'Aprovado',
    corStatus: 'aprovado',
  },
];

function Pacientes() {
  const navigate = useNavigate();

  return (
    <div className="pacientes-container">
      <header className="pacientes-header">
        <div>
          <h1 className="pacientes-title">Gestão de Pacientes</h1>
          <p className="pacientes-subtitle">Visualize e gerencie os acolhimentos da comunidade.</p>
        </div>
        <button className="btn-novo-acolhimento" onClick={() => navigate('/novoAcolhimento')}>
          <Plus size={20} className="icon-plus" />
          Novo Acolhimento
        </button>
      </header>

      <div className="pacientes-filters-bar">
        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Pesquisar por Nome ou CPF..." className="search-input" />
        </div>
        <div className="filter-buttons">
          <button className="btn-filter">
            <Filter size={18} />
            Status (Todos)
          </button>
          <button className="btn-filter">
            <Filter size={18} />
            Clínica (Todas)
          </button>
        </div>
      </div>

      <div className="pacientes-table-container">
        <table className="pacientes-table">
          <thead>
            <tr>
              <th>PACIENTE</th>
              <th>CPF</th>
              <th>ÚLTIMO ACOLHIMENTO</th>
              <th>STATUS DA TRIAGEM</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {mockPacientes.map((paciente) => (
              <tr key={paciente.id}>
                <td>
                  <div className="paciente-info">
                    <div className="avatar">{paciente.iniciais}</div>
                    <div className="paciente-details">
                      <span className="paciente-nome">{paciente.nome}</span>
                      <span className="paciente-area">{paciente.area}</span>
                    </div>
                  </div>
                </td>
                <td className="text-secondary">{paciente.cpf}</td>
                <td className="text-secondary">{paciente.ultimoAcolhimento}</td>
                <td>
                  <span className={`status-badge ${paciente.corStatus}`}>{paciente.status}</span>
                </td>
                <td>
                  <div className="acoes-container">
                    <button className="btn-icon text-purple">
                      <FileText size={18} />
                    </button>
                    <button className="btn-icon text-green">
                      <Calendar size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Pacientes;
