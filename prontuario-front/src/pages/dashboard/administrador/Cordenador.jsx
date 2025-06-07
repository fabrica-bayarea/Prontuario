import { useState, useEffect } from "react";
import "../../dashboard/stylecor.css";
import SidebarLayout from "../../../components/SidebarLayout";

// URL base da sua API (ajuste a porta se necessário)
const API_URL = "http://localhost:3000/admin/coordenadores";

function MenuCor() {
  const [coordenadores, setCoordenadores] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [showModalForm, setShowModalForm] = useState(false);
  const [showModalConfirmar, setShowModalConfirmar] = useState(false);
  const [coordenadorSelecionado, setCoordenadorSelecionado] = useState(null);

  // Buscar todos os coordenadores do back-end ao carregar a tela
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCoordenadores(data);
        } else {
          console.error("Resposta inesperada:", data);
          setCoordenadores([]); // Evita erro de filter
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar coordenadores:", error);
        setCoordenadores([]); // Evita crash
      });
  }, []);

  // Abrir modal para editar
  const handleEditar = (coord) => {
    setCoordenadorSelecionado(coord);
    setShowModalForm(true);
  };

  // Alternar status (Ativo <-> Inativo)
  const handleBloquear = async (id) => {
    const coord = coordenadores.find((c) => c.id === id);
    if (!coord) return;

    const novoStatus = coord.status === "Ativo" ? "Inativo" : "Ativo";

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      const res = await fetch(API_URL);
      const data = await res.json();
      setCoordenadores(data);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  // Abrir modal de confirmação para excluir
  const handleExcluir = (coord) => {
    setCoordenadorSelecionado(coord);
    setShowModalConfirmar(true);
  };

  // Confirmar exclusão do coordenador
  const confirmarExcluir = async () => {
    try {
      await fetch(`${API_URL}/${coordenadorSelecionado.id}`, {
        method: "DELETE",
      });

      const res = await fetch(API_URL);
      const data = await res.json();
      setCoordenadores(data);
      setShowModalConfirmar(false);
      setCoordenadorSelecionado(null);
    } catch (error) {
      console.error("Erro ao excluir coordenador:", error);
    }
  };

  // Adicionar ou editar um coordenador
  const salvarCoordenador = async (event) => {
    event.preventDefault();
    const form = event.target;
    const nome = form.nome.value;
    const email = form.email.value;
    const cursos = Array.from(form.cursos.options)
      .filter((o) => o.selected)
      .map((o) => o.value);
    const status = form.status.value;

    const payload = {
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

    try {
      if (coordenadorSelecionado) {
        // Atualiza coordenador existente
        await fetch(`${API_URL}/${coordenadorSelecionado.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Cria novo coordenador
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const res = await fetch(API_URL);
      const data = await res.json();
      setCoordenadores(data);
      setShowModalForm(false);
      setCoordenadorSelecionado(null);
    } catch (error) {
      console.error("Erro ao salvar coordenador:", error);
    }
  };

  // Filtro por status (opcional)
  const coordenadoresFiltrados = coordenadores.filter((coord) => {
    if (filtroStatus === "Todos") return true;
    return coord.status === filtroStatus;
  });

  return (
    <SidebarLayout>
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
              className={`filtro-btn ${
                filtroStatus === "Todos" ? "active" : ""
              }`}
              onClick={() => setFiltroStatus("Todos")}
            >
              Todos
            </button>
            <button
              className={`filtro-btn ${
                filtroStatus === "Ativo" ? "active" : ""
              }`}
              onClick={() => setFiltroStatus("Ativo")}
            >
              Ativos
            </button>
            <button
              className={`filtro-btn ${
                filtroStatus === "Inativo" ? "active" : ""
              }`}
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
              {coordenadorSelecionado
                ? "Editar Coordenador"
                : "Adicionar Coordenador"}
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
                <input
                  name="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  required
                />
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
    </SidebarLayout>
  );
}

export default MenuCor;
