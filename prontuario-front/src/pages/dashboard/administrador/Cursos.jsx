import SidebarLayout from "../../../components/SidebarLayout";
import { useEffect } from "react";
import "../styledash.css";

function Cursos() {
  useEffect(() => {
    // Utilitário para exibir mensagem (toast)
    const mostrarToast = (mensagem) => alert(mensagem);

    // Dados estáticos para coordenadores (permanece em front)
    const coordenadoresDisponiveis = [
      "Maria Oliveira",
      "João Silva",
      "Carla Souza",
      "Ana Paula",
    ];

    // Variáveis de controle local
    let cursos = [];
    let cursoEditando = null;
    let cursoParaExcluir = null;
    let filtroAtual = "todos";

    // Elementos do DOM
    const el = {
      listaCursos: document.getElementById("listaCursos"),
      contadorCursos: document.getElementById("contadorCursos"),
      filtroBtns: document.querySelectorAll(".filtro-btn"),
      buscaInput: document.getElementById("buscaCurso"),
      modalNovoCurso: document.getElementById("modalNovoCurso"),
      formNovoCurso: document.getElementById("formNovoCurso"),
      modalAviso: document.getElementById("modalAviso"),
      modalCoordenadores: document.getElementById("modalCoordenadores"),
      listaCoordenadores: document.getElementById("listaCoordenadores"),
      cursoCoordsContainer: document.getElementById("cursoCoordsCheckboxes"),
      cursoNome: document.getElementById("cursoNome"),
      cursoStatus: document.getElementById("cursoStatus"),
      cursoObs: document.getElementById("cursoObs"),
      formTitle: document.getElementById("tituloNovoCurso"),
      btnSubmit: document.querySelector("#formNovoCurso button[type='submit']"),
      modalConfirmar: document.getElementById("modalConfirmarExclusao"),
      textoConfirmacao: document.getElementById("textoConfirmacao"),
      btnCancelarExclusao: document.getElementById("btnCancelarExclusao"),
      btnConfirmarExclusao: document.getElementById("btnConfirmarExclusao"),
    };

    // Popula os checkboxes com os coordenadores disponíveis
    const preencherCheckboxCoordenadores = (selecionados = []) => {
      el.cursoCoordsContainer.innerHTML = "";
      coordenadoresDisponiveis.forEach((nome) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = nome;
        checkbox.name = "coordenadores[]";
        checkbox.checked = selecionados.includes(nome);
        checkbox.style.marginRight = "0.5rem";
        label.append(checkbox, nome);
        label.style.display = "flex";
        label.style.alignItems = "center";
        label.style.marginBottom = "0.5rem";
        el.cursoCoordsContainer.appendChild(label);
      });
    };

    const getCoordenadoresSelecionados = () =>
      Array.from(el.cursoCoordsContainer.querySelectorAll("input:checked")).map(
        (cb) => cb.value
      );

    // FUNÇÕES DE INTEGRAÇÃO COM O EXPRESS (back‑end)

    // Buscar cursos via GET /api/cursos
    const fetchCursos = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/dashboard/graficos"
        );
        cursos = await response.json();
        renderizarCursos();
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
        mostrarToast("Erro ao carregar cursos.");
      }
    };

    // Atualizar curso via PUT /api/cursos/:id
    const atualizarCurso = async (cursoAtualizado) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/dashboard/administrador/cursos${cursoAtualizado.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cursoAtualizado),
          }
        );
        if (response.ok) {
          mostrarToast("Curso atualizado com sucesso.");
          await fetchCursos();
        } else {
          mostrarToast("Erro ao atualizar curso.");
        }
      } catch (error) {
        console.error("Erro ao atualizar curso:", error);
        mostrarToast("Erro ao atualizar curso.");
      }
    };

    // Adicionar novo curso via POST /api/cursos
    const adicionarCurso = async (novoCurso) => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/dashboard/administrador/cursos",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoCurso),
          }
        );
        if (response.ok) {
          mostrarToast("Curso salvo com sucesso.");
          await fetchCursos();
        } else {
          mostrarToast("Erro ao salvar curso.");
        }
      } catch (error) {
        console.error("Erro ao salvar curso:", error);
        mostrarToast("Erro ao salvar curso.");
      }
    };

    // Excluir curso via DELETE /api/cursos/:id
    const excluirCurso = async (cursoId) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/dashboard/administrador/cursos/${cursoId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          mostrarToast("Curso excluído com sucesso.");
          await fetchCursos();
        } else {
          mostrarToast("Erro ao excluir curso.");
        }
      } catch (error) {
        console.error("Erro ao excluir curso:", error);
        mostrarToast("Erro ao excluir curso.");
      }
    };

    // Renderiza a tabela de cursos
    const renderizarCursos = () => {
      el.listaCursos.innerHTML = "";
      const termoBusca = el.buscaInput.value.toLowerCase();
      const filtrados = cursos.filter(
        (c) =>
          c.nome.toLowerCase().includes(termoBusca) &&
          (filtroAtual === "todos" ||
            (filtroAtual === "ativos" && c.status === "ativo") ||
            (filtroAtual === "inativos" && c.status === "inativo"))
      );
      el.contadorCursos.textContent = filtrados.length;

      filtrados.forEach((curso) => {
        const tr = document.createElement("tr");

        const tdNome = document.createElement("td");
        tdNome.textContent = curso.nome;

        const tdStatus = document.createElement("td");
        const toggle = document.createElement("button");
        toggle.className = "status-toggle";
        toggle.textContent =
          curso.status === "ativo" ? "✅ Ativo" : "🔘 Inativo";
        toggle.style.color = "#000";
        toggle.onclick = async () => {
          curso.status = curso.status === "ativo" ? "inativo" : "ativo";
          await atualizarCurso(curso);
        };
        tdStatus.appendChild(toggle);

        const tdCoord = document.createElement("td");
        tdCoord.textContent =
          curso.coordenadores && curso.coordenadores.length
            ? curso.coordenadores.join(", ")
            : "Nenhum coordenador";

        const tdData = document.createElement("td");
        tdData.textContent = curso.data;

        const tdAcoes = document.createElement("td");
        [
          {
            icon: "✏️",
            className: "edit-btn table-action-btn",
            handler: () => {
              cursoEditando = curso;
              el.formTitle.textContent = "Editar Curso";
              el.btnSubmit.textContent = "Salvar Alterações";
              el.cursoNome.value = curso.nome;
              el.cursoStatus.value = curso.status;
              el.cursoObs.value = curso.observacoes || "";
              preencherCheckboxCoordenadores(curso.coordenadores);
              el.modalNovoCurso.classList.remove("hidden");
            },
          },
          {
            icon: "🗑️",
            className: "delete-btn table-action-btn",
            handler: () => {
              cursoParaExcluir = curso;
              if (curso.status === "ativo") {
                document.getElementById("mensagemAviso").textContent =
                  "Este curso está ativo. Inative o curso antes de excluí-lo.";
                el.modalAviso.classList.remove("hidden");
              } else {
                el.textoConfirmacao.textContent = `Tem certeza que deseja excluir o curso "${curso.nome}"?`;
                el.modalConfirmar.classList.remove("hidden");
              }
            },
          },
          {
            icon: "📂",
            className: "visu-btn table-action-btn",
            handler: () =>
              mostrarToast("Função de visualização não implementada."),
          },
        ].forEach(({ icon, className, handler }) => {
          const btn = document.createElement("button");
          btn.textContent = icon;
          btn.className = className;
          btn.onclick = handler;
          tdAcoes.appendChild(btn);
        });

        tr.append(tdNome, tdStatus, tdCoord, tdData, tdAcoes);
        el.listaCursos.appendChild(tr);
      });
    };

    // Eventos para filtros e busca
    el.filtroBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        el.filtroBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        filtroAtual = btn.dataset.status;
        renderizarCursos();
      });
    });

    el.buscaInput.addEventListener("input", renderizarCursos);

    // Abre o modal para adicionar um novo curso
    document.getElementById("addCursoBtn").addEventListener("click", () => {
      cursoEditando = null;
      el.formTitle.textContent = "Adicionar Novo Curso";
      el.btnSubmit.textContent = "Salvar Curso";
      el.formNovoCurso.reset();
      preencherCheckboxCoordenadores();
      el.modalNovoCurso.classList.remove("hidden");
    });

    // Submissão do formulário (criação/edição)
    el.formNovoCurso.addEventListener("submit", async (e) => {
      e.preventDefault();
      const selecionados = getCoordenadoresSelecionados();
      if (selecionados.length === 0)
        return mostrarToast("Você precisa vincular ao menos 1 coordenador.");

      const novoCurso = {
        id: cursoEditando ? cursoEditando.id : undefined,
        nome: el.cursoNome.value,
        status: el.cursoStatus.value,
        coordenadores: selecionados,
        data: cursoEditando
          ? cursoEditando.data
          : new Date().toLocaleDateString("pt-BR"),
        observacoes: el.cursoObs.value,
      };

      if (cursoEditando) {
        await atualizarCurso(novoCurso);
      } else {
        await adicionarCurso(novoCurso);
      }
      el.modalNovoCurso.classList.add("hidden");
      el.formNovoCurso.reset();
    });

    // Eventos de confirmação de exclusão
    el.btnCancelarExclusao.addEventListener("click", () =>
      el.modalConfirmar.classList.add("hidden")
    );
    el.btnConfirmarExclusao.addEventListener("click", async () => {
      if (cursoParaExcluir) {
        await excluirCurso(cursoParaExcluir.id);
        el.modalConfirmar.classList.add("hidden");
        cursoParaExcluir = null;
      }
    });

    // Fechar os modais via botão (modal-close)
    document.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.closest(".modal").classList.add("hidden");
        el.formNovoCurso.reset();
        el.formTitle.textContent = "Adicionar Novo Curso";
        el.btnSubmit.textContent = "Salvar Curso";
        cursoEditando = null;
      });
    });

    preencherCheckboxCoordenadores();
    fetchCursos();
  }, []);

  return (
    <SidebarLayout>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Gerenciar Cursos</h1>
          <button
            id="addCursoBtn"
            className="botao-primario"
            aria-label="Adicionar novo curso"
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
            <tbody id="listaCursos"></tbody>
          </table>
        </section>

        {/* Modal: Coordenadores vinculados */}
        <div
          id="modalCoordenadores"
          className="modal hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tituloCoordenadores"
        >
          <div className="modal-content">
            <span
              className="modal-close"
              aria-label="Fechar modal coordenadores"
            >
              &times;
            </span>
            <h2 id="tituloCoordenadores">Coordenadores vinculados</h2>
            <ul id="listaCoordenadores"></ul>
          </div>
        </div>

        {/* Modal: Aviso de exclusão bloqueada */}
        <div
          id="modalAviso"
          className="modal hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mensagemAviso"
        >
          <div className="modal-content">
            <span className="modal-close" aria-label="Fechar aviso">
              &times;
            </span>
            <p id="mensagemAviso">
              Este curso está ativo. Inative o curso antes de excluí-lo.
            </p>
          </div>
        </div>

        {/* Modal: Adicionar/Editar curso */}
        <div
          id="modalNovoCurso"
          className="modal hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tituloNovoCurso"
        >
          <div className="modal-content">
            <span
              className="modal-close"
              aria-label="Fechar formulário de novo curso"
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
              <div id="cursoCoordsCheckboxes"></div>
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

        {/* Modal de Confirmação de Exclusão */}
        <div
          id="modalConfirmarExclusao"
          className="modal hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content">
            <span
              className="modal-close"
              aria-label="Fechar modal de confirmação"
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
              <button id="btnCancelarExclusao">Cancelar</button>
              <button
                id="btnConfirmarExclusao"
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
      </main>
    </SidebarLayout>
  );
}

export default Cursos;
