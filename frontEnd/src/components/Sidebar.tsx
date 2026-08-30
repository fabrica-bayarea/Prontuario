import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import iesbemacaoIcon from '../assets/iesbemacao_icon.svg';
import painelIcon from '../assets/painel_icon.svg';
import pacientesIcon from '../assets/pacientes_icon.svg';
import triagemIcon from '../assets/triagem_icon.svg';
import validacaoIcon from '../assets/validacao_icon.svg';
import sairIcon from '../assets/sair_icon.svg';
import usuariosIcon from '../assets/usuarios_icon.svg';
import './Sidebar.css';

function Sidebar() {
  const { logout, usuario } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={iesbemacaoIcon} alt="Dashboard" className="nav-icon" />
        <h2>IESB em Ação</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              <img src={painelIcon} alt="painel" className="nav-icon" />
              <span className="texto">{usuario?.perfil === 'COM' ? 'Meus Dados' : 'Painel'}</span>
            </NavLink>
          </li>

          {['ADM', 'COO', 'PRO', 'ATE'].includes(usuario?.perfil || '') && (
            <li>
              <NavLink to="/pacientes" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <img src={pacientesIcon} alt="pacientes" className="nav-icon" />
                <span className="texto">Pacientes</span>
              </NavLink>
            </li>
          )}

          {['ADM', 'COO', 'ATE'].includes(usuario?.perfil || '') && (
            <li>
              <NavLink to="/triagem" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <img src={triagemIcon} alt="triagem" className="nav-icon" />
                <span className="texto">Triagem</span>
              </NavLink>
            </li>
          )}

          {['ADM', 'COO', 'PRO'].includes(usuario?.perfil || '') && (
            <li>
              <NavLink to="/validacao" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <img src={validacaoIcon} alt="validação" className="nav-icon" />
                <span className="texto">Validação (Professores)</span>
              </NavLink>
            </li>
          )}

          {usuario?.perfil === 'ADM' && (
            <li>
              <NavLink to="/usuarios" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <img src={usuariosIcon} alt="usuários" className="nav-icon" />
                <span className="texto">Usuários</span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="collapse-btn" onClick={handleLogout}>
          <img src={sairIcon} alt="sair" className="nav-icon" />
          <span className="texto">Sair</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
