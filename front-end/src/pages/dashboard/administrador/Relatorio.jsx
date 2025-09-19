import { useState } from "react";
import SidebarLayout from "../../../components/SidebarLayout";
import "../../dashboard/stylere.css";

function Relatorios() {
  const [filtroCurso, setFiltroCurso] = useState("");
  const [filtroPrograma, setFiltroPrograma] = useState("");
  const [dataDe, setDataDe] = useState(""); // Data Inicial
  const [dataAte, setDataAte] = useState(""); // Data Final
  const [filtroPerfil, setFiltroPerfil] = useState("");
  const [tipoRelatorio, setTipoRelatorio] = useState("atendimentos");

  const gerarRelatorioPDF = () => {
    window.print();
    alert("Gerando relatório em PDF (simulado com impressão do navegador)...");
  };

  return (
    <SidebarLayout>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Relatórios e Estatísticas</h1>
        </header>

        <section className="relatorios-filtros-container">
          {" "}
          {/* Container adicionado */}
          <label className="filter-label">
            Curso
            <select
              value={filtroCurso}
              onChange={(e) => setFiltroCurso(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Psicologia">Psicologia</option>
              <option value="Direito">Direito</option>
              {/* Adicione mais opções conforme a necessidade */}
            </select>
          </label>
          <label className="filter-label">
            Programa
            <select
              value={filtroPrograma}
              onChange={(e) => setFiltroPrograma(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Clínica Escola">Clínica Escola</option>
              <option value="Serviço Jurídico">Serviço Jurídico</option>
              {/* Adicione mais opções conforme a necessidade */}
            </select>
          </label>
          <label className="filter-label">
            Data Inicial
            <input
              type="date"
              value={dataDe}
              onChange={(e) => setDataDe(e.target.value)}
            />
          </label>
          <label className="filter-label">
            Data Final
            <input
              type="date"
              value={dataAte}
              onChange={(e) => setDataAte(e.target.value)}
            />
          </label>
          <label className="filter-label">
            Perfil
            <select
              value={filtroPerfil}
              onChange={(e) => setFiltroPerfil(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Aluno">Aluno</option>
              <option value="Coordenador">Coordenador</option>
              <option value="Beneficiário">Beneficiário</option>
              {/* Adicione mais opções conforme a necessidade */}
            </select>
          </label>
          <label className="filter-label">
            Tipo de Relatório
            <select
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value)}
            >
              <option value="atendimentos">📆 Atendimentos por mês</option>
              <option value="producao">👤 Produção por aluno</option>
              <option value="beneficiarios">
                🌐 Distribuição de beneficiários
              </option>
            </select>
          </label>
        </section>

        <div className="relatorio-btn-container">
          <button className="btn-gerar-pdf" onClick={gerarRelatorioPDF}>
            📄 Gerar Relatório em PDF
          </button>
        </div>
      </main>
    </SidebarLayout>
  );
}

export default Relatorios;
