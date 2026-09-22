import { Link } from 'react-router-dom'
import StepCard from '../../components/StepCard/StepCard'
import './Home.css'

const STEPS = [
  {
    number: '01',
    title: 'Crie seu perfil',
    description: 'Cadastre sua startup ou seu perfil de investidor com informações, teses e objetivos claros.',
  },
  {
    number: '02',
    title: 'Receba matches inteligentes',
    description: 'Nosso algoritmo cruza setor, estágio, ticket e sinergia para sugerir as conexões certas.',
  },
  {
    number: '03',
    title: 'Feche negócios',
    description: 'Converse diretamente pela plataforma, agende reuniões e avance nas negociações com segurança.',
  },
]

function Home() {
  return (
    <main className="home">
      <section className="home__hero">
        <div className="home__hero-content">
          <h1>Conectamos startups inovadoras a investidores certos</h1>
          <p>
            A plataforma que usa match inteligente para aproximar quem tem grandes ideias de quem quer investir
            nelas, de forma rápida, transparente e sem intermediários.
          </p>
          <div className="home__hero-actions">
            <Link to="/cadastro/startup" className="home__btn home__btn--primary">
              Sou startup
            </Link>
            <Link to="/cadastro/investidor" className="home__btn home__btn--secondary">
              Sou investidor
            </Link>
          </div>
        </div>

        <img
          src="/hero-people.png"
          alt="Fundador e investidora usando o NexHub"
          className="home__hero-image"
        />
      </section>

      <section className="home__how">
        <h2>Como funciona</h2>
        <p>Três passos simples para transformar conexões em oportunidades reais</p>
        <div className="home__steps">
          {STEPS.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home