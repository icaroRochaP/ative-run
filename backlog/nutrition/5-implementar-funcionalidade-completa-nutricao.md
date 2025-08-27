# Tarefa: Implementar Funcionalidade Completa de Nutrição no Dashboard

## Objetivo
Tornar totalmente funcional o sistema de nutrição no dashboard, conectando a interface atual com o banco de dados Supabase, implementando as APIs necessárias e garantindo que todas as funcionalidades descritas no backlog estejam operacionais.

## ⚠️ IMPORTANTE: NÃO ALTERAR ESTRUTURA DO BANCO DE DADOS
Esta tarefa deve trabalhar com a estrutura de banco existente (tabela `meal_plans`). Não devem ser feitas alterações no schema do banco de dados, pois a estrutura atual já está funcionando adequadamente.

## Estrutura Atual do Banco (Referência)
```sql
meal_plans: {
  id: string
  user_id: string
  day_of_week: string
  meal_type: string
  calories: number
  protein: string | null
  carbs: string | null
  fat: string | null
  foods: string[] | null
  created_at: string
}
```

## Estado Atual da Aplicação

### ✅ Já Implementado
- **Interface da aba Nutrição**: `components/dashboard/tabs/NutricaoTab.tsx`
- **Card de metas de macros**: `components/dashboard/cards/MacroGoalsCard.tsx`
- **Card de refeição**: `components/dashboard/cards/MealCard.tsx`
- **Modal de detalhes da refeição**: `components/dashboard/modals/MealDetailModal.tsx`
- **Modal de plano semanal**: `components/dashboard/modals/WeeklyMealPlanModal.tsx`
- **Hook com dados mockados**: `hooks/dashboard/useMealPlan.tsx`
- **Tipos TypeScript**: `types/dashboard.ts`
- **Integração no DashboardLayout**: `components/dashboard/DashboardLayout.tsx`

### ❌ Não Implementado (PENDENTE)
- **APIs de backend**: Todas as rotas em `app/api/nutrition/` estão vazias
- **Hook de nutrição real**: `hooks/nutrition/useNutrition.tsx` está vazio
- **Tipos específicos de nutrição**: `types/nutrition.ts` está vazio
- **Funcionalidade de marcar refeição como consumida**
- **Integração real com banco de dados**
- **Cálculo dinâmico de macros baseado no usuário logado**

## Escopo da Implementação

### 1. Implementar APIs de Nutrição

#### 1.1 API para buscar plano do dia
**Arquivo**: `app/api/nutrition/day-meals/route.ts`
```typescript
// GET /api/nutrition/day-meals?userId={userId}&dayOfWeek={dayOfWeek}
// Retorna as refeições do usuário para um dia específico
// Busca na tabela meal_plans filtrando por user_id e day_of_week
```

#### 1.2 API para buscar plano semanal do usuário
**Arquivo**: `app/api/nutrition/user-plan/[userId]/route.ts`
```typescript
// GET /api/nutrition/user-plan/[userId]
// Retorna todo o plano semanal do usuário
// Busca na tabela meal_plans agrupando por day_of_week
```

#### 1.3 API para detalhes de refeição específica
**Arquivo**: `app/api/nutrition/recipe/[recipeId]/route.ts`
```typescript
// GET /api/nutrition/recipe/[recipeId]
// Retorna detalhes completos de uma refeição específica
// Busca na tabela meal_plans por id
```

#### 1.4 API para marcar refeição como consumida
**Arquivo**: `app/api/nutrition/consumption/route.ts`
```typescript
// POST /api/nutrition/consumption
// Body: { userId: string, mealId: string, consumedAt: string }
// Cria registro de consumo de refeição
// OBS: Como não temos tabela meal_consumption_logs, usar localStorage ou criar tabela simples
```

### 2. Implementar Hook de Nutrição Real

#### 2.1 Hook principal useNutrition
**Arquivo**: `hooks/nutrition/useNutrition.tsx`

**Funcionalidades:**
- Buscar plano de refeições do usuário logado
- Filtrar refeições por dia da semana
- Calcular macros totais diários
- Gerenciar estado de carregamento e erros
- Cache de dados para performance

**Métodos:**
```typescript
interface UseNutritionReturn {
  // Dados
  weeklyMealPlan: MealPlan | null
  todayMeals: Meal[]
  dailyNutrition: DailyNutrition
  consumedMeals: string[]
  
  // Estados
  loading: boolean
  error: string | null
  
  // Ações
  getMealsByDay: (dayOfWeek: string) => Meal[]
  markMealAsConsumed: (mealId: string) => Promise<void>
  refreshMealPlan: () => Promise<void>
}
```

### 3. Implementar Tipos de Nutrição

#### 3.1 Definir tipos específicos
**Arquivo**: `types/nutrition.ts`

```typescript
interface NutritionMeal {
  id: string
  user_id: string
  day_of_week: string
  meal_type: string
  calories: number
  protein: string
  carbs: string
  fat: string
  foods: string[]
  created_at: string
}

interface DailyNutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface MealConsumption {
  meal_id: string
  consumed_at: string
  user_id: string
}
```

### 4. Atualizar Hook useMealPlan

#### 4.1 Migrar para dados reais
**Arquivo**: `hooks/dashboard/useMealPlan.tsx`

- Substituir dados mockados por chamadas ao hook `useNutrition`
- Manter compatibilidade com interface atual
- Adicionar tratamento de estados de carregamento
- Implementar cache inteligente

### 5. Implementar Funcionalidade de Consumo

#### 5.1 Marcar refeição como consumida
- Atualizar `MealDetailModal` para incluir funcionalidade real
- Implementar feedback visual no `MealCard`
- Persistir estado no localStorage (como fallback) ou banco
- Sincronizar estado entre componentes

#### 5.2 Indicadores visuais
- Modificar `MealCard` para mostrar status de consumo
- Adicionar badges ou ícones de "consumido"
- Implementar animações de feedback

### 6. Melhorias de UX

#### 6.1 Estados de carregamento
- Skeletons para cards de refeição
- Loading spinners em modais
- Feedback de ações (toast notifications)

#### 6.2 Tratamento de erros
- Mensagens amigáveis para erro de conexão
- Fallback para dados offline
- Retry automático em falhas temporárias

#### 6.3 Performance
- Lazy loading de imagens
- Cache de dados de nutrição
- Paginação se necessário

## Fluxo de Implementação

### Fase 1: Backend (APIs)
1. Implementar API de plano diário (`day-meals/route.ts`)
2. Implementar API de plano semanal (`user-plan/[userId]/route.ts`)
3. Implementar API de detalhes de refeição (`recipe/[recipeId]/route.ts`)
4. Implementar API de consumo (`consumption/route.ts`)

### Fase 2: Hook de Dados
1. Criar tipos em `types/nutrition.ts`
2. Implementar `useNutrition` hook
3. Testar integração com APIs

### Fase 3: Integração com UI
1. Atualizar `useMealPlan` para usar dados reais
2. Implementar funcionalidade de marcar como consumido
3. Adicionar estados de carregamento
4. Implementar tratamento de erros

### Fase 4: Melhorias
1. Otimizações de performance
2. Melhorias de UX
3. Testes de integração
4. Documentação

## Critérios de Aceitação

### Funcionalidades Essenciais
- [ ] Usuário consegue ver suas refeições do dia atual
- [ ] Usuário consegue ver plano semanal completo
- [ ] Usuário consegue ver detalhes de cada refeição
- [ ] Usuário consegue marcar refeição como consumida
- [ ] Dados são carregados do banco de dados real
- [ ] Interface responde adequadamente a estados de carregamento
- [ ] Erros são tratados graciosamente

### Performance
- [ ] Carregamento inicial < 2 segundos
- [ ] Navegação entre dias < 500ms
- [ ] Cache implementado corretamente

### UX
- [ ] Feedback visual imediato para ações
- [ ] Estados de carregamento informativos
- [ ] Mensagens de erro claras
- [ ] Interface responsiva em diferentes dispositivos

## Notas Técnicas

### Integração com Supabase
- Usar cliente Supabase existente: `lib/supabase.ts`
- Aplicar Row Level Security (RLS) se necessário
- Utilizar tipos TypeScript gerados: `lib/database.types.ts`

### Estrutura de Dados
- Trabalhar com a tabela `meal_plans` existente
- Mapear campos corretamente:
  - `day_of_week` → dia da semana
  - `meal_type` → tipo da refeição (Breakfast, Lunch, Dinner)
  - `foods` → array de ingredientes

### Compatibilidade
- Manter interface existente dos componentes
- Não quebrar funcionalidades já implementadas
- Garantir backward compatibility

### Testes
- Testar com usuário real logado
- Validar fluxo completo de visualização
- Testar cenários de erro e offline
- Verificar performance com dados reais

## Considerações de Segurança
- Validar `userId` em todas as APIs
- Implementar rate limiting se necessário
- Sanitizar dados de entrada
- Aplicar RLS no Supabase para proteção adicional

## Resultado Esperado
Ao final desta implementação, a aba de Nutrição do dashboard estará completamente funcional, conectada ao banco de dados, e proporcionará uma experiência de usuário fluida e intuitiva para visualização e acompanhamento do plano nutricional.
