import { useMeuProntuario } from '../../questionario/api/api';
import './MeusDados.css';

export default function MeusDados() {
  const { data: prontuario, isLoading, isError, error } = useMeuProntuario();

  if (isLoading) {
    return (
      <div className="page-container loading">
        <div className="spinner"></div>
        <p>Carregando seus dados...</p>
      </div>
    );
  }

  if (isError || !prontuario) {
    const is404 = (error as any)?.response?.status === 404;
    return (
      <div className="page-container error">
        {is404 ? (
          <p>Nenhum dado para aquela pesquisa foi encontrado.</p>
        ) : (
          <>
            <h2>Ops!</h2>
            <p>{(error as any)?.response?.data?.message || 'Não foi possível carregar o seu prontuário.'}</p>
          </>
        )}
      </div>
    );
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    'Aguardando Validação': { label: 'Aguardando Validação', color: '#8B5CF6' },
    'Ajuste Necessário': { label: 'Ajuste Necessário', color: '#EF4444' },
    'Em Análise': { label: 'Em Análise', color: '#3B82F6' },
    'Aguardando Triagem': { label: 'Aguardando Triagem', color: '#F59E0B' },
    'Aprovado': { label: 'Aprovado', color: '#10B981' },
    'Recusado': { label: 'Recusado', color: '#EF4444' },
    'Reprovado': { label: 'Reprovado', color: '#EF4444' },
  };

  const statusConfig = statusMap[prontuario.status] || statusMap['Em Análise'];

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Olá, {prontuario.nome.split(' ')[0]}!</h1>
          <p className="page-subtitle">Acompanhe o andamento do seu acolhimento e seus dados cadastrados.</p>
        </div>
      </header>

      <section className="status-section panel-container" style={{ padding: '24px', marginBottom: '24px' }}>
        <div className="status-card" style={{ borderLeftColor: statusConfig.color }}>
          <div className="status-info">
            <h3>Status do Acolhimento</h3>
            <span className="status-badge" style={{ backgroundColor: `${statusConfig.color}20`, color: statusConfig.color }}>
              {statusConfig.label}
            </span>
          </div>
          <div className="status-description">
            {prontuario.status === 'Aguardando Validação' && 'Seus dados foram recebidos e estão aguardando validação do professor responsável.'}
            {prontuario.status === 'Ajuste Necessário' && 'Seu prontuário foi devolvido pelo professor. Por favor, faça os ajustes necessários e reenvie.'}
            {prontuario.status === 'Em Análise' && 'Seus dados foram validados e estão sendo analisados pela nossa equipe clínica.'}
            {prontuario.status === 'Aguardando Triagem' && 'Você foi pré-aprovado! Em breve entraremos em contato para a triagem.'}
            {prontuario.status === 'Aprovado' && 'Seu atendimento foi aprovado.'}
          </div>
        </div>
      </section>

      <section className="dados-grid">
        <div className="dados-card panel-container" style={{ padding: '24px' }}>
          <h3>Dados Pessoais</h3>
          <ul>
            <li><strong>Nome Completo:</strong> {prontuario.nome}</li>
            <li><strong>CPF:</strong> {prontuario.cpf}</li>
            <li><strong>Data de Nascimento:</strong> {prontuario.dataNascimento} ({prontuario.idade} anos)</li>
            <li><strong>Gênero:</strong> {prontuario.genero}</li>
            <li><strong>Estado Civil:</strong> {prontuario.estadoCivil}</li>
          </ul>
        </div>

        <div className="dados-card panel-container" style={{ padding: '24px' }}>
          <h3>Contato e Endereço</h3>
          <ul>
            <li><strong>E-mail:</strong> {prontuario.email}</li>
            <li><strong>Telefone:</strong> {prontuario.telefone}</li>
            <li><strong>Endereço:</strong> {prontuario.logradouro}, {prontuario.bairro} - {prontuario.cidade}/{prontuario.estado}</li>
            <li><strong>CEP:</strong> {prontuario.cep}</li>
          </ul>
        </div>

        <div className="dados-card full-width panel-container" style={{ padding: '24px' }}>
          <h3>Serviço Solicitado</h3>
          <ul>
            <li><strong>Clínica:</strong> {prontuario.clinicaAtendimento}</li>
            <li><strong>Atendimento para:</strong> {prontuario.atendimentoParaQuem}</li>
            {prontuario.atendimentoParaQuem === 'Outra Pessoa' && (
              <li><strong>Nome da outra pessoa:</strong> {prontuario.nomeOutraPessoa}</li>
            )}
            {prontuario.areaAtendimento && (
              <li><strong>Área Solicitada:</strong> {prontuario.areaAtendimento}</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
