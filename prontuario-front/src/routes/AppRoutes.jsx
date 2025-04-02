import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PreLogin from "../pages/PreLogin";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PreLogin />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
