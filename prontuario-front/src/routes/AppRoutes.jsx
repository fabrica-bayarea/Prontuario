import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login/Login";
import ForgotPassword from "../pages/auth/forgot-password/page";
import Register from "../pages/auth/register/cadastro";
import MenuAdmin from "../pages/dashboard/administrador/page";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/dashboard/administrador" element={<MenuAdmin />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
