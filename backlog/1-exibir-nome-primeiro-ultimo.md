# Tarefa 1 — Mostrar apenas Primeiro e Último Nome no dashboard

Resumo
- Ao invés de exibir "Alex Johnson" estático, exibir o nome do usuário autenticado (campo `name`) no dashboard.
- Mostrar apenas o primeiro e o último nome. Exemplo: `Davi Santos Lopes` → `Davi Lopes`.
- O nome não pode ficar vazio quando a tela aparecer; se necessário, manter o loader/placeholder visível até o nome ser carregado.

Requisitos extraídos
- Ler o campo `name` do usuário autenticado (presumimos que já existe em `auth`/`provider` ou `supabase` session).
- Transformar o `name` em uma string com apenas primeiro e último nomes.
- Garantir que nada mais seja exibido (sem middle names, sem sobrenomes extras).
- Mostrar texto assim que disponível; manter loader visível enquanto não for.

Arquivos a revisar / pontos de implementação sugeridos
- `components/ui/avatar.tsx` — avatar/fallback pode precisar de ajuste para exibir as iniciais (tarefa separada).
- `app/dashboard/head.tsx` ou `app/dashboard/page.tsx` — onde o nome aparece na UI do dashboard.
- `components/auth-provider.tsx` e `lib/supabase.ts` — localizar onde o usuário autenticado está disponível via contexto/session.

Contrato (inputs/outputs)
- Input: objeto `user` (ex: { name: string | null }) fornecido pelo provider/context.
- Output: `displayName` string com `First Last` ou fallback (ex.: "Usuário").
- Erro: se `name` nulo/indisponível → manter loader; após timeout razoável mostrar fallback controlado.

Regras de transformação (algumas suposições aplicadas)
- Separar por espaços em unicode e filtrar strings vazias.
- Primeiro nome = primeiro token.
- Último nome = último token (se houver >1 token).
- Se houver somente 1 token, mostrar apenas ele.
- Remover espaços duplicados e trimming.
- Preservar capitalização: transformar para 'Title Case' (primeira letra maiúscula).

UX: carregamento e evitar flash
- Mostrar loader/placeholder (mesmo componente de skeleton ou spinner usado na troca de tela).
- Garantir mínimo de 300–600ms de loader se o nome chegar instantaneamente (para evitar flash).
- Se nome não carregar em 5s, exibir fallback ("Usuário") e enviar log/telemetria.

Critérios de aceite (QA)
- [ ] Ao abrir a dashboard com usuário `Davi Santos Lopes`, aparece `Davi Lopes` no local onde antes estava "Alex Johnson".
- [ ] Com usuário `Davi` (apenas um nome) aparece `Davi`.
- [ ] Não aparecem nomes extras ou sobrenomes intermediários.
- [ ] O campo nunca aparece vazio: enquanto o nome está pendente mostra-se o loader; se exceder 5s, mostra fallback.
- [ ] Implementação lê o `name` do contexto de autenticação já existente (não usar hardcoded strings).

Testes sugeridos
- Unit tests para a função utilitária que converte `name` → `displayName`:
  - `"Davi Santos Lopes"` → `"Davi Lopes"`
  - `"Davi"` → `"Davi"`
  - `"  davi   lopes  "` → `"Davi Lopes"`
  - Nome com caracteres não-latinos e acentuação preservados.
- Integration test / Storybook: componente do header/dashboard exibindo o nome a partir de um `user` mock e com loading true/false.

Tarefas de implementação (passos)
1. Criar utilitário: `lib/user-utils.ts` exportando `formatDisplayName(name: string | null): string | null`.
2. Localizar componente que mostra o nome no dashboard (`app/dashboard/page.tsx` ou `components/header.tsx`) e substituí-lo para usar o provider/context e `formatDisplayName`.
3. Adicionar lógica de loading:
   - Se `user` for `undefined` ou `name` for `null`, mostrar loader.
   - Aguardar até 5s por `name`. Implementar mínimo visual de 300ms quando o nome chega instantaneamente.
4. Adicionar testes unitários para `formatDisplayName` e um teste de integração para o header.
5. Atualizar / adicionar story em Storybook (se usado) demonstrando os estados: loading, display com 1 nome, display com vários nomes, fallback.

Estimativa
- Implementação: 2-4 horas
- Tests+Storybook: 1-2 horas

PR template (o que incluir)
- Descrição da mudança.
- Arquivos alterados.
- Capturas de tela / GIF mostrando: loading → nome final.
- Link para testes unitários adicionados.

Observações / Assunções
- Assumo que o `user` já é provido por um contexto ou session acessível no frontend (ver `components/auth-provider.tsx` e `lib/supabase.ts`).
- Se o `name` só existir no backend (não no JWT/session), será necessário um endpoint adicional para buscar o usuário; isso aumentará o escopo — documentar se for o caso.

---

Arquivo criado automaticamente: `backlog/1-exibir-nome-primeiro-ultimo.md`
