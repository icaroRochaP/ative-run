# Tarefa 4 — Padronização Visual e Marca do Onboarding Aleen.ai

## Resumo
O fluxo de onboarding atualmente não segue o padrão visual estabelecido no dashboard, utilizando o nome incorreto "FitJourney" ao invés de "Aleen.ai" e cores/design inconsistentes. Esta tarefa visa alinhar completamente o onboarding com a identidade visual do sistema, aplicando as cores da marca, elementos arredondados, gradientes e a logo oficial.

## Contexto e Justificativa
- **Dashboard atual**: Segue padrão visual consistente com cores Aleen.ai, elementos arredondados e gradientes
- **Onboarding atual**: Usa cores pretas/cinzas genéricas, nome "FitJourney" e visual inconsistente
- **Impacto na marca**: Experiência desconectada prejudica a percepção da marca e profissionalismo
- **UX**: Usuários esperam consistência visual entre todas as telas da aplicação

## Análise Visual Detalhada

### Padrões do Dashboard (Corretos)
- **Cores primárias**: `aleen-primary: #009929`, `aleen-secondary: #27a3df`, `aleen-light: #fffff0`, `aleen-purple: #8812f1`
- **Gradientes**: `from-aleen-primary to-aleen-secondary`
- **Border radius**: `rounded-2xl` (24px), `rounded-3xl` (32px)
- **Sombras**: `shadow-2xl`, `shadow-lg`
- **Tipografia**: Plus Jakarta Sans
- **Logo**: `/placeholder-logo.png` (deve ser `/aleen-logo.png`)
- **Background**: `bg-gradient-to-br from-aleen-light to-white`

### Problemas no Onboarding (A corrigir)
- **Nome incorreto**: "FitJourney" → deve ser "Aleen.ai"
- **Cores genéricas**: `bg-black`, `border-gray-200` → deve usar paleta Aleen
- **Botões simples**: `bg-black` → deve usar gradientes da marca
- **Design quadrado**: `rounded-lg` → deve usar `rounded-2xl/3xl`
- **Logo placeholder**: inconsistente com dashboard

## Arquivos a Serem Modificados

### 1. Onboarding Principal
- `app/onboarding/page.tsx` - Página principal do onboarding
- `app/onboarding/[userId]/page.tsx` - Página com userId (se diferente)

### 2. Componentes de Autenticação (se necessário)
- `components/auth/sign-in-form.tsx` - Formulário de login
- `components/auth/forgot-password-form.tsx` - Esqueci senha
- `components/auth/resend-confirmation-form.tsx` - Reenvio confirmação
- `components/auth/update-password-form.tsx` - Atualizar senha
- `components/auth/onboarding-form.tsx` - Form específico

### 3. Assets e Configurações
- Verificar uso correto da logo `/aleen-logo.png`
- Atualizar favicon se necessário

## Mudanças Específicas Necessárias

### A. Correção de Nome e Marca
```typescript
// ANTES:
"Welcome to FitJourney"
"FitJourney"

// DEPOIS:
"Welcome to Aleen.ai"
"Aleen.ai"
```

### B. Atualização de Cores e Gradientes
```typescript
// ANTES:
className="bg-black hover:bg-gray-800"
className="border-2 border-gray-200"
className="bg-gray-50"

// DEPOIS:
className="bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary"
className="border-2 border-aleen-light focus:border-aleen-primary"
className="bg-gradient-to-br from-aleen-light to-white"
```

### C. Border Radius Consistente
```typescript
// ANTES:
className="rounded-lg"
className="rounded-md"

// DEPOIS:
className="rounded-2xl"
className="rounded-3xl"
```

### D. Sombras e Efeitos
```typescript
// ANTES:
className="shadow-lg"

// DEPOIS:
className="shadow-2xl"
className="transition-all duration-300 hover:shadow-xl hover:scale-105"
```

### E. Logo e Elementos Visuais
```typescript
// ANTES:
src="/placeholder-logo.png"

// DEPOIS:
src="/aleen-logo.png"
alt="Aleen.ai Logo"
```

## Mapeamento de Componentes por Arquivo

### `app/onboarding/page.tsx`
1. **Loading Screen** (linha ~906):
   - Background: `bg-gray-50` → `bg-gradient-to-br from-aleen-light to-white`
   - Spinner: cores aleen

2. **Welcome Screen** (linha ~969):
   - Título: "Welcome to FitJourney" → "Welcome to Aleen.ai"
   - Background: `bg-black` → `bg-gradient-to-br from-aleen-light to-white`
   - Card: adicionar gradiente no header
   - Botões: aplicar gradientes aleen

3. **Question Cards** (linha ~1000+):
   - Background principal: `bg-gray-50` → `bg-gradient-to-br from-aleen-light to-white`
   - Cards: border e sombras aleen
   - Botões: gradientes aleen
   - Progress bar: cores aleen

4. **Completion Screen** (linha ~1050+):
   - Background e cores seguindo padrão

### Elementos Específicos a Atualizar

#### 1. Header/Welcome Card
```typescript
<Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
  <CardHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white p-8">
    <div className="text-center">
      <img src="/aleen-logo.png" alt="Aleen.ai Logo" className="h-12 mx-auto mb-4" />
      <CardTitle className="text-2xl font-bold text-white">Welcome to Aleen.ai</CardTitle>
      <CardDescription className="text-aleen-light">Let's create your personalized fitness plan together</CardDescription>
    </div>
  </CardHeader>
</Card>
```

#### 2. Botões Principais
```typescript
<Button className="w-full bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-bold py-4 text-lg rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 transform">
```

#### 3. Progress Bar
```typescript
<div className="bg-gradient-to-r from-aleen-primary to-aleen-secondary h-2 rounded-full transition-all duration-300 ease-out" />
```

#### 4. Input Fields
```typescript
<Input className="border-2 border-aleen-light focus:border-aleen-primary rounded-2xl text-gray-800 placeholder:text-gray-400 py-3 transition-all duration-300 focus:shadow-lg" />
```

## Critérios de Aceite

### Visual e Marca
- [ ] Nome "FitJourney" completamente substituído por "Aleen.ai" em todas as ocorrências
- [ ] Logo oficial `/aleen-logo.png` usado em vez de placeholder
- [ ] Cores da paleta Aleen aplicadas em todos os elementos
- [ ] Gradientes `from-aleen-primary to-aleen-secondary` nos elementos principais
- [ ] Background `bg-gradient-to-br from-aleen-light to-white` aplicado
- [ ] Border radius `rounded-2xl` e `rounded-3xl` aplicados consistentemente
- [ ] Sombras `shadow-2xl` aplicadas nos cards principais

### Funcionalidade
- [ ] Todos os fluxos de onboarding funcionando sem regressões
- [ ] Transições e animações suaves mantidas
- [ ] Responsividade preservada
- [ ] Acessibilidade mantida (alt texts, aria-labels)

### Consistência
- [ ] Visual idêntico ao padrão do dashboard
- [ ] Cores, fontes e espaçamentos consistentes
- [ ] Hover effects e states seguindo padrão estabelecido
- [ ] Loading states com cores da marca

## Arquivos de Referência
- `components/dashboard/DashboardLayout.tsx` - Padrão visual de referência
- `components/dashboard/cards/UserHeaderCard.tsx` - Exemplo de gradientes
- `components/auth/sign-in-form.tsx` - Já implementado com padrão correto
- `tailwind.config.ts` - Configuração das cores Aleen

## Tarefas de Implementação

### Fase 1: Atualização de Marca e Assets
1. **Verificar assets**: Confirmar existência e qualidade de `/aleen-logo.png`
2. **Find/Replace global**: "FitJourney" → "Aleen.ai" em todos os arquivos
3. **Atualizar meta tags**: Se houver referências ao nome antigo

### Fase 2: Cores e Gradientes
4. **Background principal**: `bg-gray-50` → `bg-gradient-to-br from-aleen-light to-white`
5. **Buttons primários**: Aplicar gradientes `from-aleen-primary to-aleen-secondary`
6. **Cards headers**: Adicionar gradientes nos cabeçalhos importantes
7. **Progress bar**: Cores da marca
8. **Loading spinner**: Cores da marca

### Fase 3: Border Radius e Sombras
9. **Cards principais**: `rounded-3xl` e `shadow-2xl`
10. **Buttons e inputs**: `rounded-2xl`
11. **Elements menores**: `rounded-xl`
12. **Hover effects**: `hover:scale-105` e `hover:shadow-xl`

### Fase 4: Elementos Específicos
13. **Welcome screen**: Logo, título, cores
14. **Question cards**: Styling consistente
15. **Navigation buttons**: Gradientes e efeitos
16. **Completion screen**: Celebração com cores da marca
17. **Error states**: Cores e styling consistentes

### Fase 5: Refinamentos e Testes
18. **Transições**: `transition-all duration-300`
19. **Estados de loading**: Cores da marca
20. **States de erro**: Vermelho mantido mas com styling aleen
21. **Mobile responsiveness**: Verificar em todos os breakpoints
22. **Accessibility**: Alt texts e aria-labels corretos

## Considerações Técnicas

### Classes CSS Reutilizáveis
```css
/* Criar classes utilitárias para padrões repetitivos */
.aleen-gradient-bg { @apply bg-gradient-to-r from-aleen-primary to-aleen-secondary; }
.aleen-gradient-hover { @apply hover:from-aleen-secondary hover:to-aleen-primary; }
.aleen-card { @apply bg-white border-0 shadow-2xl rounded-3xl overflow-hidden; }
.aleen-button { @apply bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-bold rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105; }
```

### Performance
- Verificar se gradientes não impactam performance
- Otimizar transições para 60fps
- Lazy loading da logo se necessário

### Acessibilidade
- Manter contraste adequado nos gradientes
- Alt text correto: "Aleen.ai Logo"
- Focus states visíveis nos elementos interativos

## Estimativa
- **Fase 1-2**: 3-4 horas (marca e cores básicas)
- **Fase 3**: 2-3 horas (border radius e sombras)
- **Fase 4**: 4-5 horas (elementos específicos)
- **Fase 5**: 2-3 horas (refinamentos e testes)
- **Total**: 11-15 horas (~1.5-2 dias)

## Riscos e Mitigações
- **Risco**: Quebrar funcionalidade existente
  - **Mitigação**: Testes após cada fase
- **Risco**: Gradientes pesados no mobile
  - **Mitigação**: Fallbacks com cores sólidas
- **Risco**: Contraste insuficiente
  - **Mitigação**: Testes de acessibilidade

## Próximos Passos Após Conclusão
1. Aplicar mesmo padrão em outras páginas (se existirem)
2. Criar style guide documentado
3. Componentizar elementos reutilizáveis
4. Considerar dark mode seguindo paleta Aleen

## Validação Final
- [ ] Screenshot comparison: antes vs depois
- [ ] Teste em devices móveis
- [ ] Verificação de acessibilidade
- [ ] Performance check
- [ ] Review de QA completo

---

Arquivo criado automaticamente: `backlog/4-padronizacao-visual-onboarding-aleen.md`
