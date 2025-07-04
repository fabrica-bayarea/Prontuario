import SidebarLayout from "../../../components/SidebarLayout";
import "../styledash.css";
import { useState, useEffect } from "react";

function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [programas] = useState(
    JSON.parse(localStorage.getItem("programas")) || []
  );
  const [tipos] = useState(
    JSON.parse(localStorage.getItem("tiposAtendimento")) || []
  );
  const [alunos] = useState(
    JSON.parse(localStorage.getItem("alunosSistema")) || []
  );
  const [filtros, setFiltros] = useState({
    programa: "",
    tipo: "",
    status: "",
    busca: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [formAgendamento, setFormAgendamento] = useState({
    beneficiario: "",
    programa: "",
    tipo: "",
    aluno: "",
    data: "",
    turno: "",
  });

  // CARREGA OS AGENDAMENTOS DO BACKEND AO MONTAR
  useEffect(() => {
    fetch("http://localhost:3000/agendamentos")
      .then((res) => res.json())
      .then((data) => setAgendamentos(data))
      .catch((err) => console.error("Erro ao carregar agendamentos:", err));
  }, []);

  //localStorage.setItem removido daqui, para não salvar localmente

  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.id.replace("filtro", "").toLowerCase()]: e.target.value,
    });
  };

  const handleInputChange = (e) => {
    setFormAgendamento({
      ...formAgendamento,
      [e.target.id.replace("Agendamento", "").toLowerCase()]: e.target.value,
    });
  };

  const salvarAgendamento = async (e) => {
    e.preventDefault();
    const novo = {
      id: Date.now().toString(),
      ...formAgendamento,
      status: "agendado",
    };

    console.log("Dados do novo agendamento:", novo);

    if (Object.values(novo).some((val) => val === "")) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setAgendamentos([...agendamentos, novo]);
    setShowModal(false);

    try {
      const res = await fetch("http://localhost:3000/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novo),
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      const agendamentoCriado = await res.json();
      setAgendamentos([...agendamentos, agendamentoCriado]);
      setShowModal(false);
    } catch (err) {
      alert("Erro ao salvar agendamento");
      console.error(err);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/agendamentos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar");

      const atualizado = await res.json();
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === id ? atualizado : a))
      );
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao atualizar agendamento");
    }
  };

  const agendamentosFiltrados = agendamentos
    .filter((a) => !filtros.programa || a.programa === filtros.programa)
    .filter((a) => !filtros.tipo || a.tipo === filtros.tipo)
    .filter((a) => !filtros.status || a.status === filtros.status)
    .filter(
      (a) =>
        !filtros.busca ||
        a.beneficiario.toLowerCase().includes(filtros.busca.toLowerCase())
    );

  return (
    <SidebarLayout>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Agendamentos</h1>

          <button
            id="btnNovoAgendamento"
            onClick={() => setShowModal(true)}
            className="botao-primario"
          >
            + Novo Agendamento
          </button>
        </header>

        <section className="filters-section">
          <input
            type="text"
            id="buscaBeneficiario"
            placeholder="Buscar beneficiário..."
            onChange={handleFiltroChange}
          />
          <select id="filtroPrograma" onChange={handleFiltroChange}>
            <option value="">Todos os Programas</option>
            {programas.map((p) => (
              <option key={p.nome}>{p.nome}</option>
            ))}
          </select>
          <select id="filtroTipo" onChange={handleFiltroChange}>
            <option value="">Todos os Tipos</option>
            {tipos.map((t) => (
              <option key={t.nome}>{t.nome}</option>
            ))}
          </select>
          <select id="filtroStatus" onChange={handleFiltroChange}>
            <option value="">Todos os Status</option>
            <option value="agendado">Agendado</option>
            <option value="realizado">Realizado</option>
            <option value="ausente">Ausente</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </section>

        <section className="tabela-conteudos">
          <table>
            <thead>
              <tr>
                <th>Beneficiário</th>
                <th>Programa</th>
                <th>Tipo</th>
                <th>Aluno</th>
                <th>Data</th>
                <th>Turno</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="tabelaAgendamentos">
              {agendamentosFiltrados.map((a) => (
                <tr key={a.id}>
                  <td>{a.beneficiario}</td>
                  <td>{a.programa}</td>
                  <td>{a.tipo}</td>
                  <td>{a.aluno}</td>
                  <td>{a.data}</td>
                  <td>{a.turno}</td>
                  <td>{a.status}</td>
                  <td>
                    <span
                      className="acao-icone"
                      title="Realizado"
                      onClick={() => atualizarStatus(a.id, "realizado")}
                    >
                      ✅
                    </span>
                    <span
                      className="acao-icone"
                      title="Ausente"
                      onClick={() => atualizarStatus(a.id, "ausente")}
                    >
                      ❌
                    </span>
                    <span
                      className="acao-icone"
                      title="Cancelar"
                      onClick={() => atualizarStatus(a.id, "cancelado")}
                    >
                      🗑️
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {showModal && (
          <div className="modal" id="modalAgendamento">
            <div className="modal-content">
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              <h2>Novo Agendamento</h2>
              <form id="formNovoAgendamento" onSubmit={salvarAgendamento}>
                <label>Beneficiário*</label>
                <input
                  type="text"
                  id="beneficiarioAgendamento"
                  onChange={handleInputChange}
                  required
                />
                <label>Programa*</label>
                <select
                  id="programaAgendamento"
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione...</option>
                  {programas.map((p) => (
                    <option key={p.nome}>{p.nome}</option>
                  ))}
                </select>
                <label>Tipo de Atendimento*</label>
                <select
                  id="tipoAgendamento"
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione...</option>
                  {tipos.map((t) => (
                    <option key={t.nome}>{t.nome}</option>
                  ))}
                </select>
                <label>Aluno*</label>
                <select
                  id="alunoAgendamento"
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione...</option>
                  {alunos.map((a) => (
                    <option key={a.nome}>{a.nome}</option>
                  ))}
                </select>
                <label>Data*</label>
                <input
                  type="date"
                  id="dataAgendamento"
                  onChange={handleInputChange}
                  required
                />
                <label>Turno*</label>
                <select
                  id="turnoAgendamento"
                  onChange={handleInputChange}
                  required
                >
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
                <button type="submit" className="btn">
                  Salvar
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </SidebarLayout>
  );
}

export default Agendamentos;
