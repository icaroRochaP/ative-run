# USER STORY: Popup de Perfil do Usuário no Dashboard

## 📋 RESUMO EXECUTIVO
**Como** um usuário logado no dashboard do Aleen.ai  
**Eu quero** clicar no meu nome/avatar para abrir um popup de perfil  
**Para que** eu possa gerenciar minha conta (alterar nome, trocar senha, fazer logout) de forma rápida e intuitiva  

**Prioridade**: 🟡 MÉDIA (Melhoria de UX e Funcionalidade)  
**Estimativa**: 6-10 horas  
**Epic**: Dashboard Core Features  

---

## 🎯 CONTEXTO DO PROBLEMA

### Situação Atual:
- Nome do usuário aparece no UserHeaderCard mas não é interativo
- Não existe forma de acessar configurações de perfil no dashboard
- Modal de troca de senha só aparece quando forçado pelo sistema
- Usuário não tem forma fácil de fazer logout (só pelo FloatingActionButton)

### Necessidade Identificada:
- Interface intuitiva para gestão básica de perfil
- Acesso rápido à troca de senha
- Centralização das ações de conta em um local
- Melhoria da experiência de usuário

---

## ✨ FUNCIONALIDADES DETALHADAS

### 1. TRIGGER - Área Clicável
**Requisito**: Transformar o nome do usuário em elemento clicável
- **Localização**: `UserHeaderCard` componente
- **Área clicável**: Nome completo + avatar do usuário
- **Visual feedback**: Hover state com cursor pointer
- **Acessibilidade**: ARIA labels e suporte a teclado

### 2. POPUP MODAL - Design e Layout
**Requisito**: Modal moderno seguindo design system Aleen.ai
- **Estilo**: Popup compacto e elegante
- **Cores**: Gradiente aleen-primary/secondary no header
- **Bordas**: Rounded-3xl consistency
- **Animação**: Fade-in/zoom-in suave
- **Responsividade**: Mobile-first design

### 3. CONTEÚDO DO MODAL
**Requisito**: Três ações principais bem organizadas

#### A. Editar Nome
- **Input field** para novo nome
- **Validação** em tempo real (mínimo 2 caracteres)
- **Save/Cancel** buttons
- **Loading state** durante atualização

#### B. Trocar Senha  
- **Botão** que abre o modal existente de senha
- **Integração** com `PasswordChangeModal` atual
- **Estado** adequado após mudança de senha

#### C. Logout
- **Botão** com confirmação opcional
- **Integração** com função logout existente
- **Redirecionamento** adequado

### 4. ESTADOS E INTERAÇÕES
**Requisito**: UX fluida com feedback adequado
- **Loading states** em todas as operações
- **Success/Error feedback** via toast notifications
- **Validação** em tempo real nos inputs
- **Escape** key para fechar modal
- **Click outside** para fechar modal

---

## 🛠️ IMPLEMENTAÇÃO TÉCNICA

### COMPONENTES A CRIAR:

#### 1. ProfileModal.tsx
```tsx
interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onProfileUpdate: (newName: string) => void
  onPasswordChange: () => void
  onLogout: () => void
}
```

#### 2. Hooks Necessários:
```tsx
// useProfileModal.ts
- Estado do modal (open/close)
- Funções de update de perfil
- Integração com PasswordChangeModal
- Loading states management
```

### ARQUIVOS A MODIFICAR:

#### 1. UserHeaderCard.tsx
```tsx
// Adicionar onClick handler e área clicável
- Wrapper clicável no nome/avatar
- Hover states visuais
- Acessibilidade (role="button", tabIndex)
```

#### 2. DashboardLayout.tsx
```tsx
// Gerenciamento de estado do modal
- Estado isProfileModalOpen
- Handler functions
- Integração com ProfileModal
```

#### 3. useDashboardData.ts
```tsx
// Lógica de perfil
- updateUserProfile function
- openPasswordChangeModal state
- Integração com auth provider
```

---

## 📱 DESIGN SPECIFICATIONS

### Layout do Modal:
```
┌─────────────────────────────────┐
│ [X]  PERFIL DO USUÁRIO          │
│ ──────────────────────────────  │ 
│                                 │
│ 👤 [George Ribeiro    ] [Edit]  │
│                                 │
│ 🔑 [Trocar Senha          ] >   │
│                                 │
│ 🚪 [Sair da Conta         ] >   │
│                                 │
└─────────────────────────────────┘
```

### Elementos Visuais:
- **Header**: Gradiente aleen-primary → aleen-secondary
- **Ícones**: User, Key, LogOut (lucide-react)
- **Inputs**: Rounded-2xl, border aleen-light
- **Buttons**: Gradiente consistency
- **Spacing**: Padding 6, gap 4
- **Animation**: 300ms ease-out transitions

### Estados Visuais:
```tsx
// Hover state no nome (trigger)
className="cursor-pointer hover:opacity-80 transition-opacity duration-200"

// Modal backdrop
className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"

// Modal container
className="animate-in fade-in zoom-in-95 duration-300"
```

---

## 🔧 IMPLEMENTAÇÃO POR FASES

### FASE 1: Estrutura Base (2-3 horas)
1. **Criar ProfileModal component**
   - Estrutura básica do modal
   - Layout e estilos
   - Props interface

2. **Modificar UserHeaderCard**
   - Adicionar área clicável
   - Hover states
   - Eventos de click

3. **Integração inicial**
   - Estado no DashboardLayout
   - Open/close functionality

### FASE 2: Funcionalidade de Nome (2-3 horas)
1. **Input de edição de nome**
   - Campo editável
   - Validação em tempo real
   - Save/Cancel logic

2. **Backend integration**
   - Update user profile API call
   - Estado de loading
   - Error handling

3. **Feedback visual**
   - Toast notifications
   - Loading spinners
   - Success states

### FASE 3: Integração Senha e Logout (2-3 horas)
1. **Password modal integration**
   - Trigger do PasswordChangeModal
   - Estado adequado
   - Callback handling

2. **Logout functionality**
   - Confirmação opcional
   - Integração com auth
   - Redirecionamento

3. **Polish final**
   - Animações suaves
   - Acessibilidade
   - Mobile responsiveness

### FASE 4: Testes e Refinamentos (1 hora)
1. **Testing manual**
   - Fluxos completos
   - Edge cases
   - Mobile testing

2. **Bug fixes**
   - Ajustes de layout
   - Melhorias de UX
   - Performance optimization

---

## 📝 CÓDIGO DE EXEMPLO

### ProfileModal Component:
```tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Key, LogOut, X, Edit3 } from "lucide-react"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onProfileUpdate: (newName: string) => Promise<void>
  onPasswordChange: () => void
  onLogout: () => void
}

export function ProfileModal({ 
  isOpen, 
  onClose, 
  user, 
  onProfileUpdate, 
  onPasswordChange, 
  onLogout 
}: ProfileModalProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(user?.name || "")
  const [loading, setLoading] = useState(false)

  const handleSaveName = async () => {
    if (newName.trim().length < 2) return
    
    setLoading(true)
    try {
      await onProfileUpdate(newName.trim())
      setIsEditingName(false)
    } catch (error) {
      console.error("Error updating name:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-sm bg-white border-0 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
        <CardHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <CardTitle className="text-xl font-bold flex items-center">
            <User className="mr-3 h-6 w-6" />
            Perfil do Usuário
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          {/* Name Section */}
          <div className="flex items-center justify-between p-4 border-2 border-aleen-light rounded-2xl hover:border-aleen-primary transition-colors">
            {isEditingName ? (
              <div className="flex-1 flex items-center space-x-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border-aleen-light focus:border-aleen-primary rounded-xl"
                  placeholder="Seu nome"
                />
                <Button
                  onClick={handleSaveName}
                  disabled={loading || newName.trim().length < 2}
                  size="sm"
                  className="bg-aleen-primary hover:bg-aleen-secondary rounded-xl"
                >
                  {loading ? "..." : "OK"}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditingName(false)
                    setNewName(user?.name || "")
                  }}
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                >
                  ✕
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <User className="mr-3 h-5 w-5 text-aleen-primary" />
                  <span className="font-medium text-gray-800">{user?.name}</span>
                </div>
                <Button
                  onClick={() => setIsEditingName(true)}
                  size="sm"
                  variant="ghost"
                  className="text-aleen-primary hover:text-aleen-secondary"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Password Change */}
          <button
            onClick={onPasswordChange}
            className="w-full flex items-center justify-between p-4 border-2 border-aleen-light rounded-2xl hover:border-aleen-primary transition-colors text-left"
          >
            <div className="flex items-center">
              <Key className="mr-3 h-5 w-5 text-aleen-primary" />
              <span className="font-medium text-gray-800">Trocar Senha</span>
            </div>
            <span className="text-aleen-primary">›</span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between p-4 border-2 border-red-200 rounded-2xl hover:border-red-400 transition-colors text-left"
          >
            <div className="flex items-center">
              <LogOut className="mr-3 h-5 w-5 text-red-500" />
              <span className="font-medium text-red-600">Sair da Conta</span>
            </div>
            <span className="text-red-500">›</span>
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
```

### UserHeaderCard Modification:
```tsx
// Adicionar ao UserHeaderCard.tsx
<div 
  className="flex items-center space-x-4 cursor-pointer hover:opacity-90 transition-opacity duration-200"
  onClick={onProfileClick}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onProfileClick()
    }
  }}
  aria-label="Abrir perfil do usuário"
>
  {/* Conteúdo existente do avatar e nome */}
</div>
```

---

## ✅ CRITÉRIOS DE ACEITAÇÃO

### Funcionalidades Core:
1. **✅ Click no Nome**: Usuário pode clicar no nome/avatar para abrir popup
2. **✅ Modal Design**: Popup segue design system Aleen.ai (cores, bordas, etc.)
3. **✅ Editar Nome**: Campo editável com validação e save functionality
4. **✅ Trocar Senha**: Abre modal de senha existente
5. **✅ Logout**: Executa logout com redirecionamento adequado
6. **✅ Fechar Modal**: ESC key, click outside, botão X funcionam
7. **✅ Loading States**: Feedback visual durante operações
8. **✅ Responsivo**: Funciona bem em mobile e desktop

### Critérios de Qualidade:
1. **✅ Performance**: Modal abre/fecha em <300ms
2. **✅ Acessibilidade**: ARIA labels, navegação por teclado
3. **✅ Error Handling**: Tratamento adequado de erros
4. **✅ Visual Consistency**: Mantém padrões do dashboard
5. **✅ No Regressions**: Funcionalidades existentes não afetadas

### Testes de Aceitação:
```gherkin
Scenario: Abrir popup de perfil
  Given que estou logado no dashboard
  When clico no meu nome no UserHeaderCard
  Then o popup de perfil deve abrir
  And deve mostrar meu nome atual
  And deve mostrar opções "Trocar Senha" e "Sair"

Scenario: Editar nome do usuário
  Given que o popup de perfil está aberto
  When clico no botão "Edit" próximo ao nome
  And altero meu nome para "Novo Nome"
  And clico em "OK"
  Then meu nome deve ser atualizado no backend
  And o modal deve fechar
  And o nome deve aparecer atualizado no dashboard

Scenario: Trocar senha via popup
  Given que o popup de perfil está aberto
  When clico em "Trocar Senha"
  Then o modal de mudança de senha deve abrir
  And o popup de perfil deve fechar

Scenario: Logout via popup
  Given que o popup de perfil está aberto
  When clico em "Sair da Conta"
  Then devo ser deslogado
  And redirecionado para página de login
```

---

## 🚨 RISCOS E CONSIDERAÇÕES

### Riscos Técnicos:
1. **Modal Stacking**: Popup + PasswordModal simultaneamente
2. **State Management**: Sincronização entre modais
3. **Mobile UX**: Tamanho adequado em telas pequenas
4. **Performance**: Re-renders desnecessários

### Mitigações:
1. **Z-index Management**: Camadas bem definidas
2. **Estado Centralizado**: Um modal ativo por vez
3. **Responsive Design**: Breakpoints bem definidos
4. **Memoization**: React.memo em componentes adequados

### Dependências:
- ✅ PasswordChangeModal existente
- ✅ AuthProvider functionality
- ✅ Toast system funcionando
- ✅ User profile update API

---

## 📊 IMPACTO ESPERADO

### Benefícios UX:
- 🎯 **Acesso Rápido**: Configurações de perfil em 1 click
- 🎨 **Interface Limpa**: Centralização de ações de conta
- 📱 **Mobile Friendly**: UX adequada em dispositivos móveis
- ♿ **Acessibilidade**: Suporte a navegação por teclado

### Benefícios Técnicos:
- 🔧 **Reusabilidade**: Modal pattern para futuras features
- 🛡️ **Consistência**: Design system bem aplicado
- 📈 **Scalabilidade**: Base para mais opções de perfil
- 🎯 **Maintainability**: Código bem estruturado

### Métricas de Sucesso:
- **User Engagement**: Aumento no uso de funcionalidades de perfil
- **Time to Action**: Redução do tempo para trocar senha/nome
- **User Satisfaction**: Feedback positivo na facilidade de uso
- **Support Tickets**: Redução de dúvidas sobre como acessar configurações

---

## 🔄 PRÓXIMOS PASSOS

### Imediatos (Esta Sprint):
1. **Dev Implementation**: Seguir fases definidas de implementação
2. **Design Review**: Validar mockups antes do desenvolvimento
3. **Testing Strategy**: Definir casos de teste detalhados

### Futuro (Próximas Sprints):
1. **Profile Settings Expansion**: Adicionar mais configurações
2. **Avatar Upload**: Permitir upload de foto de perfil  
3. **Theme Preferences**: Configurações de tema/aparência
4. **Notification Settings**: Configurações de notificação

---

**Preparado por**: Sarah (Product Owner)  
**Data**: 26 de Agosto, 2025  
**Versão**: 1.0  
**Aprovação necessária**: Tech Lead + UX Designer
