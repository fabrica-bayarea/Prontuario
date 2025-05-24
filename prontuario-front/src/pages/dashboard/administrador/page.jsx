// Importa hooks do React e a biblioteca Chart.js para gráficos
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import LogoIESB from "../../../assets/Images/LogoIesb.png";
import "../../dashboard/styledash.css";

const MenuAdmin = () => {
  const [dashboardData, setDashboardData] = useState({
    cursos: 0,
    usuarios: 0,
    programas: 0,
    atendimentosMes: 0,
    pendencias: [],
    notificacoes: [],
    graficoCursos: { labels: [], values: [] },
    graficoBeneficiarios: { labels: [], values: [] },
  });
  const [lastUpdated, setLastUpdated] = useState("Carregando..."); // Estado para data/hora da última atualização
  const [showToast, setShowToast] = useState(false); // Estado para exibir ou ocultar o toast de sucesso
  const [toastMsg, setToastMsg] = useState(""); // Mensagem do toast
  const [loading, setLoading] = useState(false); // Estado de loading ao atualizar dados

  const cursosRef = useRef(null);
  const beneficiariosRef = useRef(null);
  const chartCursos = useRef(null);
  const chartBeneficiarios = useRef(null);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/dashboard/administrador"
      );
      const data = await response.json();
      setDashboardData(data);
      setLastUpdated("Atualizado em: " + new Date().toLocaleString("pt-BR"));
      renderCharts(data);
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    }
  };

  const renderCharts = (data) => {
    // Destroi gráficos antigos se existirem (evita sobreposição)
    if (chartCursos.current) chartCursos.current.destroy();
    if (chartBeneficiarios.current) chartBeneficiarios.current.destroy();

    // Gráfico de Cursos (barra)
    const ctxCursos = cursosRef.current.getContext("2d");
    ctxCursos.canvas.parentNode.style.height = "300px";
    chartCursos.current = new Chart(ctxCursos, {
      type: "bar",
      data: {
        labels: data.graficoCursos.labels,
        datasets: [
          {
            label: "Atendimentos",
            data: data.graficoCursos.values,
            backgroundColor: ["#b80000", "#d94a4a", "#ef8a8a", "#fde5e5"],
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.raw} atendimentos`,
            },
          },
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 10 },
          },
        },
      },
    });

    // Gráfico de Beneficiários (rosquinha)
    const ctxBenef = beneficiariosRef.current.getContext("2d");
    ctxBenef.canvas.parentNode.style.height = "300px";
    chartBeneficiarios.current = new Chart(ctxBenef, {
      type: "doughnut",
      data: {
        labels: data.graficoBeneficiarios.labels,
        datasets: [
          {
            label: "Status",
            data: data.graficoBeneficiarios.values,
            backgroundColor: ["#b80000", "#fde5e5"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw}`,
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }); // Chama a função ao montar o componente

  if (!dashboardData) {
    return <div className="dashboard-loading">Carregando dados...</div>;
  }

  // Função para simular atualização dos dados do painel
  const handleRefresh = () => {
    setLoading(true); // Ativa loading
    setTimeout(async () => {
      await fetchDashboardData();
      setLoading(false);
      setToastMsg("Dados atualizados com sucesso!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  // Renderização do componente
  return (
    <div className="dashboard-container">
      {/* Barra lateral com navegação */}
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

      {/* Conteúdo principal do dashboard */}
      <div className="dashboard-main">
        {/* Cabeçalho com saudação e botão de atualização */}
        <header className="dashboard-header">
          <h1 className="dashboard-title">Olá, Admin!</h1>
          <div className="update-info">
            <span id="lastUpdated" aria-live="polite">
              {lastUpdated}
            </span>
            <button
              id="refreshData"
              aria-label="Atualizar dados do painel"
              onClick={handleRefresh}
              disabled={loading}
            >
              Atualizar dados
              {loading && (
                <span
                  className="spinner"
                  aria-hidden="true"
                  style={{ marginLeft: 8 }}
                ></span>
              )}
            </button>
          </div>
        </header>

        <hr />

        {/* Indicadores rápidos (KPIs) */}
        <section
          className="kpi-grid"
          aria-label="Indicadores rápidos do sistema"
        >
          <div className="kpi-box">
            Total de Cursos: <strong>{dashboardData.cursos}</strong>
          </div>
          <div className="kpi-box">
            Programas Ativos: <strong>{dashboardData.programas}</strong>
          </div>
          <div className="kpi-box">
            Usuários por Perfil: <strong>{dashboardData.usuarios}</strong>
          </div>
          <div className="kpi-box">
            Atendimentos no Mês:{" "}
            <strong>{dashboardData.atendimentosMes}</strong>
          </div>
        </section>

        <hr />

        {/* Seção de gráficos */}
        <section className="charts-section" aria-label="Gráficos estatísticos">
          <div className="chart-container">
            <h2>Atendimentos por Curso</h2>
            <canvas
              ref={cursosRef}
              id="graficoAtendimentos"
              role="img"
              aria-label="Gráfico de atendimentos por curso"
            ></canvas>
          </div>
          <div className="chart-container">
            <h2>Status dos Beneficiários</h2>
            <canvas
              ref={beneficiariosRef}
              id="graficoBeneficiarios"
              role="img"
              aria-label="Gráfico de status dos beneficiários"
            ></canvas>
          </div>
        </section>

        <hr />

        {/* Ações rápidas */}
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

        {/* Itens pendentes */}
        <section className="dashboard-alerts" aria-label="Ações pendentes">
          <h3>⚠️ Itens que exigem atenção</h3>
          <ul>
            {dashboardData.pendencias.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Notificações recentes */}
        <section
          className="dashboard-notificacoes"
          aria-label="Notificações administrativas"
        >
          <h3>🔔 Notificações recentes</h3>
          <ul>
            {dashboardData.notificacoes.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Toast de feedback de atualização */}
      {showToast && (
        <div id="toast" className="toast" role="status" aria-live="assertive">
          {toastMsg}
        </div>
      )}
    </div>
  );
};

// Exporta o componente para uso em outros arquivos
export default MenuAdmin;
