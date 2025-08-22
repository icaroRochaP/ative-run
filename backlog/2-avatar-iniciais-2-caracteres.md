# Tarefa 2 — Mostrar iniciais (1-2 caracteres) no avatar circular

Resumo
- Exibir até 2 caracteres dentro da bolinha/avatar do usuário conforme o `name` formatado (primeiro e último nome exibidos no dashboard).
- Regras:
  - `Davi` → `D` (1 letra)
  - `Davi Lopes` → `DL` (primeira letra do primeiro nome + primeira letra do último nome)
  - `Maria de Fatima Souza` → `MS` (primeira do primeiro e primeira do último, ignorar nomes do meio)
- Limitar avatar a máximo de 2 caracteres.

Arquivos a revisar / pontos de implementação sugeridos
- `components/ui/avatar.tsx` — componente Radix Avatar já exportado. Atualizar `AvatarFallback` para receber `name` (ou `initials`) e exibir até 2 caracteres.
- Onde o `Avatar` é usado (header, dashboard) — passar `name`/`initials` como children ou props.

Contrato (inputs/outputs)
- Input: `name` string (já formatado ou cru). Pode receber `null`.
- Output: avatar com conteúdo textual até 2 caracteres.
- Error modes: se `name` não disponível mostrar fallback (ícone ou vazio) mas preferir mostrar loader até nome estar disponível.

Implementação sugerida
1. Criar utilitário `lib/user-utils.ts` (se não existir) com:
   - `formatDisplayName(name: string | null): string | null` (ver Tarefa 1)
   - `getInitials(name: string | null, maxChars = 2): string` — retorna até `maxChars` letras maiúsculas.

2. Atualizar `components/ui/avatar.tsx`:
   - Ajustar `AvatarFallback` para renderizar `children` (iniciais) quando passado, ao invés de depender somente do fallback sem conteúdo.
   - Fornecer prop `initials?: string` ou permitir `<AvatarFallback>{initials}</AvatarFallback>`.

3. Atualizar usos do `Avatar` no header/dashboard para gerar `initials` via `getInitials(formatDisplayName(name))` e passá-las ao `AvatarFallback`.

Exemplo de comportamento para `getInitials`:
- Input: "Davi Santos Lopes" → formatDisplayName -> "Davi Lopes" → getInitials -> "DL"
- Input: "Davi" → "Davi" -> "D"

Estética e acessibilidade
- Texto centralizado, fonte legível, contraste adequado (usar `bg-muted`/`text-foreground` já presentes no `AvatarFallback`).
- `aria-label` no avatar com o `displayName` (ex: "Avatar de Davi Lopes").

Critérios de aceite
- [ ] Avatar mostra uma letra quando nome tem apenas 1 palavra.
- [ ] Avatar mostra 2 letras quando o nome tem 2+ palavras (primeira letra do primeiro e do último nome).
- [ ] Avatar nunca mostra mais que 2 caracteres.
- [ ] A funcionalidade funciona com nomes com acentuação e caracteres não-latinos.
- [ ] `aria-label` corretamente preenchido.

Testes sugeridos
- Unit tests para `getInitials` cobrindo:
  - `Davi` → `D`
  - `Davi Lopes` → `DL`
  - `  davi   lopes  ` → `DL`
  - `李` → `李`
  - `João da Silva` → `JS`
- Snapshot test para `AvatarFallback` mostrando o conteúdo textual.

Tarefas de implementação (passos)
1. Criar/estender `lib/user-utils.ts` com `getInitials` e `formatDisplayName`.
2. Ajustar `AvatarFallback` em `components/ui/avatar.tsx` para renderizar `children` e aceitar `aria-label`.
3. Atualizar o local onde o avatar é usado (header/dashboard) para passar `initials` dentro de `AvatarFallback`.
4. Adicionar testes unitários e storybook.

Estimativa
- Implementação: 1-2 horas
- Tests + story: 0.5-1 hora

PR template (o que incluir)
- Descrição e print/gif do avatar com iniciais.
- Lista de arquivos alterados.

Observações
- Mantive a abordagem para usar utilitários reutilizáveis para evitar lógica duplicada entre nome exibido e iniciais.

---

Arquivo criado automaticamente: `backlog/2-avatar-iniciais-2-caracteres.md`
