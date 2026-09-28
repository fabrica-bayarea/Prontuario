import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ChaveTela } from '../config/permissions';
import Proibido from './Proibido';

interface Props {
  chave: ChaveTela;
  /** `/` é o que todo mundo digita: quem não tem `painel` vai para a própria rota inicial em vez de ver 403. */
  aoNegar?: 'proibido' | 'rotaInicial';
}

function RotaProtegida({ chave, aoNegar = 'proibido' }: Props) {
  const { permissoes, rotaInicial } = useAuth();
  const { pathname } = useLocation();

  if (permissoes.includes(chave)) return <Outlet />;

  if (aoNegar === 'rotaInicial' && rotaInicial !== pathname) {
    return <Navigate to={rotaInicial} replace />;
  }

  return <Proibido />;
}

export default RotaProtegida;
