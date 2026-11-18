import { Link } from 'react-router-dom'
import StepCard from '../../components/StepCard/StepCard'
import './Home.css'

const STEPS = [
  { number: '01', title: 'Crie seu perfil', description: 'Cadastre sua startup ou seu perfil profissional com informações, tese e objetivos claros.' },
  { number: '02', title: 'Receba sugestões', description: 'O sistema cruza setor, estágio, ticket e necessidades para ordenar perfis compatíveis.' },
  { number: '03', title: 'Conecte-se', description: 'Envie convites, converse e proponha reuniões depois do aceite.' },
]

export default function Home() {
  return <main className="home">
    <section className="home__hero"><div className="home__hero-content"><span className="home__eyebrow">✦ MATCH TRANSPARENTE COM A A.L.I.A</span><h1>Conectamos startups inovadoras a investidores certos</h1><p>Uma plataforma para aproximar quem tem grandes ideias de quem quer investir nelas, com critérios claros e sem intermediários.</p><div className="home__hero-actions"><Link to="/cadastro/startup" className="home__btn home__btn--primary">Sou startup</Link><Link to="/cadastro/investidor" className="home__btn home__btn--secondary">Sou investidor</Link></div><p className="home__proof">Perfis aprovados · compatibilidade explicável · decisões humanas</p></div><img src="/hero-people.png" alt="Fundadora e investidora conectadas pela NexHub" className="home__hero-image" /></section>
    <section id="como-funciona" className="home__how"><span className="home__eyebrow">COMO FUNCIONA</span><h2>Três passos para uma conexão de verdade</h2><p>Do cadastro ao fechamento, tudo acontece no mesmo lugar.</p><div className="home__steps">{STEPS.map(step => <StepCard key={step.number} {...step} />)}</div><Link className="home__more" to="/como-funciona">Veja como funciona →</Link></section>
    <section className="home__audience"><h2>Feito para os dois lados do match</h2><div><article><h3>Para Startups</h3><p>Ganhe visibilidade com investidores e mentores alinhados ao seu momento.</p><Link to="/para-startups">Conheça para startups →</Link></article><article><h3>Para Investidores</h3><p>Descubra startups filtradas pela sua tese, com motivos claros para cada sugestão.</p><Link to="/para-investidores">Conheça para investidores →</Link></article></div></section>
    <section className="home__alia"><span className="home__eyebrow">✦ CONHEÇA A A.L.I.A</span><h2>Compatibilidade transparente, sem caixa-preta</h2><p>A A.L.I.A organiza sugestões com base nas regras atuais do sistema. A nota mostra compatibilidade, não garante investimento ou sucesso.</p><Link to="/alia">Conheça a A.L.I.A →</Link></section>
  </main>
}
