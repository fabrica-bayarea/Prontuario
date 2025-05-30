import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login/Login";
import ForgotPassword from "../pages/auth/forgot-password/page";
import Register from "../pages/auth/register/cadastro";
import MenuAdmin from "../pages/dashboard/administrador/page";
import Cursos from "../pages/dashboard/administrador/Cursos";
// import MenuCor from "../pages/dashboard/administrador/Cordenador";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/dashboard/administrador" element={<MenuAdmin />} />
        <Route path="/dashboard/administrador/cursos" element={<Cursos />} />
        {/* <Route path="/dashboard/administrador" element={<MenuCor />} /> */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
