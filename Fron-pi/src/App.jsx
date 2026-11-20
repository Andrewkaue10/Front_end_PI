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
import StartupShell from "./components/StartupShell/StartupShell";
import StartupInvestors from "./pages/StartupInvestors/StartupInvestors";
import StartupMentors from "./pages/StartupMentors/StartupMentors";
import StartupPrograms from "./pages/StartupPrograms/StartupPrograms";
import SharedMessages from "./pages/Shared/SharedMessages";
import SharedNotifications from "./pages/Shared/SharedNotifications";
import SharedSettings from "./pages/Shared/SharedSettings";
import InvestorFavorites from "./pages/Investor/InvestorFavorites";
import InvestorPortfolio from "./pages/Investor/InvestorPortfolio";
import InvestorQualifications from "./pages/Investor/InvestorQualifications";
import StartupPublications from "./pages/StartupPublications/StartupPublications";
import StartupProfile from "./pages/StartupProfile/StartupProfile";
import InvestorMatches from "./pages/Investor/InvestorMatches";

import MyProfile from "./pages/Shared/MyProfile";

function App() {
  const location = useLocation();
  const hideNavbar =
    [
      "/esqueci-senha",
      "/redefinir-senha",
      "/login",
      "/feed",
      "/startup",
      "/painel",
      "/mensagens",
      "/notificacoes",
      "/configuracoes",
      "/perfil",
    ].includes(location.pathname) ||
    location.pathname.startsWith("/startup/") ||
    location.pathname.startsWith("/investidor/");
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
        <Route path="/startup" element={<StartupShell />}>
          <Route path="investidores" element={<StartupInvestors />} />
          <Route path="investidores/:id" element={<StartupInvestors />} />
          <Route path="mentores" element={<StartupMentors />} />
          <Route path="mentores/:id" element={<StartupMentors />} />
          <Route path="editais" element={<StartupPrograms />} />
          <Route path="publicacoes" element={<StartupPublications />} />
          <Route path="perfil" element={<StartupProfile />} />
        </Route>
        <Route path="/mensagens" element={<SharedMessages />} />
        <Route path="/notificacoes" element={<SharedNotifications />} />
        <Route path="/perfil" element={<MyProfile />} />
        <Route path="/configuracoes" element={<SharedSettings />} />
        <Route path="/investidor/favoritos" element={<InvestorFavorites />} />
        <Route path="/investidor/portfolio" element={<InvestorPortfolio />} />
        <Route
          path="/investidor/qualificacoes"
          element={<InvestorQualifications />}
        />
        <Route path="/investidor/matches" element={<InvestorMatches />} />
        <Route path="/painel" element={<Workspace />} />
        <Route path="/cadastro/investidor" element={<SignupInvestor />} />
        <Route path="/cadastro/startup" element={<SignupStartup />} />
      </Routes>
    </>
  );
}

export default App;
