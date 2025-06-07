import SidebarLayout from "../../../components/SidebarLayout";
import { useState } from "react";

function ConteudoInstitucional() {
  const [conteudos, setConteudos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [itemParaExcluir, setItemParaExcluir] = useState(null);

  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [publico, setPublico] = useState([]);
  const [status, setStatus] = useState("rascunho");
  const [textoInformativo, setTextoInformativo] = useState("");

  const [filtroTitulo, setFiltroTitulo] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroPublico, setFiltroPublico] = useState("");

  const limparFormulario = () => {
    setTitulo("");
    setTipo("");
    setPublico([]);
    setStatus("rascunho");
    setTextoInformativo("");
  };

  const salvarConteudo = (e) => {
    e.preventDefault();
    if (!titulo) {
      alert("Título é obrigatório");
      return;
    }
    const novo = {
      id: Date.now(),
      titulo,
      tipo,
      publico,
      status,
      textoInformativo,
    };
    setConteudos([...conteudos, novo]);
    limparFormulario();
    setModalAberto(false);
  };

  const confirmarExclusao = () => {
    setConteudos(conteudos.filter((item) => item.id !== itemParaExcluir.id));
    setModalExcluirAberto(false);
    setItemParaExcluir(null);
  };

  const alternarPublico = (valor) => {
    if (publico.includes(valor)) {
      setPublico(publico.filter((p) => p !== valor));
    } else {
      setPublico([...publico, valor]);
    }
  };

  const conteudosFiltrados = conteudos.filter((c) => {
    return (
      c.titulo.toLowerCase().includes(filtroTitulo.toLowerCase()) &&
      (filtroTipo ? c.tipo === filtroTipo : true) &&
      (filtroStatus ? c.status === filtroStatus : true) &&
      (filtroPublico ? c.publico.includes(filtroPublico) : true)
    );
  });

  const estilos = {
    h1: { color: "#4a0202", fontWeight: "bold", marginBottom: 16 },
    btnAdicionar: {
      backgroundColor: "#b40c0c",
      color: "white",
      padding: "8px 15px",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      float: "right",
      marginBottom: 10,
      fontWeight: "bold",
    },
    filtrosContainer: { marginBottom: 15 },
    inputSelect: {
      padding: 8,
      borderRadius: 6,
      border: "1px solid #f4cccc",
      backgroundColor: "#f7dada",
      marginRight: 8,
      color: "#000",
    },
    tabela: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: 15,
    },
    thtd: {
      padding: 10,
      textAlign: "left",
      border: "1px solid #eee",
    },
    th: {
      backgroundColor: "#fafafa",
      fontWeight: "bold",
    },
    semConteudo: {
      textAlign: "center",
      padding: 20,
      color: "#555",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContainer: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 20,
      width: 450,
      maxHeight: "80vh",
      overflowY: "auto",
      boxShadow: "0 0 10px rgba(0,0,0,0.25)",
      position: "relative",
      color: "#4a0202",
      fontFamily: "Arial, sans-serif",
    },
    modalTitle: {
      fontWeight: "bold",
      fontSize: 20,
      marginBottom: 15,
      color: "#4a0202",
    },
    label: {
      fontWeight: "bold",
      marginTop: 10,
      display: "block",
      marginBottom: 6,
      color: "#4a0202",
    },
    input: {
      width: "100%",
      padding: "8px 10px",
      borderRadius: 6,
      border: "1px solid #f4cccc",
      backgroundColor: "#f7dada",
      fontSize: 14,
      color: "#000",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "8px 10px",
      borderRadius: 6,
      border: "1px solid #f4cccc",
      backgroundColor: "#f7dada",
      fontSize: 14,
      color: "#000",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      minHeight: 80,
      padding: "8px 10px",
      borderRadius: 6,
      border: "1px solid #f4cccc",
      backgroundColor: "#f7dada",
      fontSize: 14,
      color: "#000",
      boxSizing: "border-box",
      resize: "vertical",
    },
    fieldset: {
      border: "1px solid #f4cccc",
      borderRadius: 6,
      padding: 10,
      marginTop: 15,
      color: "#4a0202",
    },
    legend: {
      fontWeight: "bold",
      padding: "0 6px",
      color: "#4a0202",
    },
    checkboxLabel: {
      display: "block",
      marginTop: 6,
      cursor: "pointer",
      fontWeight: "normal",
    },
    btnSalvar: {
      backgroundColor: "#b40c0c",
      color: "white",
      border: "none",
      padding: "8px 15px",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "bold",
      marginRight: 10,
      marginTop: 15,
    },
    btnCancelar: {
      backgroundColor: "#ccc",
      color: "#333",
      border: "none",
      padding: "8px 15px",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "bold",
      marginTop: 15,
    },
    btnClose: {
      position: "absolute",
      top: 10,
      right: 15,
      background: "transparent",
      border: "none",
      fontWeight: "bold",
      fontSize: 18,
      cursor: "pointer",
      color: "#b40c0c",
    },
  };

  return (
    <SidebarLayout>
      <div style={{ padding: 20 }}>
        <h1 style={estilos.h1}>Conteúdo Institucional</h1>
        <button
          style={estilos.btnAdicionar}
          onClick={() => setModalAberto(true)}
        >
          + Adicionar Novo Conteúdo
        </button>

        <div style={estilos.filtrosContainer}>
          <input
            type="text"
            placeholder="Buscar por título..."
            style={estilos.inputSelect}
            value={filtroTitulo}
            onChange={(e) => setFiltroTitulo(e.target.value)}
          />
          <select
            style={estilos.inputSelect}
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="">Todos os tipos</option>
            <option value="PDF">PDF</option>
            <option value="Vídeo">Vídeo</option>
            <option value="Texto">Texto</option>
          </select>
          <select
            style={estilos.inputSelect}
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="publicado">Publicado</option>
            <option value="rascunho">Rascunho</option>
          </select>
          <select
            style={estilos.inputSelect}
            value={filtroPublico}
            onChange={(e) => setFiltroPublico(e.target.value)}
          >
            <option value="">Todos os públicos</option>
            <option value="Aluno">Aluno</option>
            <option value="Coordenador">Coordenador</option>
            <option value="Beneficiário">Beneficiário</option>
          </select>
        </div>

        <table style={estilos.tabela}>
          <thead>
            <tr>
              <th style={{ ...estilos.thtd, ...estilos.th }}>Título</th>
              <th style={{ ...estilos.thtd, ...estilos.th }}>Tipo</th>
              <th style={{ ...estilos.thtd, ...estilos.th }}>Público-Alvo</th>
              <th style={{ ...estilos.thtd, ...estilos.th }}>Status</th>
              <th style={{ ...estilos.thtd, ...estilos.th }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {conteudosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" style={estilos.semConteudo}>
                  Nenhum conteúdo cadastrado até o momento.
                </td>
              </tr>
            ) : (
              conteudosFiltrados.map((item) => (
                <tr key={item.id}>
                  <td style={estilos.thtd}>{item.titulo}</td>
                  <td style={estilos.thtd}>{item.tipo}</td>
                  <td style={estilos.thtd}>{item.publico.join(", ")}</td>
                  <td style={estilos.thtd}>{item.status}</td>
                  <td style={estilos.thtd}>
                    <button
                      onClick={() => {
                        setItemParaExcluir(item);
                        setModalExcluirAberto(true);
                      }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {modalAberto && (
          <div style={estilos.modalOverlay}>
            <div style={estilos.modalContainer}>
              <button
                style={estilos.btnClose}
                onClick={() => setModalAberto(false)}
                aria-label="Fechar modal"
              >
                ×
              </button>
              <h2 style={estilos.modalTitle}>Adicionar Novo Conteúdo</h2>
              <form onSubmit={salvarConteudo}>
                <label style={estilos.label}>
                  Título*
                  <input
                    style={estilos.input}
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    placeholder="Título do Conteúdo"
                  />
                </label>

                <label style={estilos.label}>
                  Tipo de Conteúdo
                  <select
                    style={estilos.select}
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="PDF">PDF</option>
                    <option value="Vídeo">Vídeo</option>
                    <option value="Texto">Texto</option>
                  </select>
                </label>

                {tipo === "Texto" && (
                  <label style={estilos.label}>
                    Texto Informativo*
                    <textarea
                      style={estilos.textarea}
                      value={textoInformativo}
                      onChange={(e) => setTextoInformativo(e.target.value)}
                      required
                    />
                  </label>
                )}

                <fieldset style={estilos.fieldset}>
                  <legend style={estilos.legend}>Público-Alvo</legend>
                  {["Aluno", "Coordenador", "Beneficiário"].map((p) => (
                    <label key={p} style={estilos.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={publico.includes(p)}
                        onChange={() => alternarPublico(p)}
                      />{" "}
                      {p}
                    </label>
                  ))}
                </fieldset>

                <label style={estilos.label}>
                  Status
                  <select
                    style={estilos.select}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="rascunho">Rascunho</option>
                    <option value="publicado">Publicado</option>
                  </select>
                </label>

                <div>
                  <button type="submit" style={estilos.btnSalvar}>
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalAberto(false)}
                    style={estilos.btnCancelar}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal excluir */}
        {modalExcluirAberto && (
          <div style={estilos.modalOverlay}>
            <div style={estilos.modalContainer}>
              <p>Tem certeza que deseja remover este conteúdo?</p>
              <button
                onClick={() => setModalExcluirAberto(false)}
                style={estilos.btnCancelar}
              >
                Cancelar
              </button>
              <button onClick={confirmarExclusao} style={estilos.btnSalvar}>
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}

export default ConteudoInstitucional;
