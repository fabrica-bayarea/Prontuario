import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Proibido.css';

function Proibido() {
  const { rotaInicial } = useAuth();
  const { pathname } = useLocation();

  return (
    <section className="proibido" aria-labelledby="proibido-titulo">
      <ShieldAlert size={40} className="proibido-icone" aria-hidden="true" />
      <p className="proibido-codigo">403</p>
      <h1 id="proibido-titulo">Você não tem acesso a esta página</h1>
      <p className="proibido-texto">
        O endereço <code>{pathname}</code> não está liberado para o seu perfil. Se você precisa
        dessa tela, fale com a coordenação para revisar suas permissões.
      </p>
      <Link to={rotaInicial} replace className="proibido-voltar">
        Voltar para a minha página inicial
      </Link>
    </section>
  );
}

export default Proibido;
