// Importa hooks do React e a biblioteca Chart.js para gráficos
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto"; // Biblioteca para renderizar gráficos
import LogoIESB from "../../../assets/Images/LogoIesb.png"; // Logo da instituição
import "../../dashboard/styledash.css"; // Estilos do dashboard

// Dados para exibição nos gráficos do dashboard
const status = {
  cursos: 12,
  programas: 32,
  usuarios: 158,
  atendimentosMes: 276,
  pendencias: ["5 alunos aguardando aprovação", "12 beneficiários pendentes"],
  notificacoes: [
    "Novo curso adicionado por Maria Souza",
    "Sistema em manutenção dia 05/05 às 20h",
  ],
  graficoCursos: {
    labels: ["Psicologia", "Nutrição", "Direito", "Odontologia"],
    values: [78, 65, 52, 40],
  },
  graficoBeneficiarios: {
    labels: ["Aprovados", "Pendentes"],
    values: [160, 40],
  },
};

const MenuAdmin = () => {
  // Estado para data/hora da última atualização
  const [lastUpdated, setLastUpdated] = useState(
    "Atualizado em 30/04/2025 às 14h15"
  );
  // Estado para exibir ou ocultar o toast de sucesso
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  // Estado de loading ao atualizar dados
  const [loading, setLoading] = useState(false);

  const cursosRef = useRef(null);
  const beneficiariosRef = useRef(null);

  const chartCursos = useRef(null);
  const chartBeneficiarios = useRef(null);

  // useEffect para inicializar/destruir os gráficos ao montar o componente
  useEffect(() => {
    // Destroi gráficos antigos se existirem (evita sobreposição)
    if (chartCursos.current) chartCursos.current.destroy();
    if (chartBeneficiarios.current) chartBeneficiarios.current.destroy();

    // Gráfico de Cursos (barra)
    const ctxCursos = cursosRef.current.getContext("2d");
    ctxCursos.canvas.parentNode.style.height = "300px";
    chartCursos.current = new Chart(ctxCursos, {
      type: "bar",
      data: {
        labels: status.graficoCursos.labels,
        datasets: [
          {
            label: "Atendimentos",
            data: status.graficoCursos.values,
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
        labels: status.graficoBeneficiarios.labels,
        datasets: [
          {
            label: "Status",
            data: status.graficoBeneficiarios.values,
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
  }, []);

  // Função para simular atualização dos dados do painel
  const handleRefresh = () => {
    setLoading(true); // Ativa loading
    setTimeout(() => {
      setLoading(false); // Desativa loading
      setLastUpdated("Atualizado em: " + new Date().toLocaleString("pt-BR")); // Atualiza data/hora
      setToastMsg("Dados atualizados com sucesso!"); // Mensagem de sucesso
      setShowToast(true); // Exibe toast
      setTimeout(() => setShowToast(false), 3000); // Oculta toast após 3s
    }, 1500); // Simula delay de atualização
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
            Total de Cursos: <strong>{status.cursos}</strong>
          </div>
          <div className="kpi-box">
            Programas Ativos: <strong>{status.programas}</strong>
          </div>
          <div className="kpi-box">
            Usuários por Perfil: <strong>{status.usuarios}</strong>
          </div>
          <div className="kpi-box">
            Atendimentos no Mês: <strong>{status.atendimentosMes}</strong>
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
            {status.pendencias.map((item, idx) => (
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
            {status.notificacoes.map((msg, idx) => (
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
