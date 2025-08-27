# [BMAD-NUTRITION-001] Sistema de Nutrição Funcional - Aleen.ai

## Informações Gerais
- **ID**: BMAD-NUTRITION-001
- **Título**: Sistema de Nutrição Funcional - Visualização e Interação Completa  
- **Tipo**: Epic Feature
- **Prioridade**: Alta
- **Estimativa**: 16-24 horas
- **Squad**: Frontend + Backend
- **Tags**: #nutrition #meal-planning #database-integration #ux

## Contexto e Necessidade

O usuário identificou que a aba de nutrição atual precisa ser completamente funcional, incorporando um sistema robusto de visualização de planos alimentares por dia da semana, com navegação intuitiva e apresentação clara de receitas e ingredientes.

### Análise do Banco de Dados Atual

**Estrutura Identificada:**
- **foods**: 45 alimentos com macros por 100g (calorias, proteínas, carboidratos, gorduras)
- **recipes**: 21 receitas definidas (ex: "Panqueca de Aveia", "Ovos Mexidos com Abacate")
- **recipe_ingredients**: 75 relacionamentos alimento-receita com quantidades específicas
- **user_meal_plans**: Planos alimentares atribuídos aos usuários
- **plan_meals**: 28 refeições organizadas por dia da semana e tipo de refeição
- **meal_consumption_logs**: Registro de consumo das refeições

**Organização dos Dados:**
- **Dias da Semana**: segunda-feira, terça-feira, quarta-feira, quinta-feira, sexta-feira, sábado, domingo
- **Tipos de Refeição**: Café da Manhã, Lanche da Tarde, Almoço, Jantar
- **Estrutura de Receitas**: Cada receita contém múltiplos alimentos com quantidades específicas (ex: Panqueca de Aveia = 60g Ovos + 40g Aveia + 80g Banana)

## User Story

**Como** usuário do app Aleen.ai
**Eu quero** visualizar e interagir com meu plano nutricional de forma organizada por dias da semana
**Para que** eu possa acompanhar minhas refeições, ver detalhes dos ingredientes e marcar o que consumi

### Critérios de Aceitação

#### 1. Seletor de Dias da Semana
- [ ] **AC-001**: Implementar seletor horizontal com dias abreviados (Seg, Ter, Qua, Qui, Sex, Sáb, Dom)
- [ ] **AC-002**: Aplicar estilo visual consistente com design system Aleen (aleen-primary #009929, rounded-3xl)
- [ ] **AC-003**: Destacar dia atual automaticamente
- [ ] **AC-004**: Permitir navegação touch/click entre dias
- [ ] **AC-005**: Filtrar todo conteúdo abaixo baseado no dia selecionado

#### 2. Visualização de Refeições
- [ ] **AC-006**: Exibir refeições organizadas por tipo (Café da Manhã, Lanche da Tarde, Almoço, Jantar)
- [ ] **AC-007**: Mostrar cards de receitas com nome e badge visual
- [ ] **AC-008**: Exibir informações nutricionais resumidas por refeição
- [ ] **AC-009**: Implementar indicadores visuais de consumo (marcado/não marcado)
- [ ] **AC-010**: Permitir marcar refeição como consumida

#### 3. Detalhamento de Receitas
- [ ] **AC-011**: Abrir modal ao clicar em receita com detalhes completos
- [ ] **AC-012**: Listar todos os ingredientes com quantidades específicas
- [ ] **AC-013**: Exibir unidades de medida práticas (1 unidade, 3 colheres de sopa, 1/2 unidade)
- [ ] **AC-014**: Mostrar macronutrientes totais da receita
- [ ] **AC-015**: Calcular valores nutricionais baseados nas quantidades dos ingredientes

#### 4. Navegação e UX
- [ ] **AC-016**: Implementar hierarquia de modais correta (receita sobre nutrição)
- [ ] **AC-017**: Manter consistência visual com outros modais do app
- [ ] **AC-018**: Garantir responsividade em todos os dispositivos
- [ ] **AC-019**: Implementar loading states durante carregamento de dados
- [ ] **AC-020**: Adicionar tratamento de erros e estados vazios

#### 5. Integração com Banco
- [ ] **AC-021**: Buscar dados do plano do usuário via user_meal_plans
- [ ] **AC-022**: Filtrar plan_meals por dia da semana selecionado
- [ ] **AC-023**: Carregar receitas completas com recipe_ingredients
- [ ] **AC-024**: Calcular macros em tempo real baseado nos dados do foods
- [ ] **AC-025**: Registrar consumo em meal_consumption_logs

## Especificações Técnicas

### Componentes a Desenvolver

#### 1. NutritionTab.tsx (Componente Principal)
```typescript
interface NutritionTabProps {
  userId: string;
  userMealPlan: UserMealPlan;
}

interface DaySelector {
  selectedDay: string;
  onDayChange: (day: string) => void;
  currentDay: string;
}
```

#### 2. DaySelector.tsx
```typescript
const DAYS = [
  { key: 'segunda-feira', label: 'Seg' },
  { key: 'terça-feira', label: 'Ter' },
  { key: 'quarta-feira', label: 'Qua' },
  { key: 'quinta-feira', label: 'Qui' },
  { key: 'sexta-feira', label: 'Sex' },
  { key: 'sábado', label: 'Sáb' },
  { key: 'domingo', label: 'Dom' }
];
```

#### 3. MealCard.tsx
```typescript
interface MealCardProps {
  meal: PlanMeal;
  recipe: Recipe;
  isConsumed: boolean;
  onMarkConsumed: (mealId: string) => void;
  onViewDetails: (recipeId: string) => void;
}
```

#### 4. RecipeModal.tsx
```typescript
interface RecipeModalProps {
  recipe: Recipe;
  ingredients: RecipeIngredientWithFood[];
  isOpen: boolean;
  onClose: () => void;
  nutritionInfo: NutritionSummary;
}
```

### Estrutura de Dados

```typescript
interface UserMealPlan {
  id: string;
  user_id: string;
  plan_meals: PlanMeal[];
}

interface PlanMeal {
  id: string;
  day_of_week: string;
  meal_type: string;
  recipe: Recipe;
  is_consumed?: boolean;
}

interface Recipe {
  id: string;
  name: string;
  description?: string;
  recipe_ingredients: RecipeIngredient[];
}

interface RecipeIngredient {
  food: Food;
  quantity_in_grams: number;
  display_unit: string;
}

interface Food {
  id: string;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
}

interface NutritionSummary {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
}
```

### APIs Necessárias

#### 1. `/api/nutrition/user-plan/[userId]`
- **GET**: Retorna plano alimentar completo do usuário
- **Response**: UserMealPlan com todas as refeições e receitas

#### 2. `/api/nutrition/day-meals`
- **GET**: Filtra refeições por dia da semana
- **Query**: `userId`, `dayOfWeek`
- **Response**: Array de PlanMeal

#### 3. `/api/nutrition/recipe/[recipeId]`
- **GET**: Detalhes completos da receita com ingredientes
- **Response**: Recipe com RecipeIngredient[] e NutritionSummary

#### 4. `/api/nutrition/consumption`
- **POST**: Marca refeição como consumida
- **Body**: `{ userId, planMealId, consumedAt }`
- **Response**: MealConsumptionLog

### Cálculos Nutricionais

```typescript
function calculateRecipeNutrition(ingredients: RecipeIngredient[]): NutritionSummary {
  return ingredients.reduce((total, ingredient) => {
    const ratio = ingredient.quantity_in_grams / 100;
    return {
      total_calories: total.total_calories + (ingredient.food.calories_per_100g * ratio),
      total_protein: total.total_protein + (ingredient.food.protein_per_100g * ratio),
      total_carbs: total.total_carbs + (ingredient.food.carbs_per_100g * ratio),
      total_fat: total.total_fat + (ingredient.food.fat_per_100g * ratio)
    };
  }, { total_calories: 0, total_protein: 0, total_carbs: 0, total_fat: 0 });
}
```

## Design System e Estilos

### Cores e Temas
- **Primária**: aleen-primary (#009929)
- **Secundária**: aleen-secondary (#27a3df)
- **Bordas**: rounded-3xl
- **Gradientes**: Manter consistência com outros componentes

### Layout Responsivo
- **Mobile**: Stack vertical, seletor de dias horizontal
- **Tablet**: 2 colunas para refeições
- **Desktop**: Layout otimizado com 3-4 colunas

### Estados Visuais
- **Loading**: Skeleton components
- **Empty State**: Mensagem motivacional com CTA
- **Error State**: Retry action com feedback claro
- **Success**: Animações sutis para ações de consumo

## Plano de Implementação

### Fase 1: Estrutura Base (6-8 horas)
1. **Configuração do componente NutritionTab**
   - Setup da estrutura base
   - Integração com layout existente
   - Estados de loading e erro

2. **Implementação do DaySelector**
   - Componente de seleção de dias
   - Lógica de filtro por dia
   - Estilização consistente

3. **APIs de dados**
   - Endpoint para buscar plano do usuário
   - Filtros por dia da semana
   - Estrutura de resposta padronizada

### Fase 2: Visualização de Refeições (4-6 horas)
1. **MealCard component**
   - Layout de cards de refeições
   - Badges e indicadores visuais
   - Ações de consumo

2. **Organização por tipo de refeição**
   - Agrupamento lógico
   - Ordem cronológica
   - Headers de seção

### Fase 3: Detalhamento de Receitas (4-6 horas)
1. **RecipeModal component**
   - Modal com detalhes da receita
   - Lista de ingredientes
   - Cálculos nutricionais

2. **Integração com dados**
   - Carregamento de ingredientes
   - Cálculo de macros em tempo real
   - Cache de dados para performance

### Fase 4: Funcionalidades Avançadas (2-4 horas)
1. **Sistema de consumo**
   - Marcar/desmarcar refeições
   - Persistência no banco
   - Sincronização em tempo real

2. **Otimizações e polimento**
   - Performance improvements
   - Animações e transições
   - Testes de responsividade

## Critérios de Validação

### Funcionalidade
- [ ] Seleção de dias funciona corretamente
- [ ] Filtros aplicam-se a todo conteúdo
- [ ] Modais abrem e fecham adequadamente
- [ ] Cálculos nutricionais são precisos
- [ ] Sistema de consumo persiste dados

### UX/UI
- [ ] Interface responsiva em todos dispositivos
- [ ] Consistência visual com design system
- [ ] Loading states apropriados
- [ ] Hierarquia de informação clara

### Performance
- [ ] Carregamento inicial < 2s
- [ ] Navegação entre dias fluida
- [ ] Cache de dados implementado
- [ ] Otimização de queries do banco

### Integração
- [ ] APIs funcionam corretamente
- [ ] Dados do Supabase carregam adequadamente
- [ ] Tratamento de erros implementado
- [ ] Logs de consumo são registrados

## Dependências e Considerações

### Dependências Técnicas
- Supabase client configurado
- Componentes UI existentes (Modal, Card, Button)
- Sistema de autenticação do usuário
- Design tokens do Aleen.ai

### Considerações de Performance
- Implementar lazy loading para receitas
- Cache de dados de alimentos (raramente mudam)
- Otimizar queries com joins adequados
- Considerar paginação para usuários com muitos planos

### Considerações de UX
- Manter estado do dia selecionado na sessão
- Feedback visual imediato para ações
- Prevenção de ações duplas
- Acessibilidade para navegação por teclado

## Observações Finais

Esta implementação transformará a aba de nutrição em um sistema completo e funcional, aproveitando toda a robusta estrutura de dados já existente no banco. O foco está na experiência do usuário, performance e integração consistente com o design system Aleen.ai.

A arquitetura proposta é escalável e permite futuras expansões como personalização de planos, histórico de consumo detalhado e relatórios nutricionais avançados.
