import './App.css';
import { Routes, Route } from 'react-router-dom';
import Questionario from './features/questionario/components/Questionario';
import Pacientes from './features/pacientes/components/Pacientes';
import GestaoUsuarios from './features/usuarios/components/GestaoUsuarios';
import MeusDados from './features/meusDados/components/MeusDados';
import Painel from './features/painel/components/Painel';
import Validacao from './features/validacao/components/Validacao';
import Triagem from './features/triagem/components/Triagem';
import Login from './features/auth/components/Login';
import RecuperarSenha from './features/auth/components/RecuperarSenha';
import RedefinirSenha from './features/auth/components/RedefinirSenha';
import PrimeiroAcesso from './features/auth/components/PrimeiroAcesso';
import PrivateRoute from './components/PrivateRoute';
import RotaProtegida from './components/RotaProtegida';

function App() {
  return (
    <Routes>
      {/* Rotas públicas (autenticação) */}
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      <Route path="/primeiro-acesso" element={<PrimeiroAcesso />} />

      {/* Rotas protegidas: PrivateRoute cuida da sessão, RotaProtegida da permissão */}
      <Route element={<PrivateRoute />}>
        <Route element={<RotaProtegida chave="painel" aoNegar="rotaInicial" />}>
          <Route path="/" element={<Painel />} />
        </Route>
        <Route element={<RotaProtegida chave="meusDados" />}>
          <Route path="/meus-dados" element={<MeusDados />} />
        </Route>
        <Route element={<RotaProtegida chave="pacientes" />}>
          <Route path="/pacientes" element={<Pacientes />} />
        </Route>
        <Route element={<RotaProtegida chave="triagem" />}>
          <Route path="/triagem" element={<Triagem />} />
        </Route>
        <Route element={<RotaProtegida chave="validacao" />}>
          <Route path="/validacao" element={<Validacao />} />
        </Route>
        <Route element={<RotaProtegida chave="novoAcolhimento" />}>
          <Route path="/novoAcolhimento" element={<Questionario />} />
        </Route>
        <Route element={<RotaProtegida chave="usuarios" />}>
          <Route path="/usuarios" element={<GestaoUsuarios />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
