import SideBarAgenda from "../../../../components/SideBarAgenda";
import SidebarLayout from "../../../../components/SidebarLayout";
import "../../../dashboard/styledash.css";
import { useState } from "react";

function Escalas() {
  // States for modal, filters, and form fields
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    programa: "",
    status: "",
  });
  const [form, setForm] = useState({
    nomeAluno: "",
    matriculaAluno: "",
    cursoAluno: "",
    programaAluno: "",
    statusAluno: "pendente",
    turnos: [],
  });

  // Dummy data for table and selects (replace with API calls as needed)
  const alunos = [];
  const cursos = [];
  const programas = [];

  // Handlers
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "turnos") {
      setForm((prev) => ({
        ...prev,
        turnos: checked
          ? [...prev.turnos, value]
          : prev.turnos.filter((t) => t !== value),
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    setModalOpen(false);
  };

  return (
    <SidebarLayout>
      <SideBarAgenda>
        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1>Gestão de Escalas e Alunos</h1>
            <button
              id="btnNovoAluno"
              className="botao-primario"
              aria-label="Adicionar novo aluno à escala"
              onClick={() => setModalOpen(true)}
            >
              + Novo aluno na escala
            </button>
          </header>

          {/* Filtros */}
          <section className="filters-section">
            <input
              type="text"
              id="buscaAluno"
              name="search"
              placeholder="Buscar por nome do aluno..."
              value={filters.search}
              onChange={handleFilterChange}
            />
            <select
              id="filtroPrograma"
              name="programa"
              value={filters.programa}
              onChange={handleFilterChange}
            >
              <option value="">Todos os Programas</option>
              {programas.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              id="filtroStatus"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="aprovado">Aprovado</option>
              <option value="removido">Removido</option>
            </select>
          </section>

          {/* Tabela */}
          <section className="tabela-conteudos">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Matrícula</th>
                  <th>Curso</th>
                  <th>Programa</th>
                  <th>Status</th>
                  <th>Turnos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody id="tabelaEscalas">
                {alunos.length === 0 ? (
                  <tr>
                    <td colSpan={7}>Nenhum aluno encontrado.</td>
                  </tr>
                ) : (
                  alunos.map((aluno, idx) => (
                    <tr key={idx}>
                      <td>{aluno.nome}</td>
                      <td>{aluno.matricula}</td>
                      <td>{aluno.curso}</td>
                      <td>{aluno.programa}</td>
                      <td>{aluno.status}</td>
                      <td>{aluno.turnos?.join(", ")}</td>
                      <td>{/* Ações aqui */}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          {/* MODAL DE CADASTRO */}
          {modalOpen && (
            <div
              id="modalEscala"
              className={modalOpen ? "modal" : "modal hidden"}
              role="dialog"
              aria-modal="true"
            >
              <div className="modal-content">
                <button
                  className="modal-close"
                  onClick={() => setModalOpen(false)}
                  aria-label="Fechar Modal"
                  type="button"
                >
                  &times;
                </button>
                <h2>Adicionar Aluno à Escala</h2>

                <form
                  id="formEscala"
                  className="form-grid"
                  onSubmit={handleSubmit}
                >
                  <input type="hidden" id="escalaId" name="escalaId" />

                  <label htmlFor="nomeAluno">Nome do Aluno*</label>
                  <input
                    type="text"
                    id="nomeAluno"
                    name="nomeAluno"
                    required
                    autoComplete="name"
                    value={form.nomeAluno}
                    onChange={handleFormChange}
                  />

                  <label htmlFor="matriculaAluno">Matrícula*</label>
                  <input
                    type="text"
                    id="matriculaAluno"
                    name="matriculaAluno"
                    required
                    value={form.matriculaAluno}
                    onChange={handleFormChange}
                  />

                  <label htmlFor="cursoAluno">Curso</label>
                  <select
                    id="cursoAluno"
                    name="cursoAluno"
                    required
                    value={form.cursoAluno}
                    onChange={handleFormChange}
                  >
                    <option value="">Selecione...</option>
                    {cursos.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="programaAluno">Programa</label>
                  <select
                    id="programaAluno"
                    name="programaAluno"
                    required
                    value={form.programaAluno}
                    onChange={handleFormChange}
                  >
                    <option value="">Selecione...</option>
                    {programas.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="statusAluno">Status</label>
                  <select
                    id="statusAluno"
                    name="statusAluno"
                    value={form.statusAluno}
                    onChange={handleFormChange}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="removido">Removido</option>
                  </select>

                  <label>Turnos (semana)</label>
                  <div className="turnos-blocados">
                    {[
                      ["Seg - Manhã", "Seg - Tarde"],
                      ["Ter - Manhã", "Ter - Tarde"],
                      ["Qua - Manhã", "Qua - Tarde"],
                      ["Qui - Manhã", "Qui - Tarde"],
                      ["Sex - Manhã", "Sex - Tarde"],
                    ].map((dia, idx) => (
                      <div className="dia-turno" key={idx}>
                        {dia.map((turno) => (
                          <label key={turno}>
                            <input
                              type="checkbox"
                              name="turnos"
                              value={turno}
                              checked={form.turnos.includes(turno)}
                              onChange={handleFormChange}
                            />{" "}
                            {turno}
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>

                  <button type="submit" className="btn">
                    Salvar
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </SideBarAgenda>
    </SidebarLayout>
  );
}

export default Escalas;
