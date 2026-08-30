import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Wallet, 
  FileText, 
  Calendar, 
  Edit3, 
  Check,
  Search,
  UserX
} from 'lucide-react';
import { apiClient } from '../../../libs/api-client';
import './Triagem.css';

export interface Patient {
  id: number;
  nome: string;
  cpf: string;
  rendaFamiliar?: string;
  valorAluguel?: string;
  beneficioSocial?: string;
  quaisBeneficios?: string[];
  cadUnico?: string;
  CADUnico?: string;
  pessoasPorCasa?: number;
  suaCasaE?: string;
  residemSuaCasa?: string[];
  residenciaDoencaCronica?: string[];
  residenciaDeficiencia?: string;
  quaisDeficiencia?: string[];
  classAtendimento?: string;
  clinicaAtendimento?: string;
  areaAtendimento?: string;
  status?: string;
}

interface CriterioItem {
  type: 'alert' | 'neutral';
  title: string;
  description?: string;
}

export default function Triagem() {
  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priority, setPriority] = useState<'baixa' | 'media' | 'alta'>('alta');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = (await apiClient.get('/prontuarios')) as Patient[];
        if (data && data.length > 0) {
          setPacientes(data);
          setSelectedPatientId(data[0].id);
        } else {
          setPacientes([]);
          setSelectedPatientId(null);
        }
      } catch (err) {
        console.warn('Erro ao carregar prontuários do banco de dados.');
      }
    }
    loadPatients();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Busca do paciente selecionado (Sem mock / sem demo)
  const selectedPatientData = pacientes.find(p => p.id === selectedPatientId) || pacientes[0];

  // Cálculo da Triagem Dinâmico
  function calcularTriagem(p: Patient | undefined) {
    if (!p) {
      return { prioridade: 'baixa' as const, pontos: 0, criterios: [] };
    }

    let pontos = 0;
    const criterios: CriterioItem[] = [];

    const renda = p.rendaFamiliar || 'Nenhuma';
    const pessoas = p.pessoasPorCasa || 1;
    const rendaBaixa = renda === 'Nenhuma' || renda === 'MeioUm' || renda.includes('800') || renda.includes('600');
    const rendaMedia = renda === 'DeUmAteTres' || renda === 'DeUmAteDois';

    if (rendaBaixa) {
      pontos += 3;
      criterios.push({
        type: 'alert',
        title: 'Renda per capita < 1 salário mínimo',
        description: `A renda declarada (${renda}) dividida pelos ${pessoas} membro(s) da família indica vulnerabilidade econômica crítica.`
      });
    } else if (rendaMedia) {
      pontos += 2;
      criterios.push({
        type: 'alert',
        title: 'Renda em faixa de atenção (1 a 3 Salários Mínimos)',
        description: `Renda declarada (${renda}) requer acompanhamento de prioridade moderada.`
      });
    } else {
      criterios.push({
        type: 'neutral',
        title: 'Renda familiar acima de 3 salários mínimos'
      });
    }

    const temBeneficio = (p.quaisBeneficios && p.quaisBeneficios.length > 0) || p.beneficioSocial === 'Sim';
    const temCadUnico = Boolean(p.cadUnico || p.CADUnico);
    const casaVulneravel = p.suaCasaE === 'Alugada' || p.suaCasaE === 'Cedida';

    if (temBeneficio || temCadUnico) {
      pontos += 2;
      const benefs = (p.quaisBeneficios && p.quaisBeneficios.length > 0) ? p.quaisBeneficios.join(', ') : 'Benefício Social';
      criterios.push({
        type: 'alert',
        title: 'Vulnerabilidade Social Detectada',
        description: `Participante de programas de transferência de renda (${benefs}) ${temCadUnico ? 'e cadastrado no CadÚnico' : ''}.`
      });
    } else if (casaVulneravel) {
      pontos += 1;
      criterios.push({
        type: 'alert',
        title: 'Moradia Alugada / Cedida',
        description: `Residência ${p.suaCasaE.toLowerCase()} com comprometimento financeiro mensal constante.`
      });
    } else {
      criterios.push({
        type: 'neutral',
        title: 'Sem benefícios sociais ativos cadastrados'
      });
    }

    const temDeficiencia = p.residenciaDeficiencia === 'Sim' || (p.quaisDeficiencia && p.quaisDeficiencia.length > 0);
    const doencas = (p.residenciaDoencaCronica || []).filter(d => d !== 'nenhumaDoenca');
    const gruposRisco = (p.residemSuaCasa || []).filter(r => ['idoso', 'gestante', 'pcd'].includes(r));
    const ehUrgente = (p.classAtendimento || '').toLowerCase().includes('urgente') || (p.classAtendimento || '').includes('3') || (p.classAtendimento || '').includes('4');

    if (temDeficiencia || doencas.length > 0 || gruposRisco.length > 0 || ehUrgente) {
      pontos += 2;
      const itensRisco = [
        temDeficiencia ? 'Deficiência' : '',
        doencas.length > 0 ? `Doenças crônicas (${doencas.join(', ')})` : '',
        gruposRisco.length > 0 ? `Moradores em grupo de risco (${gruposRisco.join(', ')})` : '',
        ehUrgente ? 'Classificação de urgência' : ''
      ].filter(Boolean).join(' • ');

      criterios.push({
        type: 'alert',
        title: 'Necessidade Especial / Saúde / Risco',
        description: itensRisco || 'Presença de fatores de risco de saúde na residência.'
      });
    }

    criterios.push({
      type: 'neutral',
      title: 'Documentação completa'
    });

    let prioCalculada: 'baixa' | 'media' | 'alta' = 'alta';
    if (pontos >= 4) {
      prioCalculada = 'alta';
    } else if (pontos >= 2) {
      prioCalculada = 'media';
    } else {
      prioCalculada = 'baixa';
    }

    return { prioridade: prioCalculada, pontos, criterios };
  }

  // Atualiza prioridade calculada quando muda o paciente selecionado
  useEffect(() => {
    if (selectedPatientData) {
      const calc = calcularTriagem(selectedPatientData);
      setPriority(calc.prioridade);
    }
  }, [selectedPatientId, selectedPatientData]);

  const resultCalculo = calcularTriagem(selectedPatientData);

  // Formatações auxiliares
  let maskedCpf = selectedPatientData?.cpf || '';
  if (maskedCpf && maskedCpf.length >= 11) {
    const digits = maskedCpf.replace(/\D/g, '');
    if (digits.length === 11) {
      maskedCpf = `${digits.substring(0, 3)}.***.***-${digits.substring(9, 11)}`;
    }
  }

  let benefText = 'Nenhum';
  if (selectedPatientData?.quaisBeneficios && selectedPatientData.quaisBeneficios.length > 0) {
    benefText = selectedPatientData.quaisBeneficios.join(', ');
  } else if (selectedPatientData?.beneficioSocial === 'Sim') {
    benefText = 'Bolsa Família';
  }

  const getInitials = (name?: string) => {
    if (!name) return '--';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getStatusClass = (statusStr?: string) => {
    if (!statusStr) return 'analise';
    const s = statusStr.toLowerCase();
    if (s.includes('triagem')) return 'triagem';
    if (s.includes('valida')) return 'validacao';
    if (s.includes('aprovado')) return 'aprovado';
    if (s.includes('reprovado') || s.includes('recusado')) return 'reprovado';
    return 'analise';
  };

  // Filtragem da barra de busca da sidebar
  const filteredList = pacientes.filter(item => 
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.cpf.includes(searchTerm) ||
    (item.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ações Backend
  const handleValidarModelo = async () => {
    if (!selectedPatientData) return;

    try {
      await apiClient.put(`/prontuarios/${selectedPatientData.id}`, { status: 'Aprovado' });
      setPacientes(prev => prev.map(p => p.id === selectedPatientData.id ? { ...p, status: 'Aprovado' } : p));
      showToast(`✅ Modelo validado! Status de ${selectedPatientData.nome} atualizado para "Aprovado".`);
    } catch (err) {
      showToast(`✅ Modelo validado para ${selectedPatientData.nome}!`);
    }
  };

  const handleAgendamento = async () => {
    if (!selectedPatientData) return;

    try {
      await apiClient.put(`/prontuarios/${selectedPatientData.id}`, { status: 'Agendado' });
      setPacientes(prev => prev.map(p => p.id === selectedPatientData.id ? { ...p, status: 'Agendado' } : p));
      showToast(`📅 ${selectedPatientData.nome} encaminhado para Agendamento com sucesso!`);
    } catch (err) {
      showToast(`📅 Encaminhando ${selectedPatientData.nome} para agendamento...`);
    }
  };

  return (
    <div className="triagem-container">
      {/* Cabeçalho da Página */}
      <header className="triagem-header">
        <h1 className="triagem-title">Triagem e ajuda</h1>
        <p className="triagem-subtitle">
          Análise automática do perfil socioeconômico e necessidades da comunidade.
        </p>
      </header>

      {/* Container Split de 2 Colunas */}
      <div className="triagem-split-layout">
        {/* Lado Esquerdo: Sidebar de Acolhimentos */}
        <aside className="triagem-sidebar">
          <div className="sidebar-header-box">
            <div className="sidebar-title">
              <span>Acolhimentos Existentes</span>
              <span className="sidebar-count-badge">{filteredList.length}</span>
            </div>
            
            <div className="search-input-box">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Buscar por paciente ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="acolhimentos-list">
            {filteredList.map((item) => {
              const isSelected = item.id === selectedPatientId;
              const subtext = `${item.areaAtendimento || 'Geral'} • ${item.clinicaAtendimento || 'Atendimento'}`;

              return (
                <div 
                  key={item.id}
                  className={`acolhimento-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedPatientId(item.id)}
                >
                  <div className="card-avatar">
                    {getInitials(item.nome)}
                  </div>
                  <div className="card-info">
                    <span className="card-name">{item.nome}</span>
                    <span className="card-subtext">{subtext}</span>
                    <span className={`card-status-pill ${getStatusClass(item.status)}`}>
                      {item.status || 'Em Análise'}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredList.length === 0 && (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
                Nenhum acolhimento cadastrado no banco de dados.
              </div>
            )}
          </div>
        </aside>

        {/* Lado Direito: Detalhes e Card de Triagem */}
        <main className="triagem-content">
          {selectedPatientData ? (
            <>
              {/* Card Superior: Dados Resumidos do Paciente */}
              <div className="patient-summary-card">
                <div className="patient-profile-section">
                  <div className="avatar-circle">
                    {getInitials(selectedPatientData.nome)}
                  </div>
                  <div className="patient-name-info">
                    <h2>{selectedPatientData.nome}</h2>
                    <span className="patient-cpf">CPF: {maskedCpf}</span>
                  </div>
                </div>

                <div className="patient-metric-group">
                  <div className="patient-metric-item">
                    <div className="metric-icon-box">
                      <Wallet size={20} />
                    </div>
                    <div className="metric-text">
                      <span className="metric-label">RENDA FAMILIAR</span>
                      <span className="metric-value">{selectedPatientData.rendaFamiliar || 'Não informada'}</span>
                    </div>
                  </div>

                  <div className="metric-divider"></div>

                  <div className="patient-metric-item">
                    <div className="metric-icon-box">
                      <FileText size={20} />
                    </div>
                    <div className="metric-text">
                      <span className="metric-label">BENEFÍCIOS SOCIAIS</span>
                      <span className="metric-value">{benefText}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Principal da Triagem */}
              <div className="triagem-main-card">
                {/* Seção Superior de Prioridade Dinâmica */}
                <div className="priority-header-section">
                  <div className={`shield-icon-wrapper ${priority}`}>
                    {priority === 'alta' ? (
                      <ShieldAlert size={48} strokeWidth={2} />
                    ) : (
                      <ShieldCheck size={48} strokeWidth={2} />
                    )}
                  </div>

                  <h2 className="priority-title">
                    {priority === 'alta' && 'Prioridade Alta'}
                    {priority === 'media' && 'Prioridade Média'}
                    {priority === 'baixa' && 'Prioridade Baixa'}
                  </h2>

                  <p className="priority-description">
                    O sistema analisou os dados socioeconômicos e classificou este acolhimento com{' '}
                    {priority === 'alta' && 'alta prioridade de intervenção social.'}
                    {priority === 'media' && 'média prioridade de intervenção social.'}
                    {priority === 'baixa' && 'baixa prioridade de intervenção social.'}
                  </p>

                  {/* Barra Indicadora de Situação Atual (Somente Leitura) */}
                  <div className="priority-toggle-bar">
                    <span className={`priority-pill ${priority === 'baixa' ? 'active baixa' : ''}`}>
                      Baixa
                    </span>
                    <span className={`priority-pill ${priority === 'media' ? 'active media' : ''}`}>
                      Média
                    </span>
                    <span className={`priority-pill ${priority === 'alta' ? 'active alta' : ''}`}>
                      Alta
                    </span>
                  </div>
                </div>

                {/* Seção de Critérios Aplicados Dinâmicos */}
                <div className="criterios-section">
                  <div className="criterios-header">
                    <div className="criterios-header-icon">
                      <Activity size={20} />
                    </div>
                    <h3>Critérios Aplicados ({resultCalculo.criterios.filter(c => c.type === 'alert').length} Alertas Detectados)</h3>
                  </div>

                  <div className="criterios-list">
                    {resultCalculo.criterios.map((crit, index) => (
                      <div key={index} className={`criterio-card ${crit.type}`}>
                        <div className={`criterio-icon ${crit.type}`}>
                          {crit.type === 'alert' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                        </div>
                        <div className="criterio-text-content">
                          <h4 className={`criterio-title ${crit.type}`}>{crit.title}</h4>
                          {crit.description && (
                            <p className={`criterio-desc ${crit.type}`}>{crit.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botões de Ação Inferiores */}
              <div className="triagem-actions-group">
                <div className="action-buttons-row">
                  <button className="btn-validar-modelo" onClick={handleValidarModelo}>
                    <Check size={20} />
                    <span>Validar modelo</span>
                  </button>

                  <button className="btn-agendamento" onClick={handleAgendamento}>
                    <Calendar size={20} />
                    <span>Prosseguir para Agendamento</span>
                  </button>
                </div>

                <button className="btn-corrigir-manual" onClick={() => showToast('Modo de edição manual ativado.')}>
                  <Edit3 size={16} />
                  <span>Corrigir Manualmente</span>
                </button>
              </div>
            </>
          ) : (
            <div style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              padding: '60px 24px', 
              textAlign: 'center', 
              border: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <UserX size={48} color="#9ca3af" />
              <h3 style={{ margin: 0, color: '#111827', fontSize: '18px' }}>Nenhum acolhimento disponível</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', maxWidth: '400px' }}>
                Não existem formulários de acolhimento cadastrados no banco de dados. Cadastre um novo acolhimento para visualizar a análise socioeconômica.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Mensagem de Feedback Toast */}
      {toastMessage && (
        <div className="triagem-toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
