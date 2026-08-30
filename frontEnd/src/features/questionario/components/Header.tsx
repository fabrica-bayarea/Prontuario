import React from 'react';
import salvaIcon from '../assets/salva.svg';
import { NavLink } from 'react-router-dom';
import voltarIcon from '../assets/voltar.svg';
import './Header.css';

function Header() {
  return (
    <header className="header-container">
      <div className="header-titulo">
        <li>
          <NavLink to="/triagem" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            <img src={voltarIcon} alt="painel" className="btn-voltar" />
          </NavLink>
        </li>
        <div className="header-titulo texto">
          <h1>Novo Acolhimento</h1>
          <h2>Cadastro multidisciplinar</h2>
        </div>
      </div>
      <div className="header-salva">
        <img src={salvaIcon} alt="salva" />
        <span>Salva</span>
      </div>
    </header>
  );
}

export default Header;
