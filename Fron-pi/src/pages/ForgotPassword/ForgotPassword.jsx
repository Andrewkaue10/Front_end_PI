import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPhone } from '../../utils/formatPhone'
import PillGroup from '../../components/PillGroup/PillGroup'
import '../../styles/forms.css'
import '../../styles/centered-card.css'

const METODOS = ['E-mail', 'Telefone']

function ForgotPassword() {
    const [metodo, setMetodo] = useState('E-mail')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [enviado, setEnviado] = useState(false)
    const [telefone, setTelefone] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        const form = new FormData(e.target)
        const payload = {
            metodo,
            contato: metodo === 'E-mail' ? form.get('email') : form.get('telefone'),
        }

        setLoading(true)
        try {
            const response = await fetch('https://sua-api.com/recuperar-senha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!response.ok) throw new Error('Não foi possível enviar o código. Confere o dado informado.')

            setEnviado(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="theme-blue centered-card-page">
            <div className="centered-card">
                <h1 className="centered-card__title">Esqueceu sua senha?</h1>
                <p className="centered-card__subtitle">Escolha como prefere recuperar o acesso à sua conta.</p>

                <div className="centered-card__toggle">
                    <PillGroup options={METODOS} value={metodo} onChange={setMetodo} />
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {metodo === 'E-mail' ? (
                        <div className="auth-form__field">
                            <label htmlFor="email">E-mail cadastrado</label>
                            <input id="email" name="email" type="email" placeholder="voce@suastartup.com" required />
                        </div>
                    ) : (
                        <div className="auth-form__field">
                            <label htmlFor="telefone">Telefone cadastrado</label>
                            <input
                                id="telefone"
                                name="telefone"
                                type="tel"
                                inputMode="numeric"
                                placeholder="(00) 00000-0000"
                                value={telefone}
                                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                                required
                            />
                        </div>
                    )}

                    {error && <p className="auth-form__error">{error}</p>}

                    {enviado ? (
                        <p className="centered-card__success">Código enviado! Confere sua caixa de entrada.</p>
                    ) : (
                        <button type="submit" className="auth-form__submit" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar código de recuperação →'}
                        </button>
                    )}
                </form>

                <div className="auth-form__divider">ou</div>

                <p className="auth-form__bottom-link">
                    Lembrou sua senha? <Link to="/login">Entrar</Link>
                </p>
            </div>
        </div>
    )
}

export default ForgotPassword