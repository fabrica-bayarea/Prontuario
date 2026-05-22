import './App.css';
import { Routes, Route } from 'react-router-dom';
import Questionario from './features/questionario/components/Questionario';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/*Tirar as style={{color:"black"}} apos feita a respectiva tela*/}

          <Route path="/" element={<h1 style={{ color: 'black' }}>Painel Inicial</h1>} />
          <Route
            path="/pacientes"
            element={<h1 style={{ color: 'black' }}>Lista de Pacientes</h1>}
          />
          <Route path="/triagem" element={<h1 style={{ color: 'black' }}>Triagem</h1>} />
          <Route
            path="/validacao"
            element={<h1 style={{ color: 'black' }}>Validação (Professores)</h1>}
          />
          <Route path="/sair" element={<h1 style={{ color: 'black' }}>Sair</h1>} />
          <Route path="/novoAcolhimento" element={<Questionario />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
