import LogoIesb from "../assets/Images/LogoIesb.png"; // Importa a imagem do logo
import PropTypes from "prop-types";
import "../pages/dashboard/styledash.css"; // Importa o CSS do dashboard

const SidebarLayout = ({ children }) => {
  return (
    <div className="dashboard-container">
      {/* Barra lateral com navegação */}
      <div className="dashboard-sidebar" aria-label="Menu de Navegação">
        <img src={LogoIesb} alt="Logo IESB" className="logo-sidebar" />
        <nav>
          <ul>
            <li>
              <a href="/dashboard/administrador">🏠 Dashboard</a>
            </li>
            <li>
              <a href="/dashboard/administrador/cursos">📚 Cursos</a>
            </li>
            <li>
              <a href="/dashboard/administrador/cordenador">👨‍🏫 Coordenadores</a>
            </li>
            <li>
              <a href="">📥 Importar Usuários</a>
            </li>
            <li>
              <a href="">📄 Conteúdo Institucional</a>
            </li>
            <li>
              <a href="">⚙️ Configurações</a>
            </li>
            <li>
              <a href="">🧾 Logs e Auditoria</a>
            </li>
            <li>
              <a href="">📊 Relatórios</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Conteúdo principal do dashboard */}
      <div className="dashboard-main">{children}</div>
    </div>
  );
};
SidebarLayout.propTypes = {
  children: PropTypes.node,
};

export default SidebarLayout;
