import { useEffect, useState } from "react";
import SidebarLayout from "../../../../components/SidebarLayout";
import SidebarAgenda from "../../../../components/SideBarAgenda";

function TiposAtendimento() {
  const [programas, setProgramas] = useState([]);
  // const [tiposAtendimento, setTiposAtendimento] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalConfirmarAberto, setModalConfirmarAberto] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    sigla: "",
    descricao: "",
    publicoAlvo: "",
    duracao: "",
    frequencia: "",
    visibilidade: "",
    instrucoesAluno: "",
    orientacoesPublicas: "",
    programaId: "",
    status: "ativo",
  });
  const [textoConfirmar] = useState("");

  useEffect(() => {
    // Simular fetch inicial dos programas e tipos de atendimento
    setProgramas([
      { id: 1, nome: "Programa A" },
      { id: 2, nome: "Programa B" },
    ]);
    // setTiposAtendimento([]);
  }, []);

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);
  // const abrirConfirmar = (texto) => {
  //   setTextoConfirmar(texto);
  //   setModalConfirmarAberto(true);
  // };
  const fecharConfirmar = () => setModalConfirmarAberto(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // lógica para salvar tipo de atendimento
    fecharModal();
  };

  return (
    <SidebarLayout>
      <SidebarAgenda>
        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1 className="dashboard-title">Tipos de Atendimento</h1>
            <button className="botao-primario" onClick={abrirModal}>
              + Novo Tipo de Atendimento
            </button>
          </header>

          <section className="filters-section">
            <label htmlFor="filtroPrograma">Filtrar por Programa:</label>
            <select id="filtroPrograma">
              {programas.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.nome}
                </option>
              ))}
            </select>
          </section>

          <section className="tabela-conteudos">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Sigla</th>
                  <th>Duração</th>
                  <th>Público-alvo</th>
                  <th>Visibilidade</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody id="listaTipos">{/* Conteúdo da tabela vai aqui */}</tbody>
            </table>
          </section>

          {modalAberto && (
            <div className="modal">
              <div className="modal-content">
                <span className="modal-close" onClick={fecharModal}>
                  &times;
                </span>
                <h2>💼 Novo Tipo de Atendimento</h2>
                <form className="form-grid" onSubmit={handleSubmit}>
                  <label htmlFor="nome">Nome*</label>
                  <input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="sigla">Sigla Interna*</label>
                  <input
                    id="sigla"
                    name="sigla"
                    value={formData.sigla}
                    onChange={handleChange}
                    required
                    maxLength="10"
                  />

                  <label htmlFor="descricao">Descrição Completa*</label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    rows="4"
                    required
                  ></textarea>

                  <label htmlFor="publicoAlvo">Público-Alvo*</label>
                  <input
                    id="publicoAlvo"
                    name="publicoAlvo"
                    value={formData.publicoAlvo}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="duracao">Duração Padrão (minutos)*</label>
                  <input
                    id="duracao"
                    name="duracao"
                    type="number"
                    value={formData.duracao}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="frequencia">Frequência Ideal</label>
                  <input
                    id="frequencia"
                    name="frequencia"
                    value={formData.frequencia}
                    onChange={handleChange}
                  />

                  <label htmlFor="visibilidade">Visibilidade*</label>
                  <select
                    id="visibilidade"
                    name="visibilidade"
                    value={formData.visibilidade}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Selecione --</option>
                    <option value="Aluno e Beneficiário">
                      Aluno e Beneficiário
                    </option>
                    <option value="Somente Aluno">Somente Aluno</option>
                    <option value="Somente Coordenador">
                      Somente Coordenador
                    </option>
                  </select>

                  <label htmlFor="instrucoesAluno">Instruções ao Aluno</label>
                  <textarea
                    id="instrucoesAluno"
                    name="instrucoesAluno"
                    value={formData.instrucoesAluno}
                    onChange={handleChange}
                  ></textarea>

                  <label htmlFor="orientacoesPublicas">
                    Orientações Públicas
                  </label>
                  <textarea
                    id="orientacoesPublicas"
                    name="orientacoesPublicas"
                    value={formData.orientacoesPublicas}
                    onChange={handleChange}
                  ></textarea>

                  <label htmlFor="programaId">Programa Vinculado*</label>
                  <select
                    id="programaId"
                    name="programaId"
                    value={formData.programaId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Selecione --</option>
                    {programas.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.nome}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="status">Status*</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>

                  <button type="submit" className="botao-primario">
                    Salvar Tipo de Atendimento
                  </button>
                </form>
              </div>
            </div>
          )}

          {modalConfirmarAberto && (
            <div className="modal">
              <div className="modal-content">
                <p>{textoConfirmar}</p>
                <div
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "1rem",
                  }}
                >
                  <button className="botao-primario" onClick={fecharConfirmar}>
                    Cancelar
                  </button>
                  <button className="btn-inativar">Confirmar</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </SidebarAgenda>
    </SidebarLayout>
  );
}

export default TiposAtendimento;
