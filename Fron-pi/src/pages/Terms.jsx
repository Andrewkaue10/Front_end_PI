import { Link } from "react-router-dom";
export default function Terms() {
  return (
    <main
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: 24,
        lineHeight: 1.7,
      }}
    >
      <h1>Uso e privacidade — demonstração Nexhub</h1>
      <p>
        Versão 2026-10-19. Projeto acadêmico em desenvolvimento. Utilize
        informações fictícias durante os testes da equipe.
      </p>
      <h2>Finalidade</h2>
      <p>
        O sistema aproxima startups, investidores e mentores por critérios de
        compatibilidade. Pontuações não garantem investimento, qualidade do
        negócio ou sucesso de uma parceria. Não há movimentação financeira nesta
        demonstração.
      </p>
      <h2>Dados e visibilidade</h2>
      <p>
        São registrados nome, e-mail, telefone, perfil, aceite, favoritos,
        convites, mensagens e reuniões. O e-mail e o telefone não aparecem nos
        perfis de descoberta. A senha é armazenada como hash. As contas e os
        dados são persistidos no banco PostgreSQL do projeto no Supabase.
      </p>
      <p>
        Perfis aprovados podem ser vistos por usuários autenticados. Pitch e
        Canvas ficam restritos ao dono, à administração e às conexões aceitas,
        exceto quando o dono escolhe torná-los visíveis a todos os usuários
        autenticados. As mensagens são acessíveis aos participantes. A
        administração analisa perfis e registra justificativas das decisões.
      </p>
      <h2>Uso responsável</h2>
      <p>
        Não cadastre informações confidenciais de terceiros, dados sensíveis ou
        materiais sem autorização. Não use o ambiente para ofertas reais de
        investimento. Contas identificadas como demonstração representam pessoas
        e negócios fictícios.
      </p>
      <h2>Sessão e suporte</h2>
      <p>
        Um token de sessão é armazenado neste navegador; a opção manter
        conectado o preserva por até sete dias. Sair invalida as sessões da
        conta. Para solicitar correção ou remoção de dados nesta fase, procure
        Fernando, líder da equipe do projeto. A exclusão automática e a política
        operacional de retenção ainda estão em implementação.
      </p>
      <p>
        Este aviso descreve o comportamento da versão acadêmica. A equipe ainda
        precisa revisar e completar os documentos de governança antes de abrir o
        serviço a usuários reais.
      </p>
      <Link to="/">Voltar ao início</Link>
    </main>
  );
}
