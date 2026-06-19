import React, { useState } from 'react';
import { Search, Filter, FileText, Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../libs/api-client';
import PacientesModal from './PacientesModal';
import './Pacientes.css';

const STATUS_OPCOES = {
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  EM_ANALISE: 'Em Análise'
} as const;

const CLINICA_OPCOES = {
  CEILANDIA: 'Clínica Escola Ceilândia',
  ASA_SUL: 'Clínica Escola Asa Sul'
} as const;

function Pacientes() {
  const navigate = useNavigate();
  const [pacienteSelecionado, setPacienteSelecionado] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clinicaFilter, setClinicaFilter] = useState('');

  const { data: pacientes = [], isLoading, isError } = useQuery({
    queryKey: ['pacientes'],
    queryFn: () => apiClient.get('/prontuarios'),
  });

  const pacientesFiltrados = pacientes.filter((paciente: any) => {
    const query = searchQuery.toLowerCase();
    const nomeMatch = paciente.nome?.toLowerCase().includes(query) || false;
    const cpfMatch = paciente.cpf?.includes(query) || false;
    const matchesSearch = !searchQuery || nomeMatch || cpfMatch;

    const pacienteStatus = paciente.status || STATUS_OPCOES.EM_ANALISE;
    const matchesStatus = !statusFilter || pacienteStatus === statusFilter;

    const matchesClinica = !clinicaFilter || paciente.clinicaAtendimento === clinicaFilter;

    return matchesSearch && matchesStatus && matchesClinica;
  });

  const getIniciais = (nome: string) => {
    if (!nome) return '??';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  const formatarData = (dataStr: string) => {
    if (!dataStr) return '--';
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR');
  };

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
          <div className="filter-bar">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Pesquisar por Nome ou CPF..." 
            className="search-input bar" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          </div>

          <div className="filter-buttons">
            <select 
              className="btn-filter select-filter" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status (Todos)</option>
              <option value={STATUS_OPCOES.APROVADO}>{STATUS_OPCOES.APROVADO}</option>
              <option value={STATUS_OPCOES.REPROVADO}>{STATUS_OPCOES.REPROVADO}</option>
              <option value={STATUS_OPCOES.EM_ANALISE}>{STATUS_OPCOES.EM_ANALISE}</option>
            </select>

            <select 
              className="btn-filter select-filter" 
              value={clinicaFilter} 
              onChange={(e) => setClinicaFilter(e.target.value)}
            >
              <option value="">Clínica (Todas)</option>
              <option value={CLINICA_OPCOES.CEILANDIA}>Ceilândia</option>
              <option value={CLINICA_OPCOES.ASA_SUL}>Asa Sul</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pacientes-table-container">
        {isLoading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#555' }}>Carregando pacientes...</div>
        ) : isError ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'red' }}>Erro ao carregar dados.</div>
        ) : (
          <table className="pacientes-table">
            <thead>
              <tr>
                <th>PACIENTE</th>
                <th>CPF</th>
                <th>CADASTRADO EM</th>
                <th>STATUS DA TRIAGEM</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {pacientesFiltrados.map((paciente: any) => {
                const status = paciente.status || STATUS_OPCOES.EM_ANALISE;
                const statusClass = status === STATUS_OPCOES.APROVADO ? 'aprovado' : status === STATUS_OPCOES.REPROVADO ? 'reprovado' : 'analise';
                
                return (
                <tr key={paciente.id}>
                  <td>
                    <div className="paciente-info">
                      <div className="avatar">{getIniciais(paciente.nome)}</div>
                      <div className="paciente-details">
                        <span className="paciente-nome">{paciente.nome}</span>
                        <span className="paciente-area">{paciente.areaAtendimento || paciente.clinicaAtendimento}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-secondary">{paciente.cpf}</td>
                  <td className="text-secondary">{formatarData(paciente.createdAt)}</td>
                  <td>
                    <span className={`status-badge ${statusClass}`}>{status}</span>
                  </td>
                  <td>
                    <div className="acoes-container">
                      <button 
                        className="btn-icon text-purple" 
                        onClick={() => setPacienteSelecionado(paciente)}
                        title="Ver detalhes"
                      >
                        <FileText size={18} />
                      </button>
                      <button className="btn-icon text-green" title="Agendar">
                        <Calendar size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
              {pacientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}>
                    Nenhum paciente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <PacientesModal 
        paciente={pacienteSelecionado} 
        onClose={() => setPacienteSelecionado(null)} 
      />
    </div>
  );
}

export default Pacientes;
