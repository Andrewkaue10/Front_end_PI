import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import '../../styles/forms.css'
import '../../styles/centered-card.css'
import './ResetPassword.css'

const REQUISITOS = [
    { id: 'length', label: 'Mínimo de 8 caracteres', test: (v) => v.length >= 8 },
    { id: 'uppercase', label: 'Ao menos uma letra maiúscula', test: (v) => /[A-Z]/.test(v) },
    { id: 'number', label: 'Ao menos um número', test: (v) => /[0-9]/.test(v) },
]

function ResetPassword() {
    const [senha, setSenha] = useState('')
    const [confirmar, setConfirmar] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const todosOk = REQUISITOS.every((req) => req.test(senha))
    const senhasConferem = senha.length > 0 && senha === confirmar

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!todosOk) {
            setError('A senha ainda não atende todos os requisitos.')
            return
        }
        if (!senhasConferem) {
            setError('As senhas não coincidem.')
            return
        }

        setLoading(true)
        try {
            const response = await fetch('https://sua-api.com/redefinir-senha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senha }), // token de email
            })

            if (!response.ok) throw new Error('Não foi possível salvar a nova senha. Tente novamente.')

            navigate('/login')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="theme-blue centered-card-page">
            <div className="centered-card">
                <h1 className="centered-card__title">Crie uma nova senha</h1>
                <p className="centered-card__subtitle">Sua nova senha deve ser diferente das utilizadas anteriormente.</p>

                <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: 32 }}>
                    <div className="auth-form__field">
                        <label htmlFor="nova-senha">Nova senha</label>
                        <input
                            id="nova-senha"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-form__field">
                        <label htmlFor="confirmar-nova-senha">Confirmar nova senha</label>
                        <input
                            id="confirmar-nova-senha"
                            type="password"
                            placeholder="Repita a nova senha"
                            value={confirmar}
                            onChange={(e) => setConfirmar(e.target.value)}
                            required
                        />
                    </div>

                    <ul className="password-checklist">
                        {REQUISITOS.map((req) => {
                            const ok = req.test(senha)
                            return (
                                <li key={req.id} className={ok ? 'password-checklist__item--ok' : ''}>
                                    <span className="password-checklist__icon">
                                        {ok && <Check size={12} strokeWidth={3} />}
                                    </span>
                                    {req.label}
                                </li>
                            )
                        })}
                    </ul>

                    {error && (
                        <div className="form-alert" role="alert">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="auth-form__submit" disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar nova senha →'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword