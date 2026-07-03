import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Questionario from './features/questionario/components/Questionario';
import Pacientes from './features/pacientes/components/Pacientes';
import GestaoUsuarios from './features/usuarios/components/GestaoUsuarios';
import MeusDados from './features/meusDados/components/MeusDados';
import Painel from './features/painel/components/Painel';
import Validacao from './features/validacao/components/Validacao';
import Login from './features/auth/components/Login';
import RecuperarSenha from './features/auth/components/RecuperarSenha';
import RedefinirSenha from './features/auth/components/RedefinirSenha';
import PrimeiroAcesso from './features/auth/components/PrimeiroAcesso';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { usuario } = useAuth();

  return (
    <Routes>
      {/* Rotas públicas (autenticação) */}
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      <Route path="/primeiro-acesso" element={<PrimeiroAcesso />} />

      {/* Rotas protegidas (com Sidebar) */}
      <Route element={<PrivateRoute />}>
        <Route 
          path="/" 
          element={usuario?.perfil === 'COM' ? <MeusDados /> : <Painel />} 
        />
        
        <Route 
          path="/pacientes" 
          element={['ADM', 'COO', 'PRO', 'ATE'].includes(usuario?.perfil || '') ? <Pacientes /> : <Navigate to="/" replace />} 
        />
        
        <Route 
          path="/triagem" 
          element={['ADM', 'COO', 'ATE'].includes(usuario?.perfil || '') ? (
            <div className="page-container">
              <header className="page-header">
                <div>
                  <h1 className="page-title">Triagem</h1>
                  <p className="page-subtitle">Gerenciamento de triagens de pacientes.</p>
                </div>
              </header>
              <div className="panel-container" style={{ padding: '32px' }}>
                <p>Módulo de triagem em desenvolvimento.</p>
              </div>
            </div>
          ) : <Navigate to="/" replace />} 
        />
        
        <Route 
          path="/validacao" 
          element={['ADM', 'COO', 'PRO'].includes(usuario?.perfil || '') ? <Validacao /> : <Navigate to="/" replace />} 
        />
        
        <Route 
          path="/novoAcolhimento" 
          element={['ADM', 'COO', 'ATE'].includes(usuario?.perfil || '') ? <Questionario /> : <Navigate to="/" replace />} 
        />
        
        <Route 
          path="/usuarios" 
          element={usuario?.perfil === 'ADM' ? <GestaoUsuarios /> : <Navigate to="/" replace />} 
        />
      </Route>
    </Routes>
  );
}

export default App;
