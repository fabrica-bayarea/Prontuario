import './App.css'
import { Routes, Route } from 'react-router-dom'
import Questionario from './features/questionario/components/Questionario'
import Sidebar from './components/Sidebar'

function App() {
 return (
   <div style={{ display: 'flex' }}>
     <Sidebar />
     <main style={{ marginLeft: '250px', width: '100%', padding: '20px' }}>
       <Routes>
         <Route path="/" element={<h1>Painel Inicial</h1>} />
         <Route path="/pacientes" element={<h1>Lista de Pacientes</h1>} />
         <Route path="/triagem" element={<h1>Triagem</h1>} />
         <Route path="/validacao" element={<h1>Validação (Professores)</h1>} />
         <Route path="/sair" element={<Questionario />} />
       </Routes>
     </main>
    </div>
 );
}

export default App