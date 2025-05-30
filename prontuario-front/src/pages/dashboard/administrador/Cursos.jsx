import SidebarLayout from "../../../components/SidebarLayout";
import { useState } from "react";
import "../styledash.css"; // Importa o CSS do dashboard

function Cursos() {
  const [modal, setModal] = useState({
    coordenadores: false,
    aviso: false,
    novoCurso: false,
    confirmarExclusao: false,
  });

  const toggleModal = (name) => {
    setModal((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  return (
    <SidebarLayout>
      <header className="dashboard-header">
        <h1 className="dashboard-title">Gerenciar Cursos</h1>
        <button
          className="botao-primario"
          aria-label="Adicionar novo curso"
          onClick={() => toggleModal("novoCurso")}
        >
          + Adicionar Novo Curso
        </button>
      </header>

      <section className="filters-section">
        <input
          type="search"
          id="buscaCurso"
          placeholder="Buscar curso por nome..."
          aria-label="Buscar curso por nome"
        />
        <div
          className="status-filtros"
          role="group"
          aria-label="Filtro por status"
        >
          <button className="filtro-btn active" data-status="todos">
            Todos
          </button>
          <button className="filtro-btn" data-status="ativos">
            Ativos
          </button>
          <button className="filtro-btn" data-status="inativos">
            Inativos
          </button>
        </div>
        <p className="info-lista">
          Exibindo <span id="contadorCursos">0</span> cursos
        </p>
      </section>

      <section
        className="tabela-cursos"
        aria-label="Tabela de cursos cadastrados"
      >
        <table>
          <thead>
            <tr>
              <th>Nome do Curso</th>
              <th>Status</th>
              <th>Coordenadores</th>
              <th>Data de Criação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="listaCursos">
            {/* Populado via lógica React futuramente */}
          </tbody>
        </table>
      </section>

      {/* Modal: Coordenadores vinculados */}
      {modal.coordenadores && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tituloCoordenadores"
        >
          <div className="modal-content">
            <span
              className="modal-close"
              aria-label="Fechar modal coordenadores"
              onClick={() => toggleModal("coordenadores")}
            >
              &times;
            </span>
            <h2 id="tituloCoordenadores">Coordenadores vinculados</h2>
            <ul id="listaCoordenadores">{/* Populado via lógica React */}</ul>
          </div>
        </div>
      )}

      {/* Modal: Aviso de exclusão bloqueada */}
      {modal.aviso && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mensagemAviso"
        >
          <div className="modal-content">
            <span
              className="modal-close"
              aria-label="Fechar aviso"
              onClick={() => toggleModal("aviso")}
            >
              &times;
            </span>
            <p id="mensagemAviso">
              Este curso possui programas ativos vinculados. Para excluir,
              inative ou remova os programas primeiro.
            </p>
          </div>
        </div>
      )}

      {/* Modal: Adicionar/Editar curso */}
      {modal.novoCurso && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tituloNovoCurso"
        >
          <div className="modal-content">
            <span
              className="modal-close"
              aria-label="Fechar formulário de novo curso"
              onClick={() => toggleModal("novoCurso")}
            >
              &times;
            </span>
            <h2 id="tituloNovoCurso">Adicionar Novo Curso</h2>
            <form id="formNovoCurso">
              <label>
                Nome do Curso*
                <br />
                <input type="text" id="cursoNome" required />
              </label>
              <br />
              <br />

              <label>
                Status Inicial
                <br />
                <select id="cursoStatus" required>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </label>
              <br />
              <br />

              <label>Coordenadores Vinculados</label>
              <br />
              <div id="cursoCoordsCheckboxes">
                {/* Checkboxes gerados via lógica React */}
              </div>
              <br />
              <br />

              <label>
                Observações (opcional)
                <br />
                <textarea id="cursoObs" rows="3"></textarea>
              </label>
              <br />
              <br />

              <button type="submit">Salvar Curso</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmação de Exclusão */}
      {modal.confirmarExclusao && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <span
              className="modal-close"
              aria-label="Fechar modal de confirmação"
              onClick={() => toggleModal("confirmarExclusao")}
            >
              &times;
            </span>
            <p id="textoConfirmacao">
              Tem certeza que deseja excluir este curso?
            </p>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <button onClick={() => toggleModal("confirmarExclusao")}>
                Cancelar
              </button>
              <button
                style={{
                  backgroundColor: "#b80000",
                  color: "#fff",
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}

export default Cursos;
