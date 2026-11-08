import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Feed from './pages/Feed/Feed'
import Home from './pages/Home/Home'
import SignupInvestor from './pages/SignupInvestor/SignupInvestor'
import SignupStartup from './pages/SignupStartup/SignupStartup'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import Notification from './pages/Notification/Notification'
import Editais from './pages/Editais/Editais'
import Mentores from './pages/Mentores/Mentores'
import investors from './pages/investors/investors'
import Mensagens from './pages/Mensagens/Mensagens'
import Favorites from './pages/Favorites/Favorites'


import './App.css'
import Login from './pages/Login/Login'

import Workspace from './pages/Workspace/Workspace'

import Terms from './pages/Terms'

function App() {
  const location = useLocation()
  const hideNavbar = ['/esqueci-senha', '/redefinir-senha', '/login'].includes(location.pathname)
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/termos" element={<Terms />} />
        <Route path="/" element={<Home />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/redefinir-senha" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/painel" element={<Workspace />} />
        <Route path="/cadastro/investidor" element={<SignupInvestor />} />
        <Route path="/cadastro/startup" element={<SignupStartup />} />
        <Route path="/notificações/startup" element={<Notification />} />
      </Routes>
    </>
  )
}

export default App