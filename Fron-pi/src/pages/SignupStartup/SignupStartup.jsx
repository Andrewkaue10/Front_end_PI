import { useState } from 'react'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPhone } from '../../utils/formatPhone'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import PillGroup from '../../components/PillGroup/PillGroup'
import '../../styles/forms.css'

const ESTAGIOS = ['Ideação', 'MVP', 'Tração', 'Escala']
const SETORES = ['Fintech', 'Healthtech', 'Edtech', 'SaaS', 'IA', 'Mobilidade', 'E-commerce', 'Outros']
const CAPTACOES = ['Até R$500k', 'R$500k - 2M', 'R$2M - 10M', 'Acima de R$10M']

function SignupStartup() {
    const [estagio, setEstagio] = useState('MVP')
    const [setores, setSetores] = useState(['SaaS', 'IA'])
    const [captacao, setCaptacao] = useState('R$500k - 2M')
    const [telefone, setTelefone] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        // vai integrar com o back
    }

    return (
        <AuthLayout
            imageSrc="/startup-hero.png"
            imageAlt="Time de startup trabalhando no escritório"
            overlayTitle="Encontre o investidor certo para acelerar sua ideia."
            overlaySubtitle="Mostre seu potencial para investidores alinhados ao seu setor e estágio, sem depender só de indicações."
            topLinkHref="/login"
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Cadastre sua startup</h1>
                <p className="auth-form__subtitle">
                    Conte um pouco sobre seu negócio para começarmos a conectar você a investidores certos.
                </p>

                <div className="auth-form__row">
                    <div className="auth-form__field">
                        <label htmlFor="nome">Nome completo</label>
                        <input id="nome" type="text" placeholder="Ex: João Pereira" />
                    </div>
                    <div className="auth-form__field">
                        <label htmlFor="email">E-mail profissional</label>
                        <input id="email" type="email" placeholder="voce@suastartup.com" />
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

                <div className="auth-form__row">
                    <div className="auth-form__field">
                        <label htmlFor="startup">Nome da startup</label>
                        <input id="startup" type="text" placeholder="Ex: Colheita Digital" />
                    </div>
                    <div className="auth-form__field">
                        <label htmlFor="pitch">Site / Pitch deck (opcional)</label>
                        <input id="pitch" type="text" placeholder="Link do site ou deck" />
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
                
                <button type="submit" className="auth-form__submit">
                    Cadastrar minha startup →
                </button>

                <p className="auth-form__bottom-link">
                    É um investidor? <Link to="/cadastro/investidor">Cadastre-se aqui</Link>
                </p>
            </form>
        </AuthLayout>
    )
}

export default SignupStartup