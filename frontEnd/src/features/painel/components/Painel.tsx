import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, User, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { apiClient } from '../../../libs/api-client';
import PacientesModal from '../../pacientes/components/PacientesModal';
import './Painel.css';

export default function Painel() {
  const navigate = useNavigate();
  const [pacienteSelecionado, setPacienteSelecionado] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: pacientes = [], isLoading, isError } = useQuery({
    queryKey: ['pacientes'],
    queryFn: () => apiClient.get('/prontuarios'),
  });

  // Cálculo das métricas
  const totalVidas = pacientes.length;
  
  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();
  const noMes = pacientes.filter((p: any) => {
    const dataCriacao = new Date(p.createdAt);
    return dataCriacao.getMonth() === mesAtual && dataCriacao.getFullYear() === anoAtual;
  }).length;

  const aguardandoTriagem = pacientes.filter((p: any) => 
    p.status === 'Aguardando Triagem' || p.status === 'Aguardando Validação' || p.status === 'Em Análise'
  ).length;

  // Filtragem dos recentes
  const recentes = pacientes
    .filter((p: any) => {
      const query = searchQuery.toLowerCase();
      return (
        (p.nome?.toLowerCase().includes(query)) ||
        (p.cpf?.includes(query)) ||
        (String(p.id).includes(query))
      );
    })
    .slice(0, 4); // Pega os 4 primeiros (a API já traz ordenado do mais recente)

  const getIniciais = (nome: string) => {
    if (!nome) return '??';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    let statusClass = 'andamento';
    let displayStatus = status || 'Em andamento';
    
    if (status === 'Aprovado') {
      statusClass = 'aprovado';
    } else if (status === 'Reprovado' || status === 'Recusado' || status === 'Ajuste Necessário') {
      statusClass = 'reprovado';
    } else if (status === 'Aguardando Triagem' || status === 'Aguardando Validação') {
      statusClass = 'aguardando';
      displayStatus = 'Aguardando';
    } else {
      displayStatus = 'Em andamento';
    }

    return <span className={`status-badge-pill ${statusClass}`}>{displayStatus}</span>;
  };

  const formatarDataResumida = (dataStr: string) => {
    if (!dataStr) return '';
    const data = new Date(dataStr);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);
    
    const timeString = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    if (data.toDateString() === hoje.toDateString()) {
      return `Hoje, ${timeString}`;
    } else if (data.toDateString() === ontem.toDateString()) {
      return `Ontem, ${timeString}`;
    }
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Painel de Acolhimento</h1>
          <p className="page-subtitle">Bem-vindo de volta! Como podemos ajudar nossa comunidade hoje?</p>
        </div>
        <button className="btn-novo-acolhimento" onClick={() => navigate('/novoAcolhimento')}>
          <Plus size={20} className="icon-plus" />
          Novo Acolhimento
        </button>
      </header>

      {/* Barra de Busca e Filtros */}
      <div className="pacientes-filters-bar" style={{ marginBottom: '32px' }}>
        <div className="search-input-container">
          <div className="filter-bar">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por nome do paciente, CPF ou número do acolhimento..." 
              className="search-input bar" 
              style={{ border: 'none', height: 'auto', marginRight: 0 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn-filter" style={{ marginLeft: '16px' }}>
            Filtros
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-container">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper purple">
            <User size={28} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total de Vidas Apoiadas</span>
            <span className="kpi-value">{isLoading ? '...' : totalVidas}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper green">
            <CheckCircle size={28} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Acolhimentos no Mês</span>
            <span className="kpi-value">{isLoading ? '...' : noMes}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper yellow">
            <Clock size={28} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Aguardando Triagem</span>
            <span className="kpi-value">{isLoading ? '...' : aguardandoTriagem}</span>
          </div>
        </div>
      </div>

      {/* Acolhimentos Recentes */}
      <div className="panel-container">
        <div className="recentes-header">
          <h2 className="recentes-title">Acolhimentos Recentes</h2>
          <button className="ver-todos-btn" onClick={() => navigate('/pacientes')}>Ver todos</button>
        </div>
        
        <div className="recentes-list">
          {isLoading && <div style={{ padding: '24px', textAlign: 'center' }}>Carregando recentes...</div>}
          {isError && <div style={{ padding: '24px', textAlign: 'center', color: 'red' }}>Erro ao carregar dados.</div>}
          {!isLoading && recentes.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>Nenhum acolhimento encontrado.</div>
          )}
          
          {recentes.map((p: any) => (
            <div key={p.id} className="recente-item" onClick={() => setPacienteSelecionado(p)}>
              <div className="recente-info-group">
                <div className="recente-avatar">{getIniciais(p.nome)}</div>
                <div className="recente-details">
                  <h4>{p.nome}</h4>
                  <p className="recente-meta">
                    <span className="clinic-icon">🏛️</span> 
                    {p.clinicaAtendimento === 'Clínica Escola Ceilândia' ? 'Ceilândia' : 'Asa Sul'}
                    <span style={{ margin: '0 4px' }}>•</span>
                    {formatarDataResumida(p.createdAt)}
                    <span style={{ margin: '0 4px' }}>•</span>
                    AC-{p.id}
                  </p>
                </div>
              </div>
              <div className="recente-actions">
                {getStatusBadge(p.status)}
                <ChevronRight size={20} className="arrow-icon" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <PacientesModal 
        paciente={pacienteSelecionado} 
        onClose={() => setPacienteSelecionado(null)} 
      />
    </div>
  );
}
