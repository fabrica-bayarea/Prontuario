import React, { useState, useEffect } from 'react';
import SidebarLayout from "../../../components/SidebarLayout";
import "../../dashboard/stylelog.css";

function LogsAuditoria() {
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroAcao, setFiltroAcao] = useState('');
  const [dataDe, setDataDe] = useState('');
  const [dataAte, setDataAte] = useState('');
  const [logs, setLogs] = useState([]); // Aqui você carregaria seus dados de log
  const [logsFiltrados, setLogsFiltrados] = useState([]);

  // Simulação de dados de logs. Em um cenário real, você faria uma requisição API aqui.
  useEffect(() => {
    const dadosMockLogs = [
      { id: 1, usuario: 'João Silva', acao: 'login', dataHora: '2025-07-01 10:00:00', detalhes: 'Login bem-sucedido' },
      { id: 2, usuario: 'Maria Oliveira', acao: 'aprovacao', dataHora: '2025-07-01 10:15:30', detalhes: 'Aprovação de usuário: Pedro Souza' },
      { id: 3, usuario: 'Pedro Costa', acao: 'edicao', dataHora: '2025-07-02 11:00:00', detalhes: 'Edição de prontuário: Ana Lima' },
      { id: 4, usuario: 'João Silva', acao: 'logout', dataHora: '2025-07-02 12:30:00', detalhes: 'Logout' },
      { id: 5, usuario: 'Fernanda Dantas', acao: 'importacao', dataHora: '2025-07-03 09:00:00', detalhes: 'Importação de 100 usuários' },
      { id: 6, usuario: 'João Silva', acao: 'login', dataHora: '2025-07-04 08:00:00', detalhes: 'Login bem-sucedido' },
      // ... mais logs
    ];
    setLogs(dadosMockLogs);
    setLogsFiltrados(dadosMockLogs); // Inicialmente, todos os logs são exibidos
  }, []);

  useEffect(() => {
    handleFilter(); // Aplica o filtro sempre que os parâmetros de filtro mudarem
  }, [filtroNome, filtroAcao, dataDe, dataAte, logs]);


  const handleFilter = () => {
    let tempLogs = [...logs];

    if (filtroNome) {
      tempLogs = tempLogs.filter(log =>
        log.usuario.toLowerCase().includes(filtroNome.toLowerCase())
      );
    }

    if (filtroAcao) {
      tempLogs = tempLogs.filter(log => log.acao === filtroAcao);
    }

    if (dataDe) {
      tempLogs = tempLogs.filter(log => new Date(log.dataHora) >= new Date(dataDe));
    }

    if (dataAte) {
      tempLogs = tempLogs.filter(log => {
        const logDate = new Date(log.dataHora);
        const endDate = new Date(dataAte);
        // Ajusta a data final para incluir todo o dia
        endDate.setHours(23, 59, 59, 999);
        return logDate <= endDate;
      });
    }

    setLogsFiltrados(tempLogs);
  };

  const handleExportPDF = () => {
    alert('Exportar como PDF (funcionalidade a ser implementada)');
    // Aqui você integraria uma biblioteca para gerar PDF
  };

  const handleExportCSV = () => {
    alert('Exportar como CSV (funcionalidade a ser implementada)');
    // Aqui você implementaria a lógica para gerar um CSV
  };

  return (
    <SidebarLayout>
      <main className="dashboard-main">
        <header className="dashboard-header">
        <h1 className="dashboard-title">Logs e Auditoria</h1>
      </header>

      {/* Filtros */}
      <section className="filters-section filtros-wrapper" aria-label="Filtro de logs">
        <input
          type="search"
          id="filtroNome"
          placeholder="Buscar nome de usuário"
          aria-label="Nome do usuário"
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
        />
        <select
          id="filtroAcao"
          aria-label="Tipo de ação"
          value={filtroAcao}
          onChange={(e) => setFiltroAcao(e.target.value)}
        >
          <option value="">Todos os tipos</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
          <option value="aprovacao">Aprovação de usuário</option>
          <option value="edicao">Edição de prontuário</option>
          <option value="exclusao">Exclusão de programa</option>
          <option value="importacao">Importação de usuários</option>
        </select>
        <input
          type="date"
          id="dataDe"
          aria-label="Data inicial do filtro"
          value={dataDe}
          onChange={(e) => setDataDe(e.target.value)}
        />
        <input
          type="date"
          id="dataAte"
          aria-label="Data final do filtro"
          value={dataAte}
          onChange={(e) => setDataAte(e.target.value)}
        />
        <button id="btnFiltrar" onClick={handleFilter}>Filtrar Resultados</button>
      </section>

      {/* Resumo */}
      <section id="resumoValidacao" className="info-lista" aria-live="polite">
        Total: <span id="totalLogs">{logs.length}</span> registros |
        Filtrados: <span id="filtradosLogs">{logsFiltrados.length}</span>
      </section>

      {/* Tabela de Logs */}
      <section className="tabela-logs" aria-label="Tabela de logs do sistema">
        <h2 style={{ paddingTop: '30px' }}>Registros de Ações</h2>
        <table role="table">
          <caption className="visually-hidden">
            <h2 style={{ paddingBottom: '30px', textAlign: 'left', paddingTop: '20px' }}>Logs de ações realizadas pelos usuários no sistema</h2>
          </caption>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Ação Executada</th>
              <th>Data e Hora</th>
              <th>Detalhes</th>
            </tr>
          </thead>
          <tbody id="listaLogs">
            {logsFiltrados.map((log) => (
              <tr key={log.id}>
                <td>{log.usuario}</td>
                <td>{log.acao}</td>
                <td>{log.dataHora}</td>
                <td>{log.detalhes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Botões */}
      <div className="botoes-exportacao" style={{ paddingTop: '30px' }}>
        <button id="btnExportarPDF" className="btn-export pdf" onClick={handleExportPDF}>📄 Exportar como PDF</button>
        <button id="btnExportarCSV" className="btn-export csv" onClick={handleExportCSV}>📁 Exportar como CSV</button>
      </div>
      <div id="toast" className="toast hidden"></div>
    </main>
     </SidebarLayout> 
  );
}

export default LogsAuditoria;