import { useState } from "react";
import "../../dashboard/styleconf.css";
import SidebarLayout from "../../../components/SidebarLayout";

function Config() {
  const [coordAprova, setCoordAprova] = useState(false);
  const [aprovManual, setAprovManual] = useState(false);
  const [notificaEmail, setNotificaEmail] = useState(false);
  const [notificaSMS, setNotificaSMS] = useState(false);
  const [emailInstitucional, setEmailInstitucional] = useState(
    "notificacoes@iesb.br"
  );
  const [textoTermo, setTextoTermo] = useState("");
  const [coordPermissoes, setCoordPermissoes] = useState({
    aprova: false,
    edita: false,
    dados: false,
  });

  const preVisualizarTermo = () => {
    alert("Pré-visualizar Termo:\n\n" + textoTermo);
  };

  const salvarPermissoes = () => {
    console.log("Permissões salvas:", coordPermissoes);
    alert("Permissões salvas com sucesso!");
  };

  return (
    // Corrected: SidebarLayout needs to wrap the main content and be closed
    <SidebarLayout>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Configurações Gerais</h1>
        </header>

        <div className="config-container">
          {/* Regras de Aprovação */}
          <div className="config-section">
            <h2>Regras de Aprovação</h2>
            <label>
              <input
                type="checkbox"
                checked={coordAprova}
                onChange={(e) => setCoordAprova(e.target.checked)}
              />
              Permitir que o coordenador aprove beneficiários
            </label>
            <label>
              <input
                type="checkbox"
                checked={aprovManual}
                onChange={(e) => setAprovManual(e.target.checked)}
              />
              Aprovação manual de alunos
            </label>
          </div>

          {/* Notificações */}
          <div className="card">
            <h2>Envio de Notificações</h2>
            <label>
              <input
                type="checkbox"
                checked={notificaEmail}
                onChange={(e) => setNotificaEmail(e.target.checked)}
              />
              Ativar notificações por e-mail
            </label>
            <label>
              <input
                type="checkbox"
                checked={notificaSMS}
                onChange={(e) => setNotificaSMS(e.target.checked)}
              />
              Ativar envio de SMS
            </label>
            <label>
              Email institucional padrão
              <input
                type="email"
                value={emailInstitucional}
                onChange={(e) => setEmailInstitucional(e.target.value)}
                placeholder="notificacoes@iesb.br"
              />
            </label>
          </div>

          {/* Termos de Uso */}
          <div className="config-section">
            <h2>Termos de Uso e LGPD</h2>
            <label htmlFor="textoDoTermo">Texto do Termo</label>{" "}
            {/* Separado */}
            <textarea
              id="textoDoTermo" // Adicionado ID para associação com a label
              value={textoTermo}
              onChange={(e) => setTextoTermo(e.target.value)}
              rows="6"
            />
            {/* FIM DA MUDANÇA */}
            <p style={{ marginBottom: "1rem", color: "var(--cinza-texto)" }}>
              Última atualização: 30/04/2025
            </p>
            <button id="btnPreVisualizarTermo" onClick={preVisualizarTermo}>
              Pré-visualizar Termo
            </button>
          </div>

          {/* Permissões por Perfil */}
          <div className="card">
            <h2>Permissões por Perfil</h2>
            <table className="permissoes-tabela">
              <thead>
                <tr>
                  <th>Permissão</th>
                  <th>Admin</th>
                  <th>Coordenador</th>
                  <th>Aluno</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pode aprovar beneficiário</td>
                  <td>✅</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={coordPermissoes.aprova}
                      onChange={(e) =>
                        setCoordPermissoes({
                          ...coordPermissoes,
                          aprova: e.target.checked,
                        })
                      }
                    />
                  </td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td>Pode editar prontuário</td>
                  <td>✅</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={coordPermissoes.edita}
                      onChange={(e) =>
                        setCoordPermissoes({
                          ...coordPermissoes,
                          edita: e.target.checked,
                        })
                      }
                    />
                  </td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td>Pode editar dados do beneficiário</td>
                  <td>✅</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={coordPermissoes.dados}
                      onChange={(e) =>
                        setCoordPermissoes({
                          ...coordPermissoes,
                          dados: e.target.checked,
                        })
                      }
                    />
                  </td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td>Pode exportar relatórios</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>❌</td>
                </tr>
              </tbody>
            </table>
            <button id="btnSalvarPermissoes" onClick={salvarPermissoes}>
              Salvar Permissões
            </button>
          </div>
        </div>
      </main>
    </SidebarLayout> // Corrected: Closing SidebarLayout
  );
}

export default Config;
