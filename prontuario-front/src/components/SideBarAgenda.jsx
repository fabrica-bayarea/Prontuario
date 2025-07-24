import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../pages/dashboard/global.css"; // Importando o CSS global

const SideBarAgenda = ({ children }) => {
  const navigate = useNavigate();

  const containerStyle = {
    display: "flex",
    flexDirection: "column", // agora a navegação vai em cima
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  };

  const sidebarStyle = {
    width: "100%",
    backgroundColor: "#fde5e5",
    padding: "10px",
  };

  const navStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: "20px",
    listStyle: "none",
    padding: 0,
    margin: 0,
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px 30px",
    backgroundColor: " #fde5e5",
    color: "#333",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    textAlign: "left",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    whiteSpace: "nowrap", // evita quebra de linha
  };

  const mainContentStyle = {
    flex: 1,
    padding: "32px",
    backgroundColor: "#ffffff",
    overflowY: "auto",
  };

  const TextStyle = {
    fontWeight: "bold",
    color: "#333",
  };

  return (
    <div style={containerStyle}>
      {/* Barra lateral */}
      <p style={TextStyle}>Gerenciar:</p>
      <div style={sidebarStyle} aria-label="Menu de Navegação">
        <nav>
          <ul style={navStyle}>
            <li>
              <button
                style={buttonStyle}
                onClick={() =>
                  navigate("/dashboard/administrador/agendamentos")
                }
              >
                Agendamentos
              </button>
            </li>
            <li>
              <button
                style={buttonStyle}
                onClick={() =>
                  navigate("/dashboard/administrador/tiposatendimento")
                }
              >
                Tipos de Atendimento
              </button>
            </li>
            <li>
              <button style={buttonStyle}>Programas</button>
            </li>
            <li>
              <button style={buttonStyle}>Escalas</button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Conteúdo principal */}
      <div style={mainContentStyle}>{children}</div>
    </div>
  );
};

SideBarAgenda.propTypes = {
  children: PropTypes.node,
};

export default SideBarAgenda;
