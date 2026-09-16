import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import PillGroup from '../../components/PillGroup/PillGroup'
import '../../styles/forms.css'
import './SignupInvestor.css'

const TIPOS = ['Anjo', 'VC', 'Family Office', 'Corporate']
const SETORES = ['Fintech', 'Healthtech', 'Edtech', 'SaaS', 'IA', 'Mobilidade', 'E-commerce', 'Outros']
const TICKETS = ['Até R$50k', 'R$50k - 200k', 'R$200k - 1M', 'Acima de R$1M']

function SignupInvestor() {
    const [tipo, setTipo] = useState('Anjo')
    const [setores, setSetores] = useState(['SaaS'])
    const [ticket, setTicket] = useState('R$50k - 200k')

    const handleSubmit = (e) => {
        e.preventDefault()
        // vai integrar com o back aq
    }

    return (
        <div className="theme-investor">
            <AuthLayout
                imageSrc="/investor-hero.png"
                imageAlt="Investidor em um terraço ao entardecer"
                overlayTitle="Invista nas próximas grandes histórias."
                overlaySubtitle="Acesse um dealflow qualificado, converse direto com fundadores e acompanhe tudo em um só lugar."
                topLinkHref="/login"
            >
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h1>Crie sua conta de investidor</h1>
                    <p className="auth-form__subtitle">
                        Preencha os dados abaixo para começar a receber oportunidades selecionadas para você.
                    </p>

                    <div className="auth-form__row">
                        <div className="auth-form__field">
                            <label htmlFor="nome">Nome completo</label>
                            <input id="nome" type="text" placeholder="Ex: Ana Souza" />
                        </div>
                        <div className="auth-form__field">
                            <label htmlFor="email">E-mail profissional</label>
                            <input id="email" type="email" placeholder="voce@empresa.com" />
                        </div>
                    </div>

                    <div className="auth-form__row">
                        <div className="auth-form__field">
                            <label htmlFor="senha">Senha</label>
                            <input id="senha" type="password" placeholder="Mínimo 8 caracteres" />
                        </div>
                        <div className="auth-form__field">
                            <label htmlFor="confirmar-senha">Confirmar senha</label>
                            <input id="confirmar-senha" type="password" placeholder="Repita a senha" />
                        </div>
                    </div>

                    <div className="auth-form__field">
                        <label htmlFor="fundo">Nome do fundo / empresa (opcional)</label>
                        <input id="fundo" type="text" placeholder="Ex: Vórtice Capital" />
                    </div>

                    <div className="auth-form__group">
                        <span className="auth-form__group-label">Tipo de investidor</span>
                        <PillGroup options={TIPOS} value={tipo} onChange={setTipo} />
                    </div>

                    <div className="auth-form__group">
                        <span className="auth-form__group-label">Setores de interesse</span>
                        <PillGroup options={SETORES} value={setores} onChange={setSetores} multiple />
                    </div>

                    <div className="auth-form__group">
                        <span className="auth-form__group-label">Ticket médio de investimento</span>
                        <PillGroup options={TICKETS} value={ticket} onChange={setTicket} />
                    </div>

                    <div className="auth-form__field">
                        <label htmlFor="telefone">Telefone</label>
                        <input id="telefone" type="tel" placeholder="(00) 00000-0000" />
                    </div>

                    <label className="auth-form__checkbox">
                        <input type="checkbox" defaultChecked />
                        Concordo com os Termos de Uso e a Política de Privacidade
                    </label>

                    <button type="submit" className="auth-form__submit">
                        Criar conta de investidor →
                    </button>

                    <div className="auth-form__divider">ou continue com</div>

                    <div className="auth-form__social">
                        <button type="button">Google</button>
                        <button type="button">LinkedIn</button>
                    </div>

                    <p className="auth-form__bottom-link">
                        É uma startup? <Link to="/cadastro/startup">Cadastre-se aqui</Link>
                    </p>
                </form>
            </AuthLayout>
        </div>
    )
}

export default SignupInvestor