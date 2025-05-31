import React, { useState } from "react";
import "../../dashboard/stylecor.css";
import LogoIESB from "../../../assets/Images/LogoIesb.png";

function MenuCor() {
  const [coordenadores, setCoordenadores] = useState([
    {
      id: 1,
      nome: "João Silva",
      email: "joao@iesb.edu.br",
      cursos: ["Engenharia", "ADS"],
      status: "Ativo",
      permissoes: {
        aprovarBeneficiarios: false,
        cadastrarConteudos: false,
        gerarRelatorios: false,
      },
    },
  ]);

  const [filtroStatus, setFiltroStatus] = useState("Todos");

  const [showModalForm, setShowModalForm] = useState(false);
  const [showModalConfirmar, setShowModalConfirmar] = useState(false);
  const [coordenadorSelecionado, setCoordenadorSelecionado] = useState(null);

  // Abrir modal editar
  const handleEditar = (coord) => {
    setCoordenadorSelecionado(coord);
    setShowModalForm(true);
  };

  // Bloquear (alternar status)
  const handleBloquear = (id) => {
    setCoordenadores((prev) =>
      prev.map((coord) =>
        coord.id === id
          ? { ...coord, status: coord.status === "Ativo" ? "Inativo" : "Ativo" }
          : coord
      )
    );
  };

  // Excluir
  const handleExcluir = (coord) => {
    setCoordenadorSelecionado(coord);
    setShowModalConfirmar(true);
  };

  const confirmarExcluir = () => {
    setCoordenadores((prev) =>
      prev.filter((coord) => coord.id !== coordenadorSelecionado.id)
    );
    setShowModalConfirmar(false);
    setCoordenadorSelecionado(null);
  };

  // Salvar (adicionar/editar)
  const salvarCoordenador = (event) => {
    event.preventDefault();
    const form = event.target;
    const nome = form.nome.value;
    const email = form.email.value;
    const cpf = form.cpf.value;
    const cursos = Array.from(form.cursos.options)
      .filter((o) => o.selected)
      .map((o) => o.value);
    const status = form.status.value;

    if (coordenadorSelecionado) {
      // Editar
      setCoordenadores((prev) =>
        prev.map((coord) =>
          coord.id === coordenadorSelecionado.id
            ? { ...coord, nome, email, cursos, status }
            : coord
        )
      );
    } else {
      // Adicionar
      const novo = {
        id: Date.now(),
        nome,
        email,
        cursos,
        status,
        permissoes: {
          aprovarBeneficiarios: false,
          cadastrarConteudos: false,
          gerarRelatorios: false,
        },
      };
      setCoordenadores((prev) => [...prev, novo]);
    }

    setShowModalForm(false);
    setCoordenadorSelecionado(null);
  };

  // 🔍 Filtrando coordenadores
  const coordenadoresFiltrados = coordenadores.filter((coord) => {
    if (filtroStatus === "Todos") return true;
    return coord.status === filtroStatus;
  });

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <img src={LogoIESB} alt="Logo IESB" className="logo-sidebar" />
        <nav>
          <ul>
            <li><a href="#">🏠 Dashboard</a></li>
            <li><a href="#">📚 Cursos</a></li>
            <li><a href="#">👨‍🏫 Coordenadores</a></li>
            <li><a href="#">📥 Importar Usuários</a></li>
            <li><a href="#">📄 Conteúdo Institucional</a></li>
            <li><a href="#">⚙️ Configurações</a></li>
            <li><a href="#">🧾 Logs e Auditoria</a></li>
            <li><a href="#">📊 Relatórios</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Gerenciar Coordenadores</h1>
          <button
            className="btn-adicionar"
            onClick={() => {
              setCoordenadorSelecionado(null);
              setShowModalForm(true);
            }}
          >
            + Adicionar Coordenador
          </button>
        </header>

        {/* Filtros */}
        <section className="filters-section">
          <input type="search" placeholder="Buscar por nome ou e-mail" />
          <select>
            <option value="">Todos os cursos</option>
          </select>
          <div className="status-filtros">
            <button
              className={`filtro-btn ${filtroStatus === "Todos" ? "active" : ""}`}
              onClick={() => setFiltroStatus("Todos")}
            >
              Todos
            </button>
            <button
              className={`filtro-btn ${filtroStatus === "Ativo" ? "active" : ""}`}
              onClick={() => setFiltroStatus("Ativo")}
            >
              Ativos
            </button>
            <button
              className={`filtro-btn ${filtroStatus === "Inativo" ? "active" : ""}`}
              onClick={() => setFiltroStatus("Inativo")}
            >
              Inativos
            </button>
          </div>
        </section>

        {/* Tabela */}
        <section className="tabela-coordenadores">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Cursos Vinculados</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {coordenadoresFiltrados.length > 0 ? (
                coordenadoresFiltrados.map((coord) => (
                  <tr key={coord.id}>
                    <td>{coord.nome}</td>
                    <td>{coord.email}</td>
                    <td>{coord.cursos.join(", ")}</td>
                    <td>{coord.status}</td>
                    <td>
                      <button
                        className="table-action-btn edit-btn"
                        onClick={() => handleEditar(coord)}
                      >
                        ✏️
                      </button>
                      <button
                        className="table-action-btn lock-btn"
                        onClick={() => handleBloquear(coord.id)}
                      >
                        🔒
                      </button>
                      <button
                        className="table-action-btn delete-btn"
                        onClick={() => handleExcluir(coord)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Nenhum coordenador encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

      {/* Modal Form */}
      {showModalForm && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="modal-close"
              onClick={() => {
                setShowModalForm(false);
                setCoordenadorSelecionado(null);
              }}
            >
              &times;
            </span>
            <h2>
              {coordenadorSelecionado ? "Editar Coordenador" : "Adicionar Coordenador"}
            </h2>
            <form onSubmit={salvarCoordenador}>
              <label>
                Nome completo*
                <input
                  name="nome"
                  type="text"
                  defaultValue={coordenadorSelecionado?.nome || ""}
                  required
                />
              </label>
              <label>
                E-mail institucional*
                <input
                  name="email"
                  type="email"
                  defaultValue={coordenadorSelecionado?.email || ""}
                  required
                />
              </label>
              <label>
                CPF*
                <input name="cpf" type="text" placeholder="000.000.000-00" required />
              </label>
              <label>
                Cursos vinculados*
                <select
                  name="cursos"
                  multiple
                  defaultValue={coordenadorSelecionado?.cursos || []}
                  required
                >
                  <option>Engenharia</option>
                  <option>ADS</option>
                </select>
              </label>
              <label>
                Status
                <select
                  name="status"
                  defaultValue={coordenadorSelecionado?.status || "Ativo"}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </label>
              <fieldset>
                <legend>Permissões</legend>
                <label>
                  <input type="checkbox" />
                  Pode aprovar beneficiários
                </label>
                <label>
                  <input type="checkbox" />
                  Pode cadastrar conteúdos
                </label>
                <label>
                  <input type="checkbox" />
                  Pode gerar relatórios
                </label>
              </fieldset>
              <button type="submit">Salvar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar */}
      {showModalConfirmar && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="modal-close"
              onClick={() => setShowModalConfirmar(false)}
            >
              &times;
            </span>
            <p>Tem certeza que deseja remover este coordenador?</p>
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => {
                  setShowModalConfirmar(false);
                  setCoordenadorSelecionado(null);
                }}
              >
                Cancelar
              </button>
              <button onClick={confirmarExcluir}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuCor;
