import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const APP_ROUTES = ['/feed', '/painel'] // rotas de usuário logado

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isAppView = APP_ROUTES.includes(location.pathname)

  const links = [
    { label: 'Como funciona', href: '/#como-funciona' },
    { label: 'Para Startups', href: '/cadastro/startup' },
    { label: 'Para Investidores', href: '/cadastro/investidor' },
    { label: 'Uso e privacidade', href: '/termos' },
  ]

  return (
    <header className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo" aria-label="NexHub">
          <svg className="navbar__logo-icon" viewBox="0 0 32 32" aria-hidden="true">

          </svg>
          <span className="navbar__logo-text">
            Nex<span className="navbar__logo-highlight">Hub</span>
          </span>
        </Link>

        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Abrir menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          <ul className="navbar__links">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>

          {!isAppView && (
            <div className="navbar__actions">
              <Link to="/login" className="navbar__login">
                Entrar
              </Link>
              <Link to="/cadastro/startup" className="navbar__cta">
                Cadastre-se grátis
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar