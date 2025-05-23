import LogoIESB from "../../../assets/Images/LogoIesb.png"; // ajuste o caminho conforme seu projeto
import "../../dashboard/styledash.css";
const MenuAdmin = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar" aria-label="Menu de Navegação">
        <img src={LogoIESB} alt="Logo IESB" className="logo-sidebar" />
        <nav>
          <ul>
            <li>
              <a href="/dashboard/administrador">🏠 Dashboard</a>
            </li>
            <li>
              <a href="">📚 Cursos</a>
            </li>
            <li>
              <a href="">👨‍🏫 Coordenadores</a>
            </li>
            <li>
              <a href="">📥 Importar Usuários</a>
            </li>
            <li>
              <a href="">📄 Conteúdo Institucional</a>
            </li>
            <li>
              <a href="">⚙️ Configurações</a>
            </li>
            <li>
              <a href="">🧾 Logs e Auditoria</a>
            </li>
            <li>
              <a href="">📊 Relatórios</a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Olá, Admin!</h1>
          <div className="update-info">
            <span id="lastUpdated" aria-live="polite">
              Atualizado em: 30/04/2025 às 14h15
            </span>
            <button id="refreshData" aria-label="Atualizar dados do painel">
              Atualizar dados
              <span
                id="spinner"
                className="spinner hidden"
                aria-hidden="true"
              ></span>
            </button>
          </div>
        </header>

        <hr />

        <section
          className="kpi-grid"
          aria-label="Indicadores rápidos do sistema"
        >
          <div className="kpi-box">
            Total de Cursos: <strong id="totalCursos">--</strong>
          </div>
          <div className="kpi-box">
            Programas Ativos: <strong id="totalProgramas">--</strong>
          </div>
          <div className="kpi-box">
            Usuários por Perfil: <strong id="totalUsuarios">--</strong>
          </div>
          <div className="kpi-box">
            Atendimentos no Mês: <strong id="totalAtendimentos">--</strong>
          </div>
        </section>

        <hr />

        <section className="charts-section" aria-label="Gráficos estatísticos">
          <div className="chart-container">
            <h2>Atendimentos por Curso</h2>
            <canvas
              id="graficoAtendimentos"
              aria-label="Gráfico de atendimentos por curso"
              role="img"
            ></canvas>
          </div>
          <div className="chart-container">
            <h2>Status dos Beneficiários</h2>
            <canvas
              id="graficoBeneficiarios"
              aria-label="Gráfico de status dos beneficiários"
              role="img"
            ></canvas>
          </div>
        </section>

        <hr />

        <section className="quick-access" aria-label="Ações rápidas">
          <button aria-label="Gerenciar Cursos">Gerenciar Cursos</button>
          <button aria-label="Gerenciar Coordenadores">
            Gerenciar Coordenadores
          </button>
          <button aria-label="Importar Usuários">Importar Usuários</button>
          <button aria-label="Ver Relatórios">Ver Relatórios</button>
          <button aria-label="Acessar Configurações">Configurações</button>
        </section>

        <hr />

        <section className="dashboard-alerts" aria-label="Ações pendentes">
          <h3>⚠️ Itens que exigem atenção</h3>
          <ul id="pendencias"></ul>
        </section>

        <section
          className="dashboard-notificacoes"
          aria-label="Notificações administrativas"
        >
          <h3>🔔 Notificações recentes</h3>
          <ul id="notificacoes"></ul>
        </section>
      </div>

      <div id="toast" className="toast hidden"></div>

      <script src="js/utils.js"></script>
      <script src="js/dashboard.js"></script>
    </div>
  );
};

export default MenuAdmin;
