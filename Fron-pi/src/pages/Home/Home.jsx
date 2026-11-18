import { Link } from 'react-router-dom'
import StepCard from '../../components/StepCard/StepCard'
import Reveal from '../../components/Reveal/Reveal'
import './Home.css'

const STEPS = [
  { number: '01', title: 'Crie seu perfil', description: 'Cadastre sua startup ou seu perfil profissional com informações, tese e objetivos claros.' },
  { number: '02', title: 'Receba sugestões', description: 'O sistema cruza setor, estágio, ticket e necessidades para ordenar perfis compatíveis.' },
  { number: '03', title: 'Conecte-se', description: 'Envie convites, converse e proponha reuniões depois do aceite.' },
]

export default function Home() {
  return <main className="home">
    <Reveal as="section" className="home__hero"><div className="home__hero-content"><span className="home__eyebrow">✦ MATCH TRANSPARENTE COM A A.L.I.A</span><h1>Conectamos startups inovadoras a investidores certos</h1><p>Uma plataforma para aproximar quem tem grandes ideias de quem quer investir nelas, com critérios claros e sem intermediários.</p><div className="home__hero-actions"><Link to="/cadastro/startup" className="home__btn home__btn--primary">Sou startup</Link><Link to="/cadastro/investidor" className="home__btn home__btn--secondary">Sou investidor</Link></div><p className="home__proof">Perfis aprovados · compatibilidade explicável · decisões humanas</p></div><img src="/hero-people.png" alt="Fundadora e investidora conectadas pela NexHub" className="home__hero-image" /></Reveal>
    <Reveal as="section" id="como-funciona" className="home__how"><span className="home__eyebrow">COMO FUNCIONA</span><h2>Três passos para uma conexão de verdade</h2><p>Do cadastro ao fechamento, tudo acontece no mesmo lugar.</p><div className="home__steps">{STEPS.map((step, index) => <Reveal as="div" key={step.number} delay={index * 80}><StepCard {...step} /></Reveal>)}</div><Link className="home__more" to="/como-funciona">Veja como funciona →</Link></Reveal>
    <Reveal as="section" className="home__audience">
      <span className="home__eyebrow">PARA QUEM É A NEXHUB</span>
      <h2>Feito para os dois lados do match</h2>
      <div className="home__audience-grid">
        <Reveal as="article" className="home__audience-card home__audience-card--startup">
          <h3>Para Startups</h3>
          <p>Ganhe visibilidade com investidores alinhados ao seu momento e setor.</p>
          <ul>
            <li><span aria-hidden="true">✓</span> Perfil completo com pitch, métricas e tração</li>
            <li><span aria-hidden="true">✓</span> Mentores e investidores em um só lugar</li>
            <li><span aria-hidden="true">✓</span> Conexões, conversas e reuniões</li>
          </ul>
          <Link className="home__audience-cta" to="/cadastro/startup">Cadastrar startup <span aria-hidden="true">→</span></Link>
        </Reveal>
        <Reveal as="article" className="home__audience-card home__audience-card--investor" delay={100}>
          <h3>Para Investidores</h3>
          <p>Descubra startups filtradas pela sua tese de investimento.</p>
          <ul>
            <li><span aria-hidden="true">✓</span> Dealflow organizado por compatibilidade</li>
            <li><span aria-hidden="true">✓</span> Favoritos para acompanhar oportunidades</li>
            <li><span aria-hidden="true">✓</span> Conversa direta com fundadores</li>
          </ul>
          <Link className="home__audience-cta" to="/cadastro/investidor">Cadastrar como investidor <span aria-hidden="true">→</span></Link>
        </Reveal>
      </div>
    </Reveal>
    <Reveal as="section" className="home__alia"><span className="home__eyebrow">✦ CONHEÇA A A.L.I.A</span><h2>Compatibilidade transparente, sem caixa-preta</h2><p>A A.L.I.A organiza sugestões com base nas regras atuais do sistema. A nota mostra compatibilidade, não garante investimento ou sucesso.</p><Link to="/alia">Conheça a A.L.I.A →</Link></Reveal>
  </main>
}
