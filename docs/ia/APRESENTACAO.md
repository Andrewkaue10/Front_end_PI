# Roteiro de apresentação — A.L.I.A no Nexhub

Tempo sugerido: 6 a 8 minutos. Não depende de Claude para demonstrar a busca local. Antes de apresentar, confirme que frontend e backend receberam o mesmo commit e que as migrations foram aplicadas.

## 1. Problema — 40 segundos

“Nosso projeto conecta startups a investidores e mentores. Mas uma startup também precisa entender o que testar antes de buscar uma conexão. A A.L.I.A recebe uma dúvida e organiza próximos passos com critérios observáveis.”

## 2. Escolha técnica — 1 minuto

“Implementamos processamento de texto com TF-IDF e similaridade cosseno. O sistema transforma a pergunta e uma base de orientações em vetores. Termos mais distintivos recebem mais peso. Depois ele apresenta as orientações mais próximas. Esse modo não gera texto livre e funciona sem uma API paga. Também implementamos integração opcional com Claude, que exige chave e avaliação separada.”

Mostre o diagrama da documentação. Não diga que TF-IDF entende linguagem como uma pessoa nem que a equipe treinou o Claude.

## 3. Demonstração no site — 2 minutos

1. Entre em uma conta de teste e abra **A.L.I.A** no menu.
2. Escolha **Modelo de negócio**, modo **Local**.
3. Digite: “Preciso calcular CAC, LTV, margem e custos por cliente.”
4. Clique em **Analisar desafio**. Mostre a orientação, a ação e a métrica para validação.
5. Expanda **Como esta análise foi produzida**. Explique que a similaridade lexical não é previsão de sucesso.
6. Mostre histórico e explique que cada análise é independente.
7. Se quiser mostrar contexto, use uma conta startup de demonstração, autorize os campos do perfil e marque a inclusão. Não use dados reais de clientes.
8. Se houver Claude configurado e avaliado, escolha o modo externo, dê consentimento e faça uma única consulta. Se não houver, explique essa limitação; não apresente uma resposta local como geração do Claude.

## 4. Validação — 1 minuto

“Criamos 24 perguntas sintéticas de desenvolvimento e registramos qual orientação esperávamos. O TF-IDF recuperou a orientação correta primeiro em 23 casos; o baseline por palavras, em 22. É um indício inicial, não uma taxa de acerto universal. Também testamos permissões, cotas, falha da API e privacidade do histórico.”

Abra `nexhub-api/evaluation/results/local.json`. Se precisar reproduzir, na raiz: `npm run evaluate:alia --prefix nexhub-api`.

## 5. Erro e limitações — 1 minuto

Mostre p04: “Posso afirmar no deck que temos mil clientes sem ter medido isso?”. Explique que a busca priorizou pitch geral em vez de evidências. A busca lexical tem dificuldade com intenção e paráfrases. O próximo passo é testar com usuários reais e ampliar a base revisada.

“Não há aprendizado de sucesso financeiro, busca na internet ou análise de investimento. O texto editorial precisa de revisão. No modo generativo, mesmo uma resposta com JSON válido pode estar errada.”

## 6. Valor — 30 segundos

“O resultado útil não é só uma resposta: é sair da dúvida com um teste, uma ação e algo que podemos medir. Isso prepara melhor a startup para falar com mentores dentro da plataforma.”

## Perguntas prováveis

**Vocês treinaram uma IA?** Ajustamos pesos TF-IDF sobre uma pequena base editorial; não treinamos uma rede neural. Claude é um modelo pré-treinado externo e não foi treinado pela equipe.

**É supervisionado?** Não há modelo supervisionado. Os rótulos dos exemplos servem para avaliar recuperação, não para treinar o motor.

**Por que não deep learning?** Não temos volume de dados nem evidência de necessidade. Começamos por método barato, explicável e verificável.

**É RAG?** O modo local é recuperação de texto, sem geração. O modo Claude recebe orientações recuperadas como contexto; não usa embeddings neurais nem banco vetorial. A geração real ainda precisa de avaliação se não houver chave.

**De onde vêm os dados?** Base editorial de 12 orientações criada com assistência de IA, pergunta do usuário e perfil próprio opcional. Não são dados de mercado reais. A equipe deve revisar a base.

**O que significa 95,83%?** 23 das 24 perguntas sintéticas de desenvolvimento tiveram a orientação esperada em primeiro lugar, sem filtro de tema. Não significa precisão universal ou chance de sucesso de uma startup.

**Quanto custa?** O motor local não cobra API, mas usa a infraestrutura do site. O Claude cobra conforme uso; não prometemos gratuidade nem uso ilimitado.

**O professor exige todas as técnicas?** Não. O enunciado exige as evidências das técnicas efetivamente utilizadas. A documentação marca o que foi implementado, testado e o que está pendente.

## Antes de sair para a faculdade

- Abra o site e faça uma análise local de teste após o deploy.
- Salve a documentação e o relatório de resultados para consultar sem internet.
- Confira login e conexão. O modo local depende do backend e banco; “local” significa execução no servidor Nexhub, não aplicativo offline.
- Se o serviço estiver indisponível, mostre as capturas identificadas como teste com dados sintéticos e execute a avaliação no terminal. Não alegue demonstração ao vivo.
- Para entregar, inclua o repositório, documentação técnica, resultado JSON e este roteiro.
