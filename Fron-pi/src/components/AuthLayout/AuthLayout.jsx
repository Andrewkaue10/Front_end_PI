import './AuthLayout.css'
import { Link } from 'react-router-dom'

function AuthLayout({ imageSrc, imageAlt, overlayTitle, overlaySubtitle, topLinkHref, children }) {
    return (
        <div className="auth-layout">
            <div className="auth-layout__visual">
                {/*Vou botar a imagem quando tiver pronta*/}
                <img src={imageSrc} alt={imageAlt} className="auth-layout__image" />
                <div className="auth-layout__overlay">
                    <h2>{overlayTitle}</h2>
                    <p>{overlaySubtitle}</p>
                </div>
            </div>

            <div className="auth-layout__form-side">
                <p className="auth-layout__top-link">
                    Já tem conta? <Link to={topLinkHref}>Entrar →</Link>
                </p>
                <div className="auth-layout__form-wrapper">{children}</div>
            </div>
        </div>
    )
}

export default AuthLayout