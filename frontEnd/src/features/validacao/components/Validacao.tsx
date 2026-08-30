import { useState } from 'react';
import { 
  useProntuariosPendentes, 
  useValidarProntuario, 
  useDevolverProntuario
} from '../api/api';
import './Validacao.css';

export default function Validacao() {
  const { data: pendentes, isLoading, isError } = useProntuariosPendentes();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const validarMutation = useValidarProntuario();
  const devolverMutation = useDevolverProntuario();

  const handleValidar = async () => {
    if (!selectedId) return;
    await validarMutation.mutateAsync({ id: selectedId, feedback });
    setFeedback('');
    setSelectedId(null);
  };

  const handleDevolver = async () => {
    if (!selectedId) return;
    if (!feedback.trim()) {
      alert('Por favor, adicione um feedback para devolver o prontuário.');
      return;
    }
    await devolverMutation.mutateAsync({ id: selectedId, feedback });
    setFeedback('');
    setSelectedId(null);
  };

  const filteredList = pendentes?.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.alunoNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(p.id).includes(searchTerm)
  );

  const selectedProntuario = pendentes?.find(p => p.id === selectedId);

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Portal do Professor</h1>
          <p className="page-subtitle">Validação de relatórios e encaminhamentos dos alunos</p>
        </div>
        <div className="header-badge">
          <span className="badge-icon">!</span>
          <span>{pendentes?.length || 0} Aguardando Validação</span>
        </div>
      </header>

      <div className="validacao-split">
        {/* Lado Esquerdo: Lista */}
        <div className="validacao-sidebar panel-container">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Buscar aluno ou paciente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="filter-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </button>
          </div>
          
          <div className="prontuarios-list">
            {isLoading && <p className="loading-msg">Carregando pendências...</p>}
            {isError && <p className="error-msg">Erro ao carregar prontuários.</p>}
            {filteredList?.length === 0 && !isLoading && <p className="empty-msg">Nenhum prontuário encontrado.</p>}
            
            {filteredList?.map(prontuario => (
              <div 
                key={prontuario.id} 
                className={`prontuario-card ${selectedId === prontuario.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedId(prontuario.id);
                  setFeedback('');
                }}
              >
                <div className="card-header-row">
                  <span className="card-id">AC-{prontuario.id}</span>
                  <span className="card-date">
                    {new Date(prontuario.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="card-patient">{prontuario.nome}</h3>
                <p className="card-student">👤 Aluno(a): {prontuario.alunoNome || 'Não informado'}</p>
                <span className="card-status-badge">AGUARDANDO VALIDAÇÃO</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lado Direito: Detalhes */}
        <div className="validacao-content panel-container">
          {selectedProntuario ? (
            <div className="details-panel">
              <div className="details-header">
                <div className="document-icon">📄</div>
                <div>
                  <h2>Registro de Acolhimento</h2>
                  <span className="ref-text">Ref.: AC-{selectedProntuario.id}</span>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <label>Paciente / Família</label>
                  <p>{selectedProntuario.nome}</p>
                </div>
                <div className="detail-item">
                  <label>Área de Atendimento</label>
                  <p>{selectedProntuario.areaAtendimento || selectedProntuario.clinicaAtendimento}</p>
                </div>
                <div className="detail-item">
                  <label>Aluno(a)</label>
                  <p>{selectedProntuario.alunoNome || 'Não informado'}</p>
                </div>
                <div className="detail-item">
                  <label>Data do Acolhimento</label>
                  <p>📅 {new Date(selectedProntuario.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="feedback-section">
                <h3>Relato do Aluno / Detalhes Iniciais</h3>
                <div className="relato-box">
                  <p>
                    Acolhimento registrado na {selectedProntuario.clinicaAtendimento}.
                    <br/>
                    Paciente: {selectedProntuario.nome}
                    <br/>
                    Atendimento para: {selectedProntuario.atendimentoParaQuem} {selectedProntuario.nomeOutraPessoa ? `(${selectedProntuario.nomeOutraPessoa})` : ''}
                  </p>
                </div>
              </div>

              <div className="feedback-section">
                <h3>💬 Feedback do Professor</h3>
                <textarea
                  placeholder="Adicione observações ou orientações para o aluno..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  disabled={validarMutation.isPending || devolverMutation.isPending}
                />
              </div>

              <div className="action-buttons">
                <button 
                  className="btn-devolver" 
                  onClick={handleDevolver}
                  disabled={validarMutation.isPending || devolverMutation.isPending}
                >
                  {devolverMutation.isPending ? 'Devolvendo...' : 'Devolver com Correções'}
                </button>
                <button 
                  className="btn-validar" 
                  onClick={handleValidar}
                  disabled={validarMutation.isPending || devolverMutation.isPending}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  {validarMutation.isPending ? 'Validando...' : 'Validar Acolhimento'}
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-selection">
              <div className="empty-icon">📂</div>
              <h3>Nenhum prontuário selecionado</h3>
              <p>Selecione um item na lista ao lado para avaliar e registrar seu feedback.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
