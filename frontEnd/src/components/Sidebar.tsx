import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { itensMenuPara } from '../config/permissions';
import { useMediaQuery } from '../hooks/useMediaQuery';
import iesbemacaoIcon from '../assets/iesbemacao_icon.svg';
import sairIcon from '../assets/sair_icon.svg';
import './Sidebar.css';

const MEDIA_MOBILE = '(max-width: 767px)';

function Sidebar() {
  const { logout, usuario } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMobile = useMediaQuery(MEDIA_MOBILE);

  const [drawerAberto, setDrawerAberto] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const botaoAbrirRef = useRef<HTMLButtonElement>(null);

  const itens = itensMenuPara(usuario?.perfil);

  // showModal() já entrega Esc, backdrop e foco preso; nada de focus trap manual.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (drawerAberto && !dialog.open) dialog.showModal();
    else if (!drawerAberto && dialog.open) dialog.close();
  }, [drawerAberto]);

  useEffect(() => {
    setDrawerAberto(false);
  }, [pathname, isMobile]);

  function fecharDrawer() {
    setDrawerAberto(false);
    botaoAbrirRef.current?.focus();
  }

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const aside = (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={iesbemacaoIcon} alt="Dashboard" className="nav-icon" />
        <h2>IESB em Ação</h2>
        {isMobile && (
          <button
            type="button"
            className="sidebar-close"
            aria-label="Fechar menu"
            onClick={fecharDrawer}
          >
            <X size={20} aria-hidden="true" />
          </button>
        )}
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
        <button className="logout-btn" onClick={handleLogout}>
          <img src={sairIcon} alt="sair" className="nav-icon" />
          <span className="texto">Sair</span>
        </button>
      </div>
    </aside>
  );

  if (!isMobile) return aside;

  return (
    <>
      <div className="sidebar-topbar">
        <button
          ref={botaoAbrirRef}
          type="button"
          className="sidebar-toggle"
          aria-label="Abrir menu"
          aria-expanded={drawerAberto}
          aria-controls="sidebar-drawer"
          onClick={() => setDrawerAberto(true)}
        >
          <Menu size={22} aria-hidden="true" />
        </button>
        <img src={iesbemacaoIcon} alt="" className="nav-icon" />
        <h2>IESB em Ação</h2>
      </div>

      <dialog
        ref={dialogRef}
        id="sidebar-drawer"
        className="sidebar-drawer"
        aria-label="Menu de navegação"
        onClose={fecharDrawer}
      >
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Fechar menu"
          tabIndex={-1}
          onClick={fecharDrawer}
        />
        {aside}
      </dialog>
    </>
  );
}

export default Sidebar;
