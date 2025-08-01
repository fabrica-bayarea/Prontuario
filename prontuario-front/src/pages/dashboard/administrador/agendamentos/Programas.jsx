import React, { useState } from "react";
import SidebarLayout from "../../../../components/SidebarLayout";
import SidebarAgenda from "../../../../components/SideBarAgenda"; 

 function Programas() {
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModal = () => setMostrarModal(true);
  const fecharModal = () => setMostrarModal(false);

  return (
    <SidebarLayout>
      <SidebarAgenda>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Gerenciamento de Programas</h1>
          <button onClick={abrirModal}>+ Novo Programa</button>
        </header>

        {/* Filtros */}
        <section className="filters-section">
          <select id="filtroStatus">
            <option value="">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
          <select id="filtroTipo">
            <option value="">Todos os Tipos</option>
            <option value="clínico">Clínico</option>
            <option value="jurídico">Jurídico</option>
            <option value="pedagógico">Pedagógico</option>
          </select>
          <input type="date" id="filtroDataInicio" />
          <input type="date" id="filtroDataFim" />
        </section>

        {/* Tabela */}
        <section className="tabela-conteudos">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Período</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="listaProgramas">
              {/* Preenchido por JS futuramente */}
            </tbody>
          </table>
        </section>
      </main>

      {/* MODAL */}
      {mostrarModal && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTituloPrograma">
          <div className="modal-content">
            <button className="modal-close" onClick={fecharModal} aria-label="Fechar Modal">
              ×
            </button>
            <h2 id="modalTituloPrograma">Cadastro de Programa</h2>

            <form id="formPrograma">
              <input type="hidden" id="programaId" name="programaId" />

              <label htmlFor="nomePrograma">Nome do Programa*</label>
              <input type="text" id="nomePrograma" name="nomePrograma" required />

              <label htmlFor="descricaoPrograma">Descrição</label>
              <textarea id="descricaoPrograma" name="descricaoPrograma" rows="3"></textarea>

              <label htmlFor="statusPrograma">Status</label>
              <select id="statusPrograma" name="statusPrograma">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>

              <label htmlFor="tipoPrograma">Tipo de Programa</label>
              <select id="tipoPrograma" name="tipoPrograma">
                <option value="clinico">Clínico</option>
                <option value="juridico">Jurídico</option>
                <option value="pedagogico">Pedagógico</option>
              </select>

              <label htmlFor="salaPrograma">Salas/Recursos</label>
              <input type="text" id="salaPrograma" name="salaPrograma" />

              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="inicioPrograma">Início</label>
                  <input type="date" id="inicioPrograma" name="inicioPrograma" />
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor="fimPrograma">Término</label>
                  <input type="date" id="fimPrograma" name="fimPrograma" />
                </div>
              </div>

              <label htmlFor="assistentesPrograma">Coordenadores Assistentes</label>
              <input type="text" id="assistentesPrograma" name="assistentesPrograma" placeholder="Separar nomes por vírgula" />

              <input type="hidden" id="cursoPrograma" name="cursoPrograma" value="Psicologia" />

              <button type="submit" disabled>
                Salvar Programa
              </button>
            </form>
          </div>
        </div>
      )}
   </SidebarAgenda>
       </SidebarLayout>
  );
}
export default Programas;