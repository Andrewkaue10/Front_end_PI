# Telas faltantes — implementação

## Rotas frontend

- `/startup/publicacoes`: feed, publicações próprias e rascunhos da startup.
- `/startup/perfil`: visão geral, equipe, métricas e documentos da startup.
- `/investidor/matches`: recomendações, pendentes, conectadas e dispensadas.

As rotas usam `StartupShell` ou `AreaShell` e os guards já existentes por papel.

## Rotas backend

- `GET/POST/PATCH/DELETE /posts` e rotas de comentários, curtidas e reposts.
- `GET/POST/PATCH/DELETE /startup-metrics`.
- `GET/POST/DELETE /match-dismissals` e equivalentes de dispensa por startup.
- `GET /recommendations` aceita filtros `sector`, `stage` e `ticket`.
- `/profile` aceita os campos persistidos ampliados da startup e do profissional.

## Persistência

A migração `202611190003_publications_metrics_dismissals` cria posts, tags, métricas, comentários, reações, reposts e dispensas. Os registros não foram aplicados nem testados contra banco, pois `DATABASE_URL` não está configurado nesta entrega.

As telas mostram apenas dados retornados pela API. Métricas são explicitamente apresentadas como informadas pela startup. Não há upload de mídia ou geração de dados de demonstração.
