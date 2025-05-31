import SidebarLayout from "../../../components/SidebarLayout";
import { useEffect } from "react";
import "../styledash.css";

function Cursos() {
  useEffect(() => {
    // 🔧 Utilitários locais
    const salvarLocal = (chave, valor) =>
      localStorage.setItem(chave, JSON.stringify(valor));
    const carregarLocal = (chave) =>
      JSON.parse(localStorage.getItem(chave)) || null;
    const mostrarToast = (mensagem) => alert(mensagem); // Substituir futuramente por um toast visual

    // 📋 Dados simulados
    const coordenadoresDisponiveis = [
      "Maria Oliveira",
      "João Silva",
      "Carla Souza",
      "Ana Paula",
    ];
    let cursos = carregarLocal("cursos") || [
      {
        id: 1,
        nome: "Psicologia",
        status: "ativo",
        coordenadores: ["Maria Oliveira", "João Silva"],
        data: "10/01/2023",
      },
      {
        id: 2,
        nome: "Nutrição",
        status: "inativo",
        coordenadores: [],
        data: "21/03/2023",
      },
    ];

    let cursoEditando = null;
    let cursoParaExcluir = null;
    let filtroAtual = "todos";

    // 🔁 DOM Elements
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

    const renderizarCursos = () => {
      el.listaCursos.innerHTML = "";
      const termoBusca = el.buscaInput.value.toLowerCase();
      const filtrados = cursos.filter(
        (c) =>
          c.nome.toLowerCase().includes(termoBusca) &&
          (filtroAtual === "todos" || c.status === filtroAtual)
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
        toggle.onclick = () => {
          curso.status = curso.status === "ativo" ? "inativo" : "ativo";
          salvarLocal("cursos", cursos);
          renderizarCursos();
        };
        tdStatus.appendChild(toggle);

        const tdCoord = document.createElement("td");
        const coordBtn = document.createElement("button");
        coordBtn.textContent = `${curso.coordenadores.length} coordenador(es)`;
        coordBtn.onclick = () => {
          el.listaCoordenadores.innerHTML = "";
          curso.coordenadores.forEach((nome) => {
            const li = document.createElement("li");
            li.textContent = nome;
            el.listaCoordenadores.appendChild(li);
          });
          el.modalCoordenadores.classList.remove("hidden");
        };
        tdCoord.appendChild(coordBtn);

        const tdData = document.createElement("td");
        tdData.textContent = curso.data;

        const tdAcoes = document.createElement("td");
        [
          {
            icon: "✏️",
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
            handler: () =>
              mostrarToast("Função de visualização não implementada."),
          },
        ].forEach(({ icon, handler }) => {
          const btn = document.createElement("button");
          btn.textContent = icon;
          btn.onclick = handler;
          tdAcoes.appendChild(btn);
        });

        tr.append(tdNome, tdStatus, tdCoord, tdData, tdAcoes);
        el.listaCursos.appendChild(tr);
      });
    };

    el.filtroBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        el.filtroBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        filtroAtual = btn.dataset.status;
        renderizarCursos();
      });
    });

    el.buscaInput.addEventListener("input", renderizarCursos);
    document.getElementById("addCursoBtn").addEventListener("click", () => {
      cursoEditando = null;
      el.formTitle.textContent = "Adicionar Novo Curso";
      el.btnSubmit.textContent = "Salvar Curso";
      el.formNovoCurso.reset();
      preencherCheckboxCoordenadores();
      el.modalNovoCurso.classList.remove("hidden");
    });

    el.formNovoCurso.addEventListener("submit", (e) => {
      e.preventDefault();
      const selecionados = getCoordenadoresSelecionados();
      if (selecionados.length === 0)
        return mostrarToast("Você precisa vincular ao menos 1 coordenador.");

      const novoCurso = {
        id: cursoEditando ? cursoEditando.id : Date.now(),
        nome: el.cursoNome.value,
        status: el.cursoStatus.value,
        coordenadores: selecionados,
        data: cursoEditando
          ? cursoEditando.data
          : new Date().toLocaleDateString("pt-BR"),
        observacoes: el.cursoObs.value,
      };

      if (cursoEditando) {
        cursos = cursos.map((c) => (c.id === cursoEditando.id ? novoCurso : c));
      } else {
        cursos.push(novoCurso);
      }

      salvarLocal("cursos", cursos);
      mostrarToast("Curso salvo com sucesso.");
      el.modalNovoCurso.classList.add("hidden");
      el.formNovoCurso.reset();
      renderizarCursos();
    });

    el.btnCancelarExclusao.addEventListener("click", () =>
      el.modalConfirmar.classList.add("hidden")
    );
    el.btnConfirmarExclusao.addEventListener("click", () => {
      if (cursoParaExcluir) {
        cursos = cursos.filter((c) => c.id !== cursoParaExcluir.id);
        salvarLocal("cursos", cursos);
        renderizarCursos();
        mostrarToast("Curso excluído com sucesso.");
        el.modalConfirmar.classList.add("hidden");
        cursoParaExcluir = null;
      }
    });

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
    renderizarCursos();
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
              Este curso possui programas ativos vinculados. Para excluir,
              inative ou remova os programas primeiro.
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
              <div id="cursoCoordsCheckboxes">
                {/* Checkboxes gerados via JS */}
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
