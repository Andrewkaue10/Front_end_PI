import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Feed from './pages/Feed/Feed'
import Home from './pages/Home/Home'
import SignupInvestor from './pages/SignupInvestor/SignupInvestor'
import SignupStartup from './pages/SignupStartup/SignupStartup'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import './App.css'
import Login from './pages/Login/login'

function App() {
  const location = useLocation()
  const hideNavbar = ['/esqueci-senha', '/redefinir-senha', '/login'].includes(location.pathname)
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/redefinir-senha" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/cadastro/investidor" element={<SignupInvestor />} />
        <Route path="/cadastro/startup" element={<SignupStartup />} />
      </Routes>
    </>
  )
}

export default App