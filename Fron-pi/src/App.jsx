import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Feed from "./pages/Feed/Feed";
import Home from "./pages/Home/Home";
import SignupInvestor from "./pages/SignupInvestor/SignupInvestor";
import SignupStartup from "./pages/SignupStartup/SignupStartup";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import "./App.css";
import Login from "./pages/Login/Login";

import Workspace from "./pages/Workspace/Workspace";

import Terms from "./pages/Terms";
import Marketing from "./pages/Marketing/Marketing";
import StartupHome from "./pages/StartupHome/StartupHome";

function App() {
  const location = useLocation();
  const hideNavbar = [
    "/esqueci-senha",
    "/redefinir-senha",
    "/login",
    "/feed",
    "/startup",
    "/painel",
  ].includes(location.pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/termos" element={<Terms />} />
        <Route path="/" element={<Home />} />
        <Route path="/como-funciona" element={<Marketing page="how" />} />
        <Route path="/para-startups" element={<Marketing page="startup" />} />
        <Route
          path="/para-investidores"
          element={<Marketing page="investor" />}
        />
        <Route path="/alia" element={<Marketing page="alia" />} />
        <Route path="/sobre" element={<Marketing page="about" />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/redefinir-senha" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/startup" element={<StartupHome />} />
        <Route path="/painel" element={<Workspace />} />
        <Route path="/cadastro/investidor" element={<SignupInvestor />} />
        <Route path="/cadastro/startup" element={<SignupStartup />} />
      </Routes>
    </>
  );
}

export default App;
