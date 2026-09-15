import { useState } from 'react'
import '../styles/Navbar.css'

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
                <a href="" className="navbar__logo" aria-label="NexHub">
                    <svg className="navbar__logo-icon" viewBox="0 0 32 32" aria-hidden="true">
                    </svg>
                    <span className="navbar__logo-text">
                        Nex<span className="navbar__logo-highlight">Hub</span>
                    </span>
                </a>

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
                        <a href="/login" className="navbar__login">
                            Entrar
                        </a>
                        <a href="/cadastro" className="navbar__cta">
                            Cadastre-se grátis
                        </a>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Navbar