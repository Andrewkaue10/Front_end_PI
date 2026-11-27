import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal/Reveal";
import "./AliaLanding.css";

const principles = [
  {
    icon: "↕",
    title: "Ordena",
    copy: "Organiza sugestões de acordo com critérios de compatibilidade.",
  },
  {
    icon: "⌕",
    title: "Explica",
    copy: "Mostra os fatores do perfil que contribuíram para cada sugestão.",
  },
  {
    icon: "✦",
    title: "Não decide por você",
    copy: "A decisão de conversar, investir ou seguir em frente continua humana.",
  },
];

const controls = [
  {
    icon: "▣",
    title: "Autorização dos seus dados",
    copy: "Use as informações da plataforma de acordo com as permissões e regras de privacidade.",
  },
  {
    icon: "▤",
    title: "Você escolhe o que compartilhar",
    copy: "Materiais e informações privadas seguem as permissões definidas para cada conexão.",
  },
  {
    icon: "◉",
    title: "O perfil continua sendo seu",
    copy: "Revise e atualize seus dados. Sugestões refletem as informações disponíveis no perfil.",
  },
  {
    icon: "↗",
    title: "Você decide quando agir",
    copy: "A A.L.I.A não envia convites nem inicia conversas em seu nome.",
  },
];

const questions = [
  [
    "A A.L.I.A conversa comigo?",
    "Não. Ela ajuda a organizar e explicar sugestões de compatibilidade. Para conversar, você escolhe quando enviar ou aceitar um convite.",
  ],
  [
    "A nota garante que vai acontecer um investimento?",
    "Não. A nota representa compatibilidade entre informações de perfil; não prevê resultados, retorno financeiro ou sucesso.",
  ],
  [
    "Posso discordar da sugestão?",
    "Sim. A sugestão é um ponto de partida. Você pode avaliar os critérios, conhecer o perfil e decidir por conta própria.",
  ],
  [
    "Como melhorar minhas sugestões?",
    "Mantenha seu perfil completo e atualizado, incluindo setor, estágio, objetivos e necessidades relevantes.",
  ],
];

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <div className="alia-landing__heading">
      <span className="alia-landing__eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

export default function AliaLanding() {
  return (
    <main className="alia-landing">
      <Reveal as="section" className="alia-landing__hero">
        <div className="alia-landing__hero-copy">
          <span className="alia-landing__eyebrow">CONHEÇA A A.L.I.A</span>
          <h1>
            A assistente de <em>compatibilidade</em> da NexHub
          </h1>
          <p>
            A A.L.I.A organiza sugestões para ajudar startups e investidores a
            encontrar conexões mais alinhadas. Entenda os critérios e escolha
            seu próximo passo com mais clareza.
          </p>
          <div className="alia-landing__actions">
            <Link className="alia-landing__button" to="/cadastro/startup">
              Cadastre-se grátis
            </Link>
            <a className="alia-landing__button alia-landing__button--outline" href="#como-funciona">
              Ver como funciona
            </a>
          </div>
        </div>
        <div className="alia-landing__preview" aria-label="Exemplo ilustrativo de sugestões compatíveis">
          <div className="alia-landing__preview-orb" aria-hidden="true">
            ✦
          </div>
          <p className="alia-landing__preview-label">SUGESTÕES COMPATÍVEIS</p>
          {[
            ["CD", "Colheita Digital", "Startup · Saúde digital", "94"],
            ["VC", "Vórtice Capital", "Investidor · Tecnologia", "89"],
            ["MV", "Mover", "Startup · Mobilidade", "87"],
          ].map(([mark, name, category, score]) => (
            <article className="alia-landing__match" key={name}>
              <span className="alia-landing__match-mark">{mark}</span>
              <span className="alia-landing__match-copy">
                <strong>{name}</strong>
                <small>{category}</small>
              </span>
              <b>{score}</b>
            </article>
          ))}
          <small className="alia-landing__preview-footnote">
            Compatibilidade demonstrativa · não representa uma previsão
          </small>
        </div>
      </Reveal>

      <Reveal as="section" className="alia-landing__section" id="papel-da-alia">
        <SectionHeading
          eyebrow="O QUE É"
          title="Uma IA com um papel específico"
          copy="Na NexHub, a A.L.I.A ajuda a dar contexto às sugestões de conexão."
        />
        <div className="alia-landing__principles">
          {principles.map((item, index) => (
            <Reveal
              as="article"
              className="alia-landing__principle"
              delay={index * 70}
              key={item.title}
            >
              <span aria-hidden="true">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="alia-landing__section alia-landing__section--muted">
        <SectionHeading
          eyebrow="LIMITES CLAROS"
          title="O que a A.L.I.A faz — e o que ela não faz"
        />
        <div className="alia-landing__limits">
          <article className="alia-landing__limit alia-landing__limit--yes">
            <h3>✓ O que ela faz</h3>
            <ul>
              <li>Organiza sugestões com base nos critérios disponíveis.</li>
              <li>Apresenta os fatores que contribuíram para a compatibilidade.</li>
              <li>Ajuda você a explorar conexões relevantes na plataforma.</li>
            </ul>
          </article>
          <article className="alia-landing__limit alia-landing__limit--no">
            <h3>× O que ela não faz</h3>
            <ul>
              <li>Não prevê sucesso, retorno financeiro ou resultado de negócio.</li>
              <li>Não aprova cadastros nem escolhe quem pode conversar.</li>
              <li>Não envia convites ou toma decisões em seu nome.</li>
            </ul>
          </article>
        </div>
      </Reveal>

      <Reveal
        as="section"
        className="alia-landing__section"
        id="como-funciona"
      >
        <SectionHeading
          eyebrow="COMO A SUGESTÃO É FORMADA"
          title="Critérios claros, compatibilidade explicável"
          copy="A plataforma cruza informações de perfil para organizar oportunidades — sempre como apoio à sua avaliação."
        />
        <div className="alia-landing__steps">
          <article className="alia-landing__step">
            <span>ETAPA 1 · PERFIS</span>
            <h3>Filtros e critérios objetivos</h3>
            <p>
              Setor, estágio, ticket e necessidades ajudam a identificar
              conexões que podem fazer sentido.
            </p>
          </article>
          <article className="alia-landing__step">
            <span>ETAPA 2 · COMPATIBILIDADE</span>
            <h3>Uma nota com contexto</h3>
            <p>
              A pontuação resume os critérios considerados e pode ser
              consultada junto aos motivos da sugestão.
            </p>
          </article>
        </div>
        <div className="alia-landing__score">
          <strong>Uma referência para começar a conversa</strong>
          <div className="alia-landing__score-equation">
            <span>
              <b>Perfil</b>
              <small>dados cadastrados</small>
            </span>
            <i aria-hidden="true">+</i>
            <span>
              <b>Regras</b>
              <small>critérios atuais</small>
            </span>
            <i aria-hidden="true">=</i>
            <span className="alia-landing__score-result">
              <b>83</b>
              <small>nota ilustrativa</small>
            </span>
          </div>
          <small>
            Exemplo ilustrativo. A nota não é uma probabilidade nem uma garantia
            de resultado.
          </small>
        </div>
      </Reveal>

      <Reveal as="section" className="alia-landing__section alia-landing__section--muted">
        <SectionHeading
          eyebrow="MAIS CONTEXTO"
          title="Veja os motivos por trás das sugestões"
          copy="Exemplo ilustrativo dos motivos que podem aparecer. Os critérios dependem das informações de cada perfil."
        />
        <div className="alia-landing__examples">
          {[
            ["CD", "Colheita Digital", "94", "Startup · Saúde digital"],
            ["MV", "Mover", "87", "Startup · Mobilidade"],
          ].map(([mark, name, score, detail]) => (
            <article className="alia-landing__example" key={name}>
              <span className="alia-landing__match-mark">{mark}</span>
              <div>
                <small>{detail}</small>
                <h3>{name}</h3>
                <ul>
                  <li>Setor alinhado às preferências informadas</li>
                  <li>Estágio compatível com os critérios do perfil</li>
                  <li>Confira os dados antes de iniciar uma conexão</li>
                </ul>
              </div>
              <b className="alia-landing__example-score">{score}</b>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="alia-landing__section alia-landing__section--dark">
        <SectionHeading
          eyebrow="TRANSPARÊNCIA E CONTROLE"
          title="Você decide se e quando avançar"
          copy="A A.L.I.A organiza informações. As escolhas e conexões continuam nas suas mãos."
        />
        <div className="alia-landing__controls">
          {controls.map((item, index) => (
            <Reveal
              as="article"
              className="alia-landing__control"
              delay={index * 60}
              key={item.title}
            >
              <span aria-hidden="true">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="alia-landing__section">
        <SectionHeading
          eyebrow="PLANOS"
          title="Comece no seu ritmo"
          copy="Crie seu perfil gratuitamente e conheça as ferramentas da NexHub."
        />
        <div className="alia-landing__plans">
          <article className="alia-landing__plan">
            <h3>Gratuito</h3>
            <p>Para conhecer a plataforma e começar a criar conexões.</p>
            <ul>
              <li>Criação de perfil</li>
              <li>Sugestões de compatibilidade</li>
              <li>Conexões e conversas na plataforma</li>
            </ul>
            <Link className="alia-landing__button" to="/cadastro/startup">
              Criar meu perfil
            </Link>
          </article>
          <article className="alia-landing__plan alia-landing__plan--highlight">
            <span className="alia-landing__plan-badge">EM EVOLUÇÃO</span>
            <h3>Novos recursos</h3>
            <p>
              Estamos evoluindo a experiência com transparência e foco nas
              necessidades do ecossistema.
            </p>
            <ul>
              <li>Novidades serão comunicadas na plataforma</li>
              <li>Nenhuma cobrança é feita por esta página</li>
              <li>Você segue no controle das suas conexões</li>
            </ul>
            <a className="alia-landing__text-link" href="#perguntas">
              Saiba mais nas perguntas frequentes ↓
            </a>
          </article>
        </div>
      </Reveal>

      <Reveal as="section" className="alia-landing__section alia-landing__section--muted">
        <SectionHeading
          eyebrow="CONTEXTO E RESPONSABILIDADE"
          title="Uma sugestão é só o começo"
        />
        <div className="alia-landing__notice-grid">
          <article>
            <h3>◈ A nota é uma referência</h3>
            <p>
              Compatibilidade depende das informações disponíveis e dos
              critérios usados. Conheça o perfil e faça sua própria avaliação.
            </p>
          </article>
          <article>
            <h3>✓ Seus dados importam</h3>
            <p>
              Compartilhe informações com cuidado e consulte as permissões e
              configurações de privacidade da sua conta.
            </p>
          </article>
        </div>
      </Reveal>

      <Reveal
        as="section"
        className="alia-landing__section alia-landing__section--faq"
        id="perguntas"
      >
        <SectionHeading eyebrow="DÚVIDAS" title="Perguntas frequentes sobre a A.L.I.A" />
        <div className="alia-landing__faq">
          {questions.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="alia-landing__cta">
        <h2>Encontre conexões mais compatíveis</h2>
        <p>Crie seu perfil gratuito e conheça a NexHub.</p>
        <div className="alia-landing__actions">
          <Link className="alia-landing__button" to="/cadastro/startup">
            Sou startup
          </Link>
          <Link
            className="alia-landing__button alia-landing__button--outline"
            to="/cadastro/investidor"
          >
            Sou investidor
          </Link>
        </div>
      </Reveal>

      <footer className="alia-landing__footer">
        <Link to="/" className="alia-landing__footer-brand">
          NEX<span>hub</span> ✦
        </Link>
        <p>Conexões mais claras para o ecossistema de inovação.</p>
        <nav aria-label="Links do rodapé">
          <Link to="/como-funciona">Como funciona</Link>
          <Link to="/para-startups">Para startups</Link>
          <Link to="/para-investidores">Para investidores</Link>
          <Link to="/termos">Termos de uso</Link>
        </nav>
        <small>© 2026 NexHub. Todos os direitos reservados.</small>
      </footer>
    </main>
  );
}
