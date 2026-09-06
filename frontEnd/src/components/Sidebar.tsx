import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { itensMenuPara } from '../config/permissions';
import iesbemacaoIcon from '../assets/iesbemacao_icon.svg';
import sairIcon from '../assets/sair_icon.svg';
import './Sidebar.css';

function Sidebar() {
  const { logout, usuario } = useAuth();
  const navigate = useNavigate();

  const itens = itensMenuPara(usuario?.perfil);

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
          {itens.map(({ path, menu }) => (
            <li key={`${path}:${menu.rotulo}`}>
              <NavLink to={path} className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <img src={menu.icone} alt={menu.rotulo} className="nav-icon" />
                <span className="texto">{menu.rotulo}</span>
              </NavLink>
            </li>
          ))}
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
