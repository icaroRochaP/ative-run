# Tarefa 3 — Componentizar Dashboard (Separar page.tsx em componentes reutilizáveis)

## Resumo
O arquivo `app/dashboard/page.tsx` contém todo o código do dashboard em um único componente de ~1000+ linhas, dificultando a manutenção. Esta tarefa visa separar o dashboard em componentes menores, organizados e reutilizáveis para facilitar desenvolvimento, testes e manutenção.

## Objetivos
- Separar cada aba do dashboard (Resumo, Treino, Progresso, Nutrição) em componentes independentes
- Extrair modais em componentes separados
- Criar componentes para cards/seções reutilizáveis
- Manter a funcionalidade existente intacta
- Melhorar a organização do código e facilitar manutenção futura

## Componentes a serem criados

### 1. Componentes das Abas Principais
- `components/dashboard/ResumoTab.tsx` — Tab de resumo com header do usuário, atividade, ações rápidas
- `components/dashboard/TreinoTab.tsx` — Tab de treino com planos e histórico
- `components/dashboard/ProgressoTab.tsx` — Tab de progresso com peso, fotos, social sharing
- `components/dashboard/NutricaoTab.tsx` — Tab de nutrição com macros e plano de refeições

### 2. Componentes de Cards Reutilizáveis
- `components/dashboard/UserHeaderCard.tsx` — Card com avatar, nome, status da assinatura
- `components/dashboard/ActivityStatsCard.tsx` — Card com treinos do mês e dias seguidos
- `components/dashboard/QuickActionsCard.tsx` — Card de boas-vindas/ações rápidas
- `components/dashboard/GoalsCard.tsx` — Card com metas e progresso (se usado)
- `components/dashboard/WorkoutCard.tsx` — Card individual de treino
- `components/dashboard/WeightProgressCard.tsx` — Card de progresso de peso
- `components/dashboard/ProgressPhotoCard.tsx` — Card de fotos de progresso
- `components/dashboard/MealCard.tsx` — Card individual de refeição
- `components/dashboard/MacroGoalsCard.tsx` — Card com metas de macronutrientes

### 3. Componentes de Modais
- `components/dashboard/modals/WorkoutDetailModal.tsx` — Modal de detalhes do treino
- `components/dashboard/modals/WorkoutHistoryModal.tsx` — Modal de histórico de treino
- `components/dashboard/modals/WeightUpdateModal.tsx` — Modal para atualizar peso
- `components/dashboard/modals/WeeklyMealPlanModal.tsx` — Modal do plano semanal
- `components/dashboard/modals/MealDetailModal.tsx` — Modal de detalhes da refeição

### 4. Hooks Customizados (Opcional)
- `hooks/useDashboardData.tsx` — Hook para gerenciar estado do dashboard
- `hooks/useWeightTracking.tsx` — Hook para gerenciar atualizações de peso
- `hooks/useMealPlan.tsx` — Hook para gerenciar plano de refeições

## Estrutura de Arquivos Proposta
```
components/
  dashboard/
    tabs/
      ResumoTab.tsx
      TreinoTab.tsx
      ProgressoTab.tsx
      NutricaoTab.tsx
    cards/
      UserHeaderCard.tsx
      ActivityStatsCard.tsx
      QuickActionsCard.tsx
      WorkoutCard.tsx
      WeightProgressCard.tsx
      ProgressPhotoCard.tsx
      MealCard.tsx
      MacroGoalsCard.tsx
    modals/
      WorkoutDetailModal.tsx
      WorkoutHistoryModal.tsx
      WeightUpdateModal.tsx
      WeeklyMealPlanModal.tsx
      MealDetailModal.tsx
    DashboardLayout.tsx
    FloatingActionButton.tsx
hooks/
  dashboard/
    useDashboardData.tsx
    useWeightTracking.tsx
    useMealPlan.tsx
```

## Interfaces e Types
Criar arquivo `types/dashboard.ts` com interfaces para:
- `User`
- `Workout`
- `WeightUpdate`
- `ProgressPhoto`
- `Meal`
- `MealPlan`
- `Goal`

## Critérios de Aceite
- [ ] Dashboard principal (`page.tsx`) reduzido para <200 linhas, apenas orquestrando componentes
- [ ] Cada aba (Resumo, Treino, Progresso, Nutrição) é um componente separado
- [ ] Todos os modais são componentes independentes
- [ ] Cards repetitivos são componentes reutilizáveis
- [ ] Estado do dashboard é gerenciado de forma centralizada (Context ou hooks)
- [ ] Todos os componentes têm props tipadas com TypeScript
- [ ] Funcionalidade existente permanece intacta (nenhuma regressão)
- [ ] Componentes são testáveis individualmente
- [ ] Imports organizados e sem dependências circulares

## Tarefas de Implementação

### Fase 1: Preparação e Types
1. **Criar arquivo de types**: `types/dashboard.ts` com todas as interfaces necessárias
2. **Criar estrutura de pastas**: `components/dashboard/` com subpastas `tabs/`, `cards/`, `modals/`
3. **Definir props interfaces**: Para cada componente a ser criado

### Fase 2: Extrair Componentes de Cards
4. **UserHeaderCard**: Extrair seção do header com avatar e nome
5. **ActivityStatsCard**: Extrair card de atividade (treinos do mês, dias seguidos)
6. **QuickActionsCard**: Extrair card de boas-vindas/ações rápidas
7. **WorkoutCard**: Extrair card individual de treino
8. **MealCard**: Extrair card individual de refeição
9. **WeightProgressCard**: Extrair card de progresso de peso
10. **MacroGoalsCard**: Extrair card de metas de macros

### Fase 3: Extrair Componentes das Abas
11. **ResumoTab**: Mover todo conteúdo da aba resumo
12. **TreinoTab**: Mover todo conteúdo da aba treino
13. **ProgressoTab**: Mover todo conteúdo da aba progresso
14. **NutricaoTab**: Mover todo conteúdo da aba nutrição

### Fase 4: Extrair Modais
15. **WorkoutDetailModal**: Mover modal de detalhes do treino
16. **WorkoutHistoryModal**: Mover modal de histórico
17. **WeightUpdateModal**: Mover modal de atualização de peso
18. **WeeklyMealPlanModal**: Mover modal do plano semanal
19. **MealDetailModal**: Mover modal de detalhes da refeição

### Fase 5: Hooks e Estado Centralizado
20. **useDashboardData**: Hook para gerenciar userData, displayName, etc.
21. **useWeightTracking**: Hook para gerenciar weightUpdates e progressPhotos
22. **useMealPlan**: Hook para gerenciar weeklyMealPlan

### Fase 6: Refatoração Final
23. **DashboardLayout**: Componente wrapper com tabs e floating button
24. **Refatorar page.tsx**: Reduzir para apenas orquestração de componentes
25. **Limpar imports**: Organizar e remover imports desnecessários
26. **Otimizar re-renders**: Adicionar React.memo onde apropriado

## Padrões e Convenções

### Estrutura de Componente
```tsx
interface ComponentProps {
  // props tipadas
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // lógica do componente
  return (
    // JSX
  )
}
```

### Gerenciamento de Estado
- Estado local: `useState` para estado específico do componente
- Estado compartilhado: Context API ou hooks customizados
- Evitar prop drilling através de muitos níveis

### Naming Convention
- Componentes: PascalCase (`UserHeaderCard.tsx`)
- Hooks: camelCase com prefixo `use` (`useDashboardData.tsx`)
- Types/Interfaces: PascalCase (`User`, `WorkoutCardProps`)

## Testes Sugeridos

### Unit Tests
- Cada componente deve ter teste de renderização básica
- Testes de interação para componentes com eventos
- Testes dos hooks customizados

### Integration Tests
- Teste do fluxo completo de navegação entre abas
- Teste de abertura/fechamento de modais
- Teste de atualização de dados (peso, refeições)

### Snapshot Tests
- Snapshots dos componentes de cards para evitar mudanças acidentais

## Estimativa
- **Fase 1-2**: 4-6 horas (types e cards)
- **Fase 3**: 6-8 horas (tabs)
- **Fase 4**: 4-6 horas (modais)
- **Fase 5**: 3-4 horas (hooks)
- **Fase 6**: 2-3 horas (refatoração final)
- **Testes**: 4-6 horas
- **Total**: 23-33 horas (~3-4 dias de desenvolvimento)

## Benefícios Esperados
- **Manutenibilidade**: Código mais fácil de entender e modificar
- **Reutilização**: Cards e componentes podem ser reutilizados
- **Testabilidade**: Cada componente pode ser testado isoladamente
- **Performance**: Possibilidade de otimizar re-renders específicos
- **Colaboração**: Diferentes desenvolvedores podem trabalhar em componentes diferentes
- **Debugging**: Mais fácil identificar problemas em componentes específicos

## Riscos e Mitigações
- **Risco**: Quebrar funcionalidade existente
  - **Mitigação**: Testes de regressão após cada fase
- **Risco**: Over-engineering com muitos componentes pequenos
  - **Mitigação**: Balancear granularidade com praticidade
- **Risco**: Estado compartilhado complexo
  - **Mitigação**: Usar Context API ou Redux apenas se necessário

## Próximos Passos Após Conclusão
1. Adicionar Storybook para documentar componentes
2. Implementar lazy loading para modais
3. Adicionar testes end-to-end com Playwright/Cypress
4. Considerar migração para React Server Components (se aplicável)

---

Arquivo criado automaticamente: `backlog/3-componentizar-dashboard.md`
