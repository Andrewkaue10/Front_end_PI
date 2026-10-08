import { useState } from 'react'
import { Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { formatPhone } from '../../utils/formatPhone'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import PillGroup from '../../components/PillGroup/PillGroup'
import '../../styles/forms.css'

const ESTAGIOS = ['Ideação', 'MVP', 'Tração', 'Escala']
const SETORES = ['Fintech', 'Healthtech', 'Edtech', 'SaaS', 'IA', 'Mobilidade', 'E-commerce', 'Outros']
const CAPTACOES = ['Até R$500k', 'R$500k - 2M', 'R$2M - 10M', 'Acima de R$10M']

const LABELS = {
    nome: 'Nome completo',
    email: 'E-mail profissional',
    senha: 'Senha',
    confirmarSenha: 'Confirmar senha',
    startup: 'Nome da startup',
    telefone: 'Telefone',
}

function SignupStartup() {
    const [estagio, setEstagio] = useState('MVP')
    const [setores, setSetores] = useState(['SaaS', 'IA'])
    const [captacao, setCaptacao] = useState('R$500k - 2M')
    const [telefone, setTelefone] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError(null)

        const form = new FormData(e.target)
        const campos = {
            nome: form.get('nome'),
            email: form.get('email'),
            senha: form.get('senha'),
            confirmarSenha: form.get('confirmarSenha'),
            startup: form.get('startup'),
            telefone: form.get('telefone'),
        }

        const faltando = Object.entries(campos)
            .filter(([, valor]) => !valor || !valor.trim())
            .map(([campo]) => LABELS[campo])

        if (!estagio) faltando.push('Estágio da startup')
        if (setores.length === 0) faltando.push('Setor de atuação')
        if (!captacao) faltando.push('Quanto pretende captar')

        if (faltando.length > 0) {
            setError(`Preencha: ${faltando.join(', ')}.`)
            return
        }

        if (campos.senha !== campos.confirmarSenha) {
            setError('As senhas não coincidem.')
            return
        }

        if (!form.get('termos')) {
            setError('Você precisa concordar com os Termos de Uso.')
            return
        }

        // integrar com o back
        // Placeholder: ainda não existe a área logada da startup (feed de investidores)
        navigate('/login')
    }

    return (
        <AuthLayout
            imageSrc="/startup-hero.png"
            imageAlt="Time de startup trabalhando no escritório"
            overlayTitle="Encontre o investidor certo para acelerar sua ideia."
            overlaySubtitle="Mostre seu potencial para investidores alinhados ao seu setor e estágio, sem depender só de indicações."
            topLinkHref="/login"
        >
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <h1>Cadastre sua startup</h1>
                <p className="auth-form__subtitle">
                    Conte um pouco sobre seu negócio para começarmos a conectar você a investidores certos.
                </p>

                <div className="auth-form__row">
                    <div className="auth-form__field">
                        <label htmlFor="nome">Nome completo</label>
                        <input id="nome" name="nome" type="text" placeholder="Ex: João Pereira" required />
                    </div>
                    <div className="auth-form__field">
                        <label htmlFor="email">E-mail profissional</label>
                        <input id="email" name="email" type="email" placeholder="voce@suastartup.com" required />
                    </div>
                </div>

                <div className="auth-form__row">
                    <div className="auth-form__field">
                        <label htmlFor="senha">Senha</label>
                        <input id="senha" name="senha" type="password" placeholder="Mínimo 8 caracteres" required />
                    </div>
                    <div className="auth-form__field">
                        <label htmlFor="confirmar-senha">Confirmar senha</label>
                        <input id="confirmar-senha" name="confirmarSenha" type="password" placeholder="Repita a senha" required />
                    </div>
                </div>

                <div className="auth-form__row">
                    <div className="auth-form__field">
                        <label htmlFor="startup">Nome da startup</label>
                        <input id="startup" name="startup" type="text" placeholder="Ex: Colheita Digital" required />
                    </div>
                    <div className="auth-form__field">
                        <label htmlFor="pitch">Site / Pitch deck (opcional)</label>
                        <input id="pitch" name="pitchDeck" type="text" placeholder="Link do site ou deck" />
                    </div>
                </div>

                <div className="auth-form__group">
                    <span className="auth-form__group-label">Estágio da startup</span>
                    <PillGroup options={ESTAGIOS} value={estagio} onChange={setEstagio} />
                </div>

                <div className="auth-form__group">
                    <span className="auth-form__group-label">Setor de atuação</span>
                    <PillGroup options={SETORES} value={setores} onChange={setSetores} multiple />
                </div>

                <div className="auth-form__group">
                    <span className="auth-form__group-label">Quanto pretende captar</span>
                    <PillGroup options={CAPTACOES} value={captacao} onChange={setCaptacao} />
                </div>

                <div className="auth-form__field">
                    <label htmlFor="telefone">Telefone</label>
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

                <label className="auth-form__checkbox">
                    <input type="checkbox" name="termos" defaultChecked />
                    <span className="checkbox-box">
                        <Check size={12} strokeWidth={3} />
                    </span>
                    Concordo com os Termos de Uso e a Política de Privacidade
                </label>

                {error && (
                    <div className="form-alert" role="alert">
                        {error}
                    </div>
                )}

                <button type="submit" className="auth-form__submit">
                    Cadastrar minha startup →
                </button>

                <div className="auth-form__divider">ou continue com</div>

                <div className="auth-form__social">
                    <button type="button">Google</button>
                    <button type="button">LinkedIn</button>
                </div>

                <p className="auth-form__bottom-link">
                    É um investidor? <Link to="/cadastro/investidor">Cadastre-se aqui</Link>
                </p>
            </form>
        </AuthLayout>
    )
}

export default SignupStartup