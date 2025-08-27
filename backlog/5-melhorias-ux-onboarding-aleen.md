# TAREFA: Melhorias de UX no Onboarding Aleen.ai

## 📋 RESUMO EXECUTIVO
**Objetivo**: Corrigir problemas críticos de UX e validação no fluxo de onboarding para melhorar a experiência do usuário e prevenir bugs/inconsistências.

**Prioridade**: 🔴 ALTA (Afeta primeira impressão e criação de contas)

**Estimativa**: 8-12 horas

**Status**: ✅ CONCLUÍDO - Implementação Completa

### Agent Model Used
**James (Full Stack Developer)** - Implementação técnica completa de melhorias UX

### Debug Log References
- ✅ Servidor rodando em http://localhost:3000
- ✅ Todas as funcionalidades implementadas e testáveis
- ⚠️ Alguns warnings de lint (not blocking deployment)

### Completion Notes List
1. **✅ FASE 1 - Validação de Idade**: Campo age agora aceita apenas números (01-99), input type text com máscara, validação completa
2. **✅ FASE 2 - Layout do Telefone**: Bandeira brasileira integrada no input (redonda), validação obrigatória implementada
3. **✅ FASE 3 - Navegação Pós-Criação**: Botão Back oculto após criação de conta (Step 3+), lógica condicional funcionando
4. **✅ FASE 4 - Sistema Multi-Select**: Radio convertido para checkbox em questions configuradas, visual feedback adequado, área completa clicável
5. **✅ FASE 5 - Validações Robustas**: Campos "outro" com input dinâmico, textarea obrigatória, sistema de validação completo

### File List
- Modified: `app/onboarding/page.tsx` - Componente principal com todas as melhorias UX
- Modified: `lib/onboarding.ts` - Sistema de validação e helper functions
- Modified: `backlog/5-melhorias-ux-onboarding-aleen.md` - Este arquivo de documentação

### Change Log
```
2025-01-26 - James (Dev Agent)
- ✅ Implementada validação numérica para campo idade (01-99)
- ✅ Melhorado layout do input telefone com bandeira integrada
- ✅ Implementado controle de navegação pós-criação de conta
- ✅ Criado sistema flexível radio/checkbox para seleção múltipla
- ✅ Adicionado suporte para campos "outro" com input dinâmico
- ✅ Implementadas validações robustas para todos os tipos de campo
- ✅ Melhorado feedback visual e interação do usuário
```

**Status**: ✅ READY FOR REVIEW

## 🎯 PROBLEMAS IDENTIFICADOS

### 1. STEP 2 - Campo Idade (Validação Numérica)
- **Problema**: Campo aceita letras e permite mais de 2 caracteres
- **Impacto**: Dados inválidos na base de dados
- **Requisito**: Apenas números, mínimo 01, máximo 99

### 2. STEP 3 - Bandeira do Brasil (Layout e Design)
- **Problema**: Bandeira aparece fora do input field
- **Impacto**: Layout quebrado, UX confusa
- **Requisito**: Bandeira dentro do input, preferencialmente redonda

### 3. STEP 3 - Validação Telefone Obrigatória
- **Problema**: Permite prosseguir sem número de telefone
- **Impacto**: Contas criadas sem telefone
- **Requisito**: Telefone obrigatório para prosseguir

### 4. STEP 4+ - Botão Voltar Pós-Criação
- **Problema**: Permite voltar após criação de conta (Steps 4+)
- **Impacto**: Potencial bug e inconsistência de dados
- **Requisito**: Remover "Back" após Step 3 (conta criada)

### 5. STEP 7 - Radio vs Checkbox (Seleção Múltipla)
- **Problema**: Usa radio buttons para seleção múltipla
- **Impacto**: UX limitada, não permite múltiplas seleções
- **Requisito**: Usar checkboxes para permitir múltiplas seleções

### 6. Opção "Outro" - Input Dinâmico
- **Problema**: Não abre campo para especificar "outro"
- **Impacto**: Dados incompletos quando usuário seleciona "outro"
- **Requisito**: Input text quando "outro" selecionado + validação

### 7. Visual Feedback - Seleção Ativa
- **Problema**: Opções selecionadas não mantêm visual de ativo
- **Impacto**: Usuário não sabe o que está selecionado
- **Requisito**: Borda verde permanente em itens selecionados

### 8. Área Clicável - Opções de Seleção
- **Problema**: Só texto é clicável, não toda a área da opção
- **Impacto**: UX pobre, dificuldade de interação
- **Requisito**: Toda área da opção deve ser clicável

### 9. Checkboxes vs Radio Visual
- **Problema**: Multi-select usa formato redondo igual radio
- **Impacto**: Confusão visual, não segue padrões UX
- **Requisito**: Checkboxes com bordas arredondadas (não totalmente redondas)

### 10. STEP 13 - Validação Textarea Obrigatória
- **Problema**: Permite prosseguir sem preencher campo obrigatório
- **Impacto**: Dados incompletos
- **Requisito**: Validação obrigatória para textarea

### 11. Validação Geral - Campos Obrigatórios
- **Problema**: Radio e checkbox permitem prosseguir sem seleção
- **Impacto**: Dados faltantes
- **Requisito**: Validação para todos os campos obrigatórios

---

## 🛠️ IMPLEMENTAÇÃO DETALHADA

### FASE 1: Validação de Idade (Step 2)

**Arquivos a modificar:**
- `app/onboarding/page.tsx`
- `lib/onboarding.ts`

**Mudanças necessárias:**

1. **Input de Idade - Máscara e Validação**
```tsx
// Em app/onboarding/page.tsx, função renderQuestion, seção number
{question.question_type === "number" && question.field_name === "age" && (
  <>
    <Label htmlFor={question.field_name} className="text-black font-medium">
      {question.title}
    </Label>
    <Input
      id={question.field_name}
      type="text"  // Mudado de number para text para controle total
      maxLength={2}
      value={value || ""}
      onChange={(e) => {
        // Permitir apenas números e máximo 2 caracteres
        const numericValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 2)
        updateResponse(question.field_name, numericValue)
      }}
      onKeyPress={(e) => {
        // Bloquear teclas não numéricas
        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
          e.preventDefault()
        }
      }}
      placeholder={question.placeholder || "25"}
      className={`border-2 ${error ? "border-red-500" : "border-aleen-light"} focus:border-aleen-primary rounded-2xl text-black placeholder:text-gray-400 py-3 transition-all duration-300 focus:shadow-lg text-center`}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </>
)}
```

2. **Validação no lib/onboarding.ts**
```typescript
// Na função validateResponse, adicionar validação específica para idade
if (question.field_name === "age" && typeof value === "string") {
  const ageValue = value.trim()
  
  // Verificar se contém apenas números
  if (!/^[0-9]+$/.test(ageValue)) {
    return { isValid: false, error: "Idade deve conter apenas números" }
  }
  
  // Verificar se tem 1-2 caracteres
  if (ageValue.length === 0 || ageValue.length > 2) {
    return { isValid: false, error: "Idade deve ter 1 ou 2 dígitos" }
  }
  
  const numValue = Number(ageValue)
  
  // Verificar limites mínimo e máximo
  if (numValue < 1 || numValue > 99) {
    return { isValid: false, error: "Idade deve estar entre 01 e 99 anos" }
  }
}
```

### FASE 2: Layout do Telefone (Step 3)

**Arquivos a modificar:**
- `app/onboarding/page.tsx`

**Customização do PhoneInput:**

```tsx
// Campo de telefone para questões de email - versão corrigida
<div className="mt-4">
  <Label htmlFor="phone" className="text-black font-medium">
    Phone number
  </Label>
  <div className="relative">
    <PhoneInput
      international
      countryCallingCodeEditable={false}
      defaultCountry="BR"
      value={responses.phone || ""}
      onChange={(value) => updateResponse("phone", value || "")}
      className={`w-full border-2 ${errors.phone ? "border-red-500" : "border-aleen-light"} rounded-2xl focus:border-aleen-primary text-black bg-white overflow-hidden`}
      style={{
        '--PhoneInputCountryFlag-height': '1.2em',
        '--PhoneInputCountryFlag-borderRadius': '50%', // Bandeira redonda
        '--PhoneInputCountryFlag-borderColor': 'transparent',
        '--PhoneInputCountrySelectArrow-color': '#6b7280',
        '--PhoneInput-color--focus': '#000000',
      } as any}
      inputComponent={({ className, ...props }) => (
        <Input
          {...props}
          className="border-0 bg-transparent focus:ring-0 focus:border-0 pl-12 py-3 rounded-2xl"
          style={{ outline: 'none', boxShadow: 'none' }}
        />
      )}
      flagComponent={({ country, flagUrl, ...props }) => (
        <div 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full overflow-hidden border border-gray-200"
          {...props}
        >
          <img 
            src={flagUrl} 
            alt={`${country} flag`}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    />
  </div>
  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
</div>
```

**Validação Telefone Obrigatória:**
```tsx
// Na função nextStep, melhorar validação de telefone
if (currentQuestion.field_name === "email") {
  const password = responses.password
  const phone = responses.phone
  
  if (!phone || phone.trim().length === 0) {
    setErrors((prev) => ({
      ...prev,
      phone: "Número de telefone é obrigatório",
    }))
    return
  }
  
  // Validar formato do telefone
  const phoneDigits = phone.replace(/\D/g, '')
  if (phoneDigits.length < 10) {
    setErrors((prev) => ({
      ...prev,
      phone: "Por favor, insira um número de telefone válido",
    }))
    return
  }
  
  // Resto da validação...
}
```

### FASE 3: Controle de Navegação Pós-Criação

**Arquivo a modificar:**
- `app/onboarding/page.tsx`

**Lógica do Botão Back:**
```tsx
// Modificar a seção de Navigation no final do componente
<div className="flex justify-between items-center">
  {/* Mostrar botão Back apenas antes da criação da conta OU se for step 0 */}
  {(currentStep === 0 || (!userCreated && currentStep <= 2)) ? (
    <Button
      variant="outline"
      onClick={prevStep}
      className="border-2 border-aleen-light text-aleen-primary hover:bg-aleen-light/20 bg-transparent rounded-2xl transition-all duration-300"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back
    </Button>
  ) : (
    <div></div> // Espaço vazio para manter layout
  )}

  <Button
    onClick={nextStep}
    disabled={!canProceed()}
    className="bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
  >
    {currentStep === visibleQuestions.length - 1 ? "Complete" : "Next"}
    <ArrowRight className="ml-2 h-4 w-4" />
  </Button>
</div>
```

### FASE 4: Radio para Checkbox (Seleção Múltipla)

**Arquivos a modificar:**
- `app/onboarding/page.tsx`
- `lib/onboarding.ts` (dados de fallback)

**1. Identificar questions que devem ser checkbox:**
```typescript
// No lib/onboarding.ts, modificar fallback questions e/ou verificar database
// Step 7 - Equipment question deve ser checkbox
const MULTI_SELECT_QUESTIONS = ['equipment', 'goals', 'workout_preferences'] // field_names que permitem múltiplas seleções

// Função helper para detectar se question permite múltiplas seleções
const isMultiSelectQuestion = (fieldName: string): boolean => {
  return MULTI_SELECT_QUESTIONS.includes(fieldName)
}
```

**2. Renderização Condicional:**
```tsx
// Na função renderQuestion, substituir a seção radio por:
{question.question_type === "radio" && question.options && (
  <>
    {isMultiSelectQuestion(question.field_name) ? (
      // CHECKBOX para seleção múltipla
      <div className="space-y-3">
        {(() => {
          let optionsArray: string[] = [];
          if (Array.isArray(question.options)) {
            optionsArray = question.options;
          } else if (question.options && typeof question.options === 'object' && 'options' in question.options) {
            optionsArray = Array.isArray((question.options as any).options) ? (question.options as any).options : [];
          }
          
          return optionsArray.map((option: string, index: number) => {
            const isSelected = ((value as string[]) || []).includes(option)
            const isOtherOption = option.toLowerCase().includes('other') || option.toLowerCase().includes('outro')
            const otherInputKey = `${question.field_name}_other_${index}`
            const otherValue = responses[otherInputKey] || ''
            
            return (
              <div key={option} className="space-y-2">
                <div
                  className={`flex items-center space-x-3 p-4 border-2 cursor-pointer transition-all duration-300 hover:shadow-lg rounded-2xl ${
                    isSelected 
                      ? "border-aleen-primary bg-aleen-light/10" 
                      : error ? "border-red-500" : "border-aleen-light hover:border-aleen-primary"
                  }`}
                  onClick={() => handleArrayUpdate(question.field_name, option, !isSelected)}
                >
                  <Checkbox
                    id={`${question.field_name}_${index}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleArrayUpdate(question.field_name, option, checked as boolean)}
                    className="border-2 border-aleen-secondary rounded-md" // Bordas arredondadas, não círculo
                  />
                  <Label 
                    htmlFor={`${question.field_name}_${index}`} 
                    className="text-black cursor-pointer flex-1 font-medium"
                  >
                    {option}
                  </Label>
                </div>
                
                {/* Input para "Outro" quando selecionado */}
                {isOtherOption && isSelected && (
                  <div className="ml-10 mt-2">
                    <Input
                      placeholder="Especifique..."
                      value={otherValue}
                      onChange={(e) => updateResponse(otherInputKey, e.target.value)}
                      className="border-2 border-aleen-light focus:border-aleen-primary rounded-2xl text-black placeholder:text-gray-400 py-2"
                    />
                  </div>
                )}
              </div>
            )
          });
        })()}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    ) : (
      // RADIO para seleção única (mantém comportamento atual)
      <RadioGroup value={value || ""} onValueChange={(newValue) => updateResponse(question.field_name, newValue)}>
        <div className="space-y-3">
          {(() => {
            let optionsArray: string[] = [];
            if (Array.isArray(question.options)) {
              optionsArray = question.options;
            } else if (question.options && typeof question.options === 'object' && 'options' in question.options) {
              optionsArray = Array.isArray((question.options as any).options) ? (question.options as any).options : [];
            }
            
            return optionsArray.map((option: string, index: number) => {
              const isSelected = value === option.toLowerCase()
              const isOtherOption = option.toLowerCase().includes('other') || option.toLowerCase().includes('outro')
              const otherInputKey = `${question.field_name}_other`
              const otherValue = responses[otherInputKey] || ''
              
              return (
                <div key={option} className="space-y-2">
                  <div
                    className={`flex items-center space-x-3 p-4 border-2 cursor-pointer transition-all duration-300 hover:shadow-lg rounded-2xl ${
                      isSelected 
                        ? "border-aleen-primary bg-aleen-light/10" 
                        : error ? "border-red-500" : "border-aleen-light hover:border-aleen-primary"
                    }`}
                    onClick={() => updateResponse(question.field_name, option.toLowerCase())}
                  >
                    <RadioGroupItem 
                      value={option.toLowerCase()} 
                      id={`${question.field_name}_${index}`}
                      className="border-2 border-aleen-secondary" 
                    />
                    <Label 
                      htmlFor={`${question.field_name}_${index}`}
                      className="text-black cursor-pointer flex-1 font-medium"
                    >
                      {option}
                    </Label>
                  </div>
                  
                  {/* Input para "Outro" quando selecionado */}
                  {isOtherOption && isSelected && (
                    <div className="ml-10 mt-2">
                      <Input
                        placeholder="Especifique..."
                        value={otherValue}
                        onChange={(e) => updateResponse(otherInputKey, e.target.value)}
                        className="border-2 border-aleen-light focus:border-aleen-primary rounded-2xl text-black placeholder:text-gray-400 py-2"
                      />
                    </div>
                  )}
                </div>
              )
            });
          })()}
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </RadioGroup>
    )}
  </>
)}
```

### FASE 5: Validação Aprimorada

**Arquivo a modificar:**
- `lib/onboarding.ts`

**Validação para campos "Outro":**
```typescript
// Na função validateResponse, adicionar validação para campos "outro"
export const validateResponse = (
  question: OnboardingQuestion,
  value: string | string[] | null,
  allResponses?: Record<string, any> // Adicionar parâmetro para acessar todas as respostas
): { isValid: boolean; error?: string } => {
  // Validação existente...
  
  // Nova validação para campos "outro" selecionados
  if (question.required && Array.isArray(value)) {
    // Verificar se "outro" está selecionado mas não especificado
    const hasOtherSelected = value.some(item => 
      item.toLowerCase().includes('other') || item.toLowerCase().includes('outro')
    )
    
    if (hasOtherSelected && allResponses) {
      // Procurar campos "outro" relacionados que estão vazios
      const otherKeys = Object.keys(allResponses).filter(key => 
        key.startsWith(`${question.field_name}_other`)
      )
      
      const hasEmptyOther = otherKeys.some(key => 
        !allResponses[key] || allResponses[key].trim().length === 0
      )
      
      if (hasEmptyOther) {
        return { isValid: false, error: "Por favor, especifique a opção 'Outro'" }
      }
    }
  }
  
  // Para radio buttons com "outro"
  if (question.required && typeof value === "string") {
    const isOtherSelected = value.toLowerCase().includes('other') || value.toLowerCase().includes('outro')
    
    if (isOtherSelected && allResponses) {
      const otherKey = `${question.field_name}_other`
      const otherValue = allResponses[otherKey]
      
      if (!otherValue || otherValue.trim().length === 0) {
        return { isValid: false, error: "Por favor, especifique a opção 'Outro'" }
      }
    }
  }
  
  return { isValid: true }
}
```

**Atualizar função canProceed:**
```tsx
// Na função canProceed, passar todas as respostas para validação
const canProceed = () => {
  const currentQuestion = visibleQuestions[currentStep]
  if (!currentQuestion) return true

  const value = responses[currentQuestion.field_name]
  const validation = validateResponse(currentQuestion, value, responses) // Passar todas as respostas

  // Validação adicional para senha quando for questão de email
  if (currentQuestion.field_name === "email") {
    const password = responses.password
    const phone = responses.phone
    if (!password || password.length < 6) {
      return false
    }
    if (!phone || phone.trim().length === 0) {
      return false
    }
  }

  return validation.isValid
}
```

---

## 🎯 RESULTADOS ESPERADOS

### Melhorias de UX:
- ✅ Campo idade aceita apenas números (01-99)
- ✅ Bandeira do Brasil integrada no input do telefone
- ✅ Telefone obrigatório para criação de conta
- ✅ Navegação bloqueada após criação de conta
- ✅ Seleção múltipla com checkboxes funcionais
- ✅ Input dinâmico para opções "outro"
- ✅ Visual feedback correto em seleções
- ✅ Área completa clicável em opções
- ✅ Checkboxes visuais distintos de radio buttons
- ✅ Validação obrigatória em todos os campos

### Benefícios Técnicos:
- 🛡️ Dados mais íntegros na base de dados
- 🚫 Prevenção de bugs de navegação
- ✨ Experiência de usuário mais intuitiva
- 📱 Layout responsivo melhorado
- 🔍 Validações robustas

---

## 🧪 CRITÉRIOS DE ACEITAÇÃO

### Testes Funcionais:
1. **Campo Idade**: Só aceita números, máximo 2 dígitos, range 01-99
2. **Telefone**: Bandeira aparece dentro do input, telefone obrigatório
3. **Navegação**: Botão "Back" some após Step 3 (criação de conta)
4. **Seleção Múltipla**: Checkboxes permitem múltiplas seleções
5. **Campo Outro**: Abre input text quando selecionado, validação obrigatória
6. **Visual**: Itens selecionados mantêm borda verde
7. **Clique**: Toda área da opção é clicável
8. **Formato**: Checkboxes têm bordas arredondadas (não circulares)
9. **Textarea**: Campos obrigatórios impedem avanço se vazios
10. **Validação Geral**: Todos os campos obrigatórios validam corretamente

### Testes de Regressão:
- ✅ Fluxo de criação de conta continua funcionando
- ✅ Dados salvos corretamente no Supabase
- ✅ Progresso do usuário preservado
- ✅ Responsividade mantida em mobile

---

## ⚠️ RISCOS E MITIGAÇÕES

### Riscos Identificados:
1. **Layout quebrado**: Mudanças no PhoneInput podem afetar responsividade
2. **Validação excessiva**: Pode frustrar usuários com validações muito rígidas
3. **Dados existentes**: Usuários com dados antigos podem ter problemas

### Mitigações:
1. **Testes extensivos** em diferentes dispositivos e tamanhos de tela
2. **Validação progressiva** com mensagens claras e úteis
3. **Migração de dados** ou validação condicional para dados existentes

---

## 🔄 SEQUENCIAMENTO

**Ordem recomendada de implementação:**
1. Validação de idade (baixo risco, alto impacto)
2. Layout do telefone (médio risco, alto impacto visual)
3. Controle de navegação (baixo risco, previne bugs)
4. Radio para checkbox (alto impacto na funcionalidade)
5. Validações gerais (refinamento final)

**Tempo estimado por fase:**
- Fase 1: 1-2 horas
- Fase 2: 2-3 horas  
- Fase 3: 1 hora
- Fase 4: 3-4 horas
- Fase 5: 1-2 horas

**Total: 8-12 horas**
