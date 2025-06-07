import { useState } from "react";
import "../../dashboard/styleimp.css";
import SidebarLayout from "../../../components/SidebarLayout"; // Importa o layout da barra lateral

const ImportarUsuarios = () => {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [resumo] = useState({ total: 0, validos: 0, erros: 0 });

  const handleArquivoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivo(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setArquivo(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleImportar = () => {
    alert("Usuários importados com sucesso!");
  };

  return (
    <SidebarLayout>
      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Importação de Usuários</h1>
        </header>

        {/* Passo 1 */}
        <div className="card">
          <h2>1. Tipo de Usuário</h2>
          <label>
            <select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
            >
              <option value="">-- Selecione --</option>
              <option value="coordenador">Coordenador</option>
              <option value="aluno">Aluno</option>
              <option value="beneficiario">Beneficiário</option>
            </select>
          </label>
          <p className="info-lista">
            {tipoUsuario && `Campos obrigatórios para ${tipoUsuario}`}
          </p>
          <a
            href={`/modelos/modelo-${tipoUsuario || "padrao"}.csv`}
            download
            className="link-modelo"
          >
            📥 Baixar modelo (.csv)
          </a>
        </div>

        {/* Passo 2 */}
        <div className="card">
          <h2>2. Upload da Planilha</h2>
          <div
            id="dropzone"
            className="dropzone"
            aria-label="Arraste e solte ou clique para selecionar"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("arquivoInput").click()}
          >
            <p>
              Arraste o arquivo aqui ou clique para selecionar (.csv ou .xlsx,
              max. 5MB)
            </p>
            <input
              type="file"
              id="arquivoInput"
              accept=".csv,.xlsx"
              hidden
              onChange={handleArquivoChange}
            />
          </div>
          <p>
            {arquivo
              ? `Arquivo selecionado: ${arquivo.name}`
              : "Nenhum arquivo selecionado."}
          </p>
        </div>

        {/* Passo 3 */}
        <div className="card">
          <h2>3. Validação dos Dados</h2>
          <div style={{ paddingBottom: 25 }}>
            Total: {resumo.total} | Válidos: {resumo.validos} | Com erro:{" "}
            {resumo.erros}
          </div>
          <table className="tabela-validacao">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Dados fictícios para exemplo */}
              <tr>
                <td>João Silva</td>
                <td>joao@email.com</td>
                <td>✔ Válido</td>
              </tr>
            </tbody>
          </table>

          <button className={resumo.erros > 0 ? "" : "hidden"}>
            ⬇ Baixar erros (.csv)
          </button>
        </div>

        {/* Passo 4 */}
        <div className="card">
          <h2>4. Ação</h2>
          <button
            className="btn-sucesso"
            onClick={handleImportar}
            disabled={!arquivo || !tipoUsuario}
          >
            Importar Usuários
          </button>
        </div>
      </main>

      {/* Toast */}
      <div id="toast" className="toast hidden"></div>
    </SidebarLayout>
  );
};

export default ImportarUsuarios;
