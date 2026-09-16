import { useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)

    const links = [
        { label: 'Como funciona', href: '#como-funciona' },
        { label: 'Para Startups', href: '#para-startups' },
        { label: 'Para Investidores', href: '#para-investidores' },
        { label: 'Sobre', href: '#sobre' },
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

                    <div className="navbar__actions">
                        <Link to="/login" className="navbar__login">
                            Entrar
                        </Link>
                        <Link to="/cadastro/startup" className="navbar__cta">
                            Cadastre-se grátis
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Navbar