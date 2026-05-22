import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import iesbemacaoIcon from '../assets/iesbemacao_icon.svg';
import painelIcon from '../assets/painel_icon.svg';
import pacientesIcon from '../assets/pacientes_icon.svg';
import triagemIcon from '../assets/triagem_icon.svg';
import validacaoIcon from '../assets/validacao_icon.svg';
import sairIcon from '../assets/sair_icon.svg';
import './Sidebar.css';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img src={iesbemacaoIcon} alt="Dashboard" className="nav-icon" />
        <h2>IESB em Ação</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              <img src={painelIcon} alt="painel" className="nav-icon" />
              <span className="texto">Painel</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/pacientes" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              <img src={pacientesIcon} alt="pacientes" className="nav-icon" />
              <span className="texto">Pacientes</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/triagem" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              <img src={triagemIcon} alt="triagem" className="nav-icon" />
              <span className="texto">Triagem</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/validacao" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              <img src={validacaoIcon} alt="validação" className="nav-icon" />
              <span className="texto">Validação (Professores)</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <NavLink
          to="/novoAcolhimento"
          className={({ isActive }) => `collapse-btn ${isActive ? 'active-link' : ''}`}
        >
          <img src={sairIcon} alt="sair" className="nav-icon" />
          <span className="texto">Sair</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
