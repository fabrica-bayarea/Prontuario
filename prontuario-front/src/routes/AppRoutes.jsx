import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PreLogin from "../pages/PreLogin";
import Login from "../pages/Login";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PreLogin />} />
        <Route path="/login" element={<Login />} />
        {/* Caminho para a tela de login */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
