import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal/Reveal";
import "./Marketing.css";

const pages = {
  how: {
    eyebrow: "COMO FUNCIONA",
    title: (
      <>
        Do primeiro match ao fechamento,
        <br />
        <em>tudo no mesmo lugar</em>
      </>
    ),
    lead: "A NexHub aproxima startups, investidores e mentores com critérios claros. Da criação do perfil à conversa, a conexão acontece na própria plataforma.",
    sections: [
      {
        eyebrow: "O CAMINHO",
        title: "Cinco passos para uma conexão de verdade",
        cards: [
          [
            "01",
            "Crie seu perfil",
            "Startups apresentam negócio, estágio e captação. Profissionais informam tese, setores e disponibilidade.",
          ],
          [
            "02",
            "Receba sugestões compatíveis",
            "O sistema ordena perfis aprovados por critérios de setor, estágio, ticket e necessidades.",
          ],
          [
            "03",
            "Entenda cada sugestão",
            "Veja a nota e os motivos objetivos que explicam a compatibilidade.",
          ],
          [
            "04",
            "Conecte-se e converse",
            "Envie um convite; depois do aceite, use mensagens e proponha reuniões.",
          ],
          [
            "05",
            "Avance com segurança",
            "Materiais privados ficam sujeitos às permissões e regras da conexão.",
          ],
        ],
      },
      {
        eyebrow: "MATCH TRANSPARENTE",
        title: "Sugestões explicáveis, decisões humanas",
        text: "A pontuação mostra compatibilidade entre os perfis. Ela não prevê sucesso, retorno financeiro nem substitui a avaliação das pessoas.",
      },
    ],
  },
  startup: {
    eyebrow: "PARA STARTUPS",
    title: (
      <>
        Encontre investidores e mentores
        <br />
        <em>alinhados ao seu momento</em>
      </>
    ),
    lead: "Apresente sua startup para pessoas que atuam no seu setor, estágio e faixa de captação.",
    cta: "Cadastrar startup grátis",
    signup: "/cadastro/startup",
    sections: [
      {
        eyebrow: "O QUE VOCÊ GANHA",
        title: "Tudo para encontrar as conexões certas",
        cards: [
          [
            "01",
            "Perfil completo",
            "Conte sua proposta, estágio, setores e necessidades.",
          ],
          [
            "02",
            "Sugestões compatíveis",
            "Descubra investidores e mentores aprovados com motivos claros.",
          ],
          [
            "03",
            "Pitch e materiais",
            "Organize links e informações do negócio no perfil.",
          ],
          [
            "04",
            "Conexões e reuniões",
            "Convide, converse e proponha reuniões em um só lugar.",
          ],
        ],
      },
      {
        eyebrow: "COMO SE PREPARAR",
        title: "Um perfil claro ajuda a criar boas conexões",
        text: "Complete a apresentação da startup, informe o estágio e a captação desejada e mantenha os dados atualizados. Perfis novos e editados passam por análise antes de aparecer nas sugestões.",
      },
    ],
  },
  investor: {
    eyebrow: "PARA INVESTIDORES",
    title: (
      <>
        Descubra startups compatíveis
        <br />
        <em>com a sua tese</em>
      </>
    ),
    lead: "Defina setores, estágios e ticket. A NexHub organiza perfis aprovados e mostra por que podem fazer sentido.",
    cta: "Cadastrar como investidor",
    signup: "/cadastro/investidor",
    sections: [
      {
        eyebrow: "O QUE VOCÊ GANHA",
        title: "Mais clareza para avaliar oportunidades",
        cards: [
          [
            "01",
            "Sugestões por tese",
            "Informe setores, estágios e ticket para encontrar perfis alinhados.",
          ],
          [
            "02",
            "Transparência no match",
            "Cada sugestão apresenta nota e motivos baseados nos dados cadastrados.",
          ],
          [
            "03",
            "Favoritos",
            "Salve startups para acompanhar e comparar depois.",
          ],
          [
            "04",
            "Conversa direta",
            "Aceite conexões, troque mensagens e proponha reuniões.",
          ],
        ],
      },
      {
        eyebrow: "CRITÉRIOS E SEGURANÇA",
        title: "Perfis aprovados e conexões com controle",
        text: "Perfis pendentes ou inativos não entram na descoberta. O convite precisa ser aceito antes de liberar a conversa.",
      },
    ],
  },
  alia: {
    eyebrow: "CONHEÇA A A.L.I.A",
    title: (
      <>
        Compatibilidade explicável
        <br />
        <em>com limites claros</em>
      </>
    ),
    lead: "A A.L.I.A organiza sugestões. O motor atual da NexHub usa regras de compatibilidade e explica os critérios que contribuíram para cada nota.",
    sections: [
      {
        eyebrow: "O QUE ELA FAZ",
        title: "Ajuda a encontrar quem combina",
        cards: [
          [
            "✦",
            "Ordena",
            "Organiza as sugestões por compatibilidade calculada.",
          ],
          [
            "⌕",
            "Explica",
            "Apresenta nota e motivos gerados a partir dos dados do perfil.",
          ],
          [
            "◎",
            "Apoia",
            "A decisão de conversar ou investir continua com as pessoas.",
          ],
        ],
      },
      {
        eyebrow: "LIMITES CLAROS",
        title: "O que a A.L.I.A não faz",
        cards: [
          [
            "✓",
            "Critérios objetivos",
            "Cruza setor, estágio, ticket e necessidades conforme as regras atuais.",
          ],
          [
            "×",
            "Não decide por você",
            "Não aprova cadastros nem escolhe quem pode conversar.",
          ],
          [
            "×",
            "Sem conversa automática",
            "Não escreve perfis nem conversa com usuários.",
          ],
        ],
      },
      {
        eyebrow: "TRANSPARÊNCIA",
        title: "A nota não é uma promessa",
        text: "A pontuação indica compatibilidade entre perfis, não probabilidade de investimento ou sucesso. A recomendação atual é baseada em regras; análise semântica de textos e preferências de IA ainda não fazem parte do backend entregue.",
      },
    ],
  },
  about: {
    eyebrow: "SOBRE A NEXHUB",
    title: (
      <>
        Conectar boas ideias a<br />
        <em>quem pode impulsioná-las</em>
      </>
    ),
    lead: "A NexHub reúne startups, investidores e mentores em um espaço para descobrir compatibilidades, iniciar conversas e organizar reuniões.",
    sections: [
      {
        eyebrow: "NOSSA MISSÃO",
        title: "Uma dificuldade comum no ecossistema",
        text: "Startups nem sempre sabem a quem procurar; investidores e mentores precisam encontrar oportunidades alinhadas. A NexHub organiza descoberta, convites e conversas em um só lugar.",
      },
      {
        eyebrow: "NO QUE ACREDITAMOS",
        title: "Transparência e privacidade",
        cards: [
          ["⌕", "Critérios claros", "Cada sugestão mostra por que apareceu."],
          ["◈", "Privacidade", "Materiais podem ter acesso controlado."],
          ["✓", "Honestidade", "Compatibilidade não garante resultado."],
          [
            "♡",
            "Decisões humanas",
            "A plataforma conecta; as pessoas decidem.",
          ],
        ],
      },
    ],
  },
};

export default function Marketing({ page }) {
  const data = pages[page] || pages.how;
  return (
    <main className="marketing">
      <Reveal as="header" className="marketing-hero">
        <span className="eyebrow">{data.eyebrow}</span>
        <h1>{data.title}</h1>
        <p>{data.lead}</p>
        <div className="marketing-actions">
          <Link
            className="marketing-button"
            to={data.signup || "/cadastro/startup"}
          >
            {data.cta || "Cadastre-se grátis"}
          </Link>
          <Link className="marketing-button secondary" to="/login">
            Entrar
          </Link>
        </div>
      </Reveal>
      {data.sections.map((section) => (
        <Reveal as="section" className="marketing-section" key={section.title}>
          <span className="eyebrow">{section.eyebrow}</span>
          <h2>{section.title}</h2>
          {section.text && <p className="section-copy">{section.text}</p>}
          {section.cards && (
            <div className="marketing-cards">
              {section.cards.map(([icon, title, copy], index) => (
                <Reveal
                  as="article"
                  className="marketing-card"
                  key={title}
                  delay={index * 70}
                >
                  <span>{icon}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </Reveal>
              ))}
            </div>
          )}
        </Reveal>
      ))}
      <Reveal as="section" className="marketing-cta">
        <h2>Pronto para começar?</h2>
        <p>Crie seu perfil gratuito e descubra novas conexões.</p>
        <Link className="marketing-button" to="/cadastro/startup">
          Sou startup
        </Link>
        <Link className="marketing-button secondary" to="/cadastro/investidor">
          Sou investidor
        </Link>
      </Reveal>
    </main>
  );
}
