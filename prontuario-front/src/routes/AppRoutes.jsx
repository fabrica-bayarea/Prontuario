import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login/Login";
import ForgotPassword from "../pages/auth/forgot-password/page";
import Register from "../pages/auth/register/cadastro";
import MenuAdmin from "../pages/dashboard/administrador/page";
import MenuCor from "../pages/dashboard/administrador/Coordenador";
import Cursos from "../pages/dashboard/administrador/Cursos";
import ImportarUsuarios from "../pages/dashboard/administrador/ImportarUsuarios";
import ConteudoInstitucional from "../pages/dashboard/administrador/ConteudoInstitucional";
import Config from "../pages/dashboard/administrador/Configurações";
import Agendamentos from "../pages/dashboard/administrador/agendamentos/Agendamentos";
import LogsAuditoria from "../pages/dashboard/administrador/Logs";
import Relatorios from "../pages/dashboard/administrador/Relatorio";
import TiposAtendimento from "../pages/dashboard/administrador/agendamentos/TipodeAtendimento";
import Escalas from "../pages/dashboard/administrador/agendamentos/Escalas";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/dashboard/administrador" element={<MenuAdmin />} />
        <Route
          path="/dashboard/administrador/coordenador"
          element={<MenuCor />}
        />
        <Route path="/dashboard/administrador/cursos" element={<Cursos />} />

        <Route
          path="/dashboard/administrador/importarusuarios"
          element={<ImportarUsuarios />}
        />
        <Route
          path="/dashboard/administrador/conteudoinstitucional"
          element={<ConteudoInstitucional />}
        />
        <Route
          path="/dashboard/administrador/agendamentos"
          element={<Agendamentos />}
        />
        <Route
          path="/dashboard/administrador/configurações"
          element={<Config />}
        />
        <Route
          path="/dashboard/administrador/logs"
          element={<LogsAuditoria />}
        />
        <Route
          path="/dashboard/administrador/relatorio"
          element={<Relatorios />}
        />
        <Route
          path="/dashboard/administrador/tiposatendimento"
          element={<TiposAtendimento />}
        />
        <Route path="/dashboard/administrador/escalas" element={<Escalas />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
