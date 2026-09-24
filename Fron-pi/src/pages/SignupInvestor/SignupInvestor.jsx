import { useState } from 'react'
import { Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { formatPhone } from '../../utils/formatPhone'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import PillGroup from '../../components/PillGroup/PillGroup'
import '../../styles/forms.css'
import './SignupInvestor.css'

const TIPOS = ['Anjo', 'VC', 'Family Office', 'Corporate']
const SETORES = ['Fintech', 'Healthtech', 'Edtech', 'SaaS', 'IA', 'Mobilidade', 'E-commerce', 'Outros']
const TICKETS = ['Até R$50k', 'R$50k - 200k', 'R$200k - 1M', 'Acima de R$1M']

const LABELS = {
  nome: 'Nome completo',
  email: 'E-mail profissional',
  senha: 'Senha',
  confirmarSenha: 'Confirmar senha',
  telefone: 'Telefone',
}

function SignupInvestor() {
  const [tipo, setTipo] = useState('Anjo')
  const [setores, setSetores] = useState(['SaaS'])
  const [ticket, setTicket] = useState('R$50k - 200k')
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
      telefone: form.get('telefone'),
    }

    const faltando = Object.entries(campos)
      .filter(([, valor]) => !valor || !valor.trim())
      .map(([campo]) => LABELS[campo])

    if (!tipo) faltando.push('Tipo de investidor')
    if (setores.length === 0) faltando.push('Setores de interesse')
    if (!ticket) faltando.push('Ticket médio de investimento')

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

    // Integrar com o back
    navigate('/feed')
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
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h1>Crie sua conta de investidor</h1>
          <p className="auth-form__subtitle">
            Preencha os dados abaixo para começar a receber oportunidades selecionadas para você.
          </p>

          <div className="auth-form__row">
            <div className="auth-form__field">
              <label htmlFor="nome">Nome completo</label>
              <input id="nome" name="nome" type="text" placeholder="Ex: Ana Souza" required />
            </div>
            <div className="auth-form__field">
              <label htmlFor="email">E-mail profissional</label>
              <input id="email" name="email" type="email" placeholder="voce@empresa.com" required />
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

          <div className="auth-form__field">
            <label htmlFor="fundo">Nome do fundo / empresa (opcional)</label>
            <input id="fundo" name="fundo" type="text" placeholder="Ex: Vórtice Capital" />
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
            Criar conta de investidor →
          </button>

          <p className="auth-form__bottom-link">
            É uma startup? <Link to="/cadastro/startup">Cadastre-se aqui</Link>
          </p>
        </form>
      </AuthLayout>
    </div>
  )
}

export default SignupInvestor