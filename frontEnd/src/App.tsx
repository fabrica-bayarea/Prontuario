import './App.css';
import { Routes, Route } from 'react-router-dom';
import Questionario from './features/questionario/components/Questionario';
import Pacientes from './features/pacientes/components/Pacientes';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<h1 style={{ color: 'black' }}>Painel Inicial</h1>} />
          <Route path="/pacientes" element={<Pacientes />}/>
          <Route path="/triagem" element={<h1 style={{ color: 'black' }}>Triagem</h1>} />
          <Route path="/validacao" element={<h1 style={{ color: 'black' }}>Validação (Professores)</h1>}/>
          <Route path="/sair" element={<h1 style={{ color: 'black' }}>Sair</h1>} />
          <Route path="/novoAcolhimento" element={<Questionario />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
