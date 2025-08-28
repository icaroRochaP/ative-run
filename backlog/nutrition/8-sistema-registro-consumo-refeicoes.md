# [NUTRITION-CONSUMPTION-001] Sistema de Registro de Consumo de Refeições

## 📋 Informações Gerais
- **ID**: NUTRITION-CONSUMPTION-001  
- **Título**: Sistema de Registro e Toggle de Consumo de Refeições
- **Tipo**: Feature Story
- **Prioridade**: Alta
- **Estimativa**: 8-12 horas
- **Squad**: Full-Stack (Backend + Frontend + UX)
- **Tags**: #nutrition #meal-tracking #ux #database

---

## 🎯 User Story Principal

**Como** usuário do Aleen.ai  
**Eu quero** marcar minhas refeições como concluídas e poder desmarcá-las  
**Para que** eu possa acompanhar meu progresso nutricional diário e ter controle sobre meu registro de consumo

---

## 🏗️ Análise Técnica do Arquiteto (Winston)

### **Estrutura de Dados Identificada**

**Tabela `meal_consumption_logs`:**
```sql
- id: uuid (PK, auto-generated)
- user_id: uuid (FK para auth.users)  
- recipe_id: uuid (FK para recipes)
- consumed_at: date (data do consumo)
```

**Dados Existentes:**
- 3 registros de consumo no banco
- Usuário já possui logs de "Panqueca de Aveia", "Salada de Quinoa com Salmão" e "Filé de Tilápia"
- Sistema atual permite apenas inserção, sem funcionalidade de toggle

### **Arquitetura Proposta**

**1. API Endpoints:**
```typescript
// POST /api/nutrition/consumption - Marcar como consumida
// DELETE /api/nutrition/consumption - Desmarcar consumo
// GET /api/nutrition/consumption/status - Verificar status de consumo
```

**2. Estado de Consumo:**
```typescript
interface MealConsumptionStatus {
  isConsumed: boolean;
  consumedAt?: Date;
  logId?: string;
}
```

---

## 📝 Análise do Product Owner (Sarah)

### **Critérios de Aceitação Detalhados**

#### **AC1: Funcionalidade de Toggle**
- [ ] **AC1.1**: Usuário pode marcar refeição como consumida clicando no card/botão
- [ ] **AC1.2**: Usuário pode desmarcar refeição consumida clicando novamente
- [ ] **AC1.3**: Estado de consumo persiste no banco via `meal_consumption_logs`
- [ ] **AC1.4**: Toggle funciona imediatamente sem reload da página
- [ ] **AC1.5**: Prevenção de ações duplas (loading state durante requisição)

#### **AC2: Integração com Banco de Dados**
- [ ] **AC2.1**: Inserir registro em `meal_consumption_logs` ao marcar como consumida
- [ ] **AC2.2**: Remover registro de `meal_consumption_logs` ao desmarcar
- [ ] **AC2.3**: Buscar status de consumo baseado em user_id, recipe_id e data atual
- [ ] **AC2.4**: Associar consumo à data atual (`consumed_at = CURRENT_DATE`)
- [ ] **AC2.5**: Validar que apenas o proprietário pode alterar seus próprios logs

#### **AC3: Estados Visuais e UX**
- [ ] **AC3.1**: Indicador visual claro de refeição consumida vs não consumida
- [ ] **AC3.2**: Feedback imediato ao clicar (loading, sucesso, erro)
- [ ] **AC3.3**: Animação suave de transição entre estados
- [ ] **AC3.4**: Acessibilidade completa (screen readers, navegação por teclado)
- [ ] **AC3.5**: Estados responsivos em todos dispositivos

#### **AC4: Experiência do Usuário**
- [ ] **AC4.1**: Carregamento inicial mostra status correto de todas as refeições
- [ ] **AC4.2**: Sincronização em tempo real (se usuário abre em múltiplas abas)
- [ ] **AC4.3**: Tratamento de erro robusto com retry automático
- [ ] **AC4.4**: Feedback háptico em dispositivos móveis (se disponível)
- [ ] **AC4.5**: Persistência de estado durante navegação entre dias

---

## 🎨 Especificações de UX (Sally - UX Expert)

### **Design Visual dos Estados**

#### **Estado Não Consumido (Default):**
```scss
.meal-card {
  background: white;
  border: 2px solid #f1f5f9;
  opacity: 1;
  
  .consumption-button {
    background: transparent;
    border: 2px solid #e2e8f0;
    color: #64748b;
    icon: circle-outline;
  }
}
```

#### **Estado Consumido:**
```scss
.meal-card.consumed {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #059669;
  position: relative;
  
  &::after {
    content: "✓";
    position: absolute;
    top: 12px;
    right: 12px;
    background: #059669;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
  }
  
  .consumption-button {
    background: #059669;
    border: 2px solid #059669;
    color: white;
    icon: check-circle;
  }
}
```

#### **Estado Loading:**
```scss
.meal-card.loading {
  pointer-events: none;
  
  .consumption-button {
    background: #f1f5f9;
    color: #94a3b8;
    
    .icon {
      animation: spin 1s linear infinite;
    }
  }
}
```

### **Animações e Micro-interações**

#### **Transição de Estado:**
```css
.meal-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.consumption-button {
  transition: all 0.2s ease-in-out;
  transform: scale(1);
  
  &:active {
    transform: scale(0.95);
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
  }
}
```

#### **Feedback Visual:**
```typescript
// Sucesso: verde suave com bounce
// Erro: vermelho com shake
// Loading: pulse cinza com spinner
```

### **Componente de Botão de Consumo**

```typescript
interface ConsumptionButtonProps {
  isConsumed: boolean;
  isLoading: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

// Estados visuais:
// - Não consumido: Círculo vazio + "Marcar como Consumido"
// - Consumido: Check verde + "Consumido"
// - Loading: Spinner + "Processando..."
// - Error: Círculo vermelho + "Tentar novamente"
```

---

## 🛠️ Especificações Técnicas

### **1. API Implementation**

#### **POST /api/nutrition/consumption**
```typescript
interface ConsumeRequest {
  userId: string;
  recipeId: string;
  consumedAt?: string; // Default: today
}

interface ConsumeResponse {
  success: boolean;
  logId: string;
  consumedAt: string;
}
```

#### **DELETE /api/nutrition/consumption**
```typescript
interface UnconsumeRequest {
  userId: string;
  recipeId: string;
  consumedAt?: string; // Default: today
}

interface UnconsumeResponse {
  success: boolean;
  removed: boolean;
}
```

#### **GET /api/nutrition/consumption/status**
```typescript
interface StatusRequest {
  userId: string;
  date?: string; // Default: today
}

interface StatusResponse {
  consumedRecipes: {
    recipeId: string;
    logId: string;
    consumedAt: string;
  }[];
}
```

### **2. Frontend Hook Implementation**

```typescript
// hooks/nutrition/useMealConsumption.tsx
interface UseMealConsumptionProps {
  userId: string;
  selectedDate: Date;
}

interface UseMealConsumptionReturn {
  consumedMeals: Set<string>; // Set de recipe IDs
  isLoading: boolean;
  error: string | null;
  toggleConsumption: (recipeId: string) => Promise<void>;
  isConsumptionLoading: (recipeId: string) => boolean;
  refreshStatus: () => Promise<void>;
}

export function useMealConsumption({
  userId,
  selectedDate
}: UseMealConsumptionProps): UseMealConsumptionReturn {
  // Implementation com:
  // - Estado local para performance
  // - Sincronização com servidor
  // - Retry logic para falhas
  // - Optimistic updates
}
```

### **3. Component Updates**

#### **MealCard.tsx**
```typescript
interface MealCardProps {
  meal: Meal;
  isConsumed: boolean;
  isLoading: boolean;
  onConsumptionToggle: () => void;
  onClick: () => void; // Para abrir modal de detalhes
}

// Implementar:
// - Badge visual de consumo
// - Botão de toggle integrado
// - Estados de loading
// - Acessibilidade completa
```

#### **ConsumptionButton.tsx** (Novo componente)
```typescript
interface ConsumptionButtonProps {
  isConsumed: boolean;
  isLoading: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'icon' | 'badge';
}

// Variantes:
// - button: Botão completo com texto
// - icon: Apenas ícone clicável  
// - badge: Badge pequeno no canto
```

### **4. Database Queries**

```sql
-- Marcar como consumido
INSERT INTO meal_consumption_logs (user_id, recipe_id, consumed_at)
VALUES ($1, $2, CURRENT_DATE)
ON CONFLICT (user_id, recipe_id, consumed_at) DO NOTHING
RETURNING id;

-- Desmarcar consumo  
DELETE FROM meal_consumption_logs 
WHERE user_id = $1 
  AND recipe_id = $2 
  AND consumed_at = $3
RETURNING id;

-- Buscar status de consumo por dia
SELECT recipe_id, id as log_id, consumed_at
FROM meal_consumption_logs
WHERE user_id = $1 
  AND consumed_at = $2;

-- Buscar refeições do dia com status de consumo
SELECT 
  pm.id as plan_meal_id,
  r.id as recipe_id,
  r.name as recipe_name,
  pm.meal_type,
  CASE WHEN mcl.id IS NOT NULL THEN true ELSE false END as is_consumed,
  mcl.id as consumption_log_id
FROM plan_meals pm
JOIN recipes r ON pm.recipe_id = r.id
JOIN user_meal_plans ump ON pm.user_meal_plan_id = ump.id
LEFT JOIN meal_consumption_logs mcl ON (
  mcl.recipe_id = r.id 
  AND mcl.user_id = ump.user_id 
  AND mcl.consumed_at = $2
)
WHERE ump.user_id = $1 
  AND pm.day_of_week = $3
  AND ump.is_active = true
ORDER BY pm.display_order;
```

---

## 📋 Plano de Implementação

### **Fase 1: Backend Foundation (3-4h)**
1. **Implementar APIs de consumo**
   - POST endpoint para marcar consumo
   - DELETE endpoint para desmarcar
   - GET endpoint para status
   - Validações e error handling

2. **Otimizar queries existentes**
   - Join com meal_consumption_logs
   - Query para buscar refeições com status
   - Índices de performance se necessário

### **Fase 2: Frontend Hook e Estado (2-3h)**
1. **Hook useMealConsumption**
   - Estado de consumo por refeição
   - Funções de toggle
   - Loading states individuais
   - Error handling e retry

2. **Integração com hook existente**
   - Atualizar useMealPlan ou useNutrition
   - Sincronização de estados
   - Cache management

### **Fase 3: Componentes UI (3-4h)**
1. **ConsumptionButton component**
   - Estados visuais completos
   - Animações e transições
   - Acessibilidade

2. **Atualizar MealCard**
   - Integrar botão de consumo
   - Estados visuais do card
   - Indicadores de consumo

3. **Feedback e micro-interações**
   - Toast notifications
   - Loading indicators
   - Error states

### **Fase 4: Testes e Polimento (1-2h)**
1. **Testes com Playwright** (conforme solicitado)
   - Toggle de consumo funcionando
   - Estados visuais corretos
   - Persistência de dados
   - Error scenarios

2. **Testes manuais**
   - Diferentes dispositivos
   - Performance
   - Edge cases

---

## 🧪 Cenários de Teste

### **Testes Funcionais**
- [ ] Marcar refeição como consumida registra no banco
- [ ] Desmarcar refeição remove do banco
- [ ] Status de consumo carrega corretamente ao abrir app
- [ ] Toggle funciona para múltiplas refeições
- [ ] Estados sincronizam entre diferentes dias

### **Testes de UX**
- [ ] Feedback visual imediato ao clicar
- [ ] Estados de loading aparecem durante requisições
- [ ] Animações suaves entre estados
- [ ] Acessibilidade completa funcionando
- [ ] Comportamento responsivo em mobile/desktop

### **Testes de Performance**
- [ ] Toggle responde em < 300ms (optimistic update)
- [ ] Carregamento inicial de status < 1s
- [ ] Não há flickering visual durante mudanças
- [ ] Estados locais sincronizam corretamente

### **Testes de Edge Cases**
- [ ] Múltiplos cliques rápidos não criam logs duplicados
- [ ] Falha de rede não deixa estado inconsistente
- [ ] Retry automático funciona após falha
- [ ] Sincronização entre múltiplas abas

---

## 💾 Configurações de Supabase

### **Row Level Security (RLS)**
```sql
-- Policy para meal_consumption_logs
CREATE POLICY "Users can manage their own consumption logs"
ON meal_consumption_logs
FOR ALL
USING (auth.uid() = user_id);

-- Index para performance
CREATE INDEX idx_meal_consumption_user_date 
ON meal_consumption_logs(user_id, consumed_at);

CREATE INDEX idx_meal_consumption_recipe_date
ON meal_consumption_logs(recipe_id, consumed_at);
```

---

## 📊 Métricas de Sucesso

### **Funcionalidade**
- ✅ 100% das ações de toggle persistem corretamente
- ✅ 0% de logs duplicados ou inconsistentes
- ✅ Status de consumo carrega em < 1 segundo
- ✅ 99.9% de disponibilidade das APIs

### **UX/Performance**  
- ✅ Feedback visual em < 100ms (optimistic update)
- ✅ Tempo de resposta da API < 300ms
- ✅ 0 flickering ou bugs visuais
- ✅ Score de acessibilidade > 95%

### **Negócio**
- ✅ Aumento no engajamento diário com nutrição
- ✅ Dados precisos para análise de aderência
- ✅ Fundação para futuras features de gamificação

---

## 🚀 Entrega e Deploy

### **Critérios de Done**
- [ ] APIs implementadas e testadas
- [ ] Frontend funcionando completamente
- [ ] Testes Playwright passando
- [ ] Performance validada
- [ ] Acessibilidade verificada
- [ ] Code review aprovado
- [ ] Deploy em staging testado

### **Dependências**
- Supabase client configurado
- Sistema de autenticação funcionando
- Componentes UI base existentes
- Hook useNutrition ou useMealPlan existente

---

## 📝 Notas para o Desenvolvedor (James)

### **🔧 Ferramentas Disponíveis**
- **MCP Supabase**: Para testar queries e estrutura de dados
- **MCP Playwright**: Para testes E2E automatizados
- **Design System Aleen**: Componentes e cores já definidos

### **🎯 Foco Principal**
1. **UX Impecável**: Estados visuais claros e feedback imediato
2. **Performance**: Optimistic updates para responsividade
3. **Robustez**: Error handling e retry logic completos
4. **Dados Confiáveis**: Zero inconsistências no banco

### **💡 Dicas de Implementação**
- Use optimistic updates para performance percebida
- Implemente debounce para evitar cliques duplos
- Cache local para status de consumo
- Fallback graceful para falhas de rede

### **🔍 Pontos de Atenção**
- Validar user_id em todas as operações
- Usar transações para operações críticas
- Implementar retry com backoff exponencial
- Logs detalhados para debugging

---

**🎉 Resultado Esperado:**
Sistema robusto e intuitivo que permite aos usuários acompanhar seu progresso nutricional de forma engajante, com feedback visual claro e dados confiáveis para análises futuras.
