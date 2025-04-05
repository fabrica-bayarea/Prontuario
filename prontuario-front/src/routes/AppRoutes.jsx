import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PreLogin from "../pages/PreLogin";
import Login from "../pages/Login";
import Cadastro1 from "../pages/Cadastro1"

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PreLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro1" element={<Cadastro1/>}/>
        {/* Caminho para a tela de login */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
