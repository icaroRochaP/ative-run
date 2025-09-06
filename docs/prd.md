# Product Requirements Document (PRD): IA Coach para Strava

### **Seção 1: Metas e Contexto**

#### **Metas**
* Validar o Product-Market Fit alcançando 100 assinantes pagantes nos primeiros 3 meses.
* Entregar insights de alto valor que resultem em uma taxa de engajamento (leitura) superior a 70% e uma taxa de retenção (churn < 15%) que comprove a satisfação do usuário.
* Garantir uma experiência técnica robusta, com 99% dos treinos processados e insights entregues em menos de 3 minutos.

#### **Contexto**
Este PRD detalha os requisitos para um serviço de IA que atua como um "treinador de corrida de bolso". Ele se integra ao Strava e ao WhatsApp para resolver a dor de corredores amadores que não sabem como interpretar os dados de seus treinos. A solução fornecerá análises personalizadas e acionáveis via WhatsApp, com um onboarding conversacional focado em vendas e um portal web mínimo para gestão de contas e assinaturas.

---

### **Seção 2: Requisitos**

#### **Requisitos Funcionais (FR)**
* **FR1**: O sistema deve prover um fluxo de onboarding conversacional via WhatsApp.
* **FR2**: A IA de onboarding deve ser capaz de apresentar o serviço, responder a objeções e guiar o usuário para o fluxo de assinatura.
* **FR3**: Durante o onboarding, o sistema deve solicitar um e-mail.
* **FR4**: O sistema deve criar uma conta de usuário no Supabase Auth.
* **FR5**: O sistema deve integrar-se com o Stripe para processar a assinatura.
* **FR6**: O sistema deve permitir que o usuário conecte sua conta Strava via OAuth 2.0.
* **FR7**: O sistema deve receber e processar webhooks do Strava.
* **FR8**: Agentes de IA devem analisar os dados e gerar insights.
* **FR9**: Os insights devem ser enviados via WhatsApp.
* **FR10**: Os dados devem ser armazenados de forma segura no Supabase.
* **FR11**: O sistema deve prover um portal web para gerenciamento de assinatura.
* **FR12**: No portal, o usuário deve poder alterar sua senha.
* **FR13**: No portal, o usuário deve poder excluir sua conta.

#### **Requisitos Não Funcionais (NFR)**
* **NFR1**: O tempo de entrega do insight não deve exceder 3 minutos.
* **NFR2**: Todos os dados sensíveis devem ser criptografados.
* **NFR3**: O portal web deve seguir as melhores práticas de segurança.
* **NFR4**: A taxa de sucesso de processamento de webhooks deve ser > 99%.
* **NFR5**: A arquitetura deve ser otimizada para custos de API.
* **NFR6**: A comunicação da IA de onboarding deve ser humanizada.

---

### **Seção 3: Metas de Design da Interface do Usuário (UI)**
O portal da conta deve ser minimalista, seguro, direto, responsivo e seguir as diretrizes do WCAG 2.1 nível AA, com as seguintes telas: Login, Gerenciamento de Assinatura (redirect para Stripe), Alteração de Senha e Exclusão de Conta.

---

### **Seção 4: Premissas Técnicas**
* **Repositório**: Monorepo para gerenciar o backend (Python/FastAPI) e o frontend (Next.js).
* **Arquitetura**: Serviço de IA desacoplado (worker) com fila de tarefas (Redis/Celery).
* **Testes**: Cobertura com testes unitários e de integração para o MVP.
* **Deploy**: Uso de Docker e Dokploy.

---

### **Seção 5: Épicos e Histórias de Usuário**

#### **Lista de Épicos**
* **Épico 1: Fundação, Onboarding e Assinatura**
* **Épico 2: Core Loop de Análise de IA**
* **Épico 3: Portal de Conta do Usuário**

---

#### **Detalhes do Épico 1: Fundação, Onboarding e Assinatura**

**História 1.1: Fundação Técnica do Projeto**
* **Como** um desenvolvedor, **eu quero** configurar a estrutura do projeto monorepo com as aplicações de backend (Python/FastAPI) e frontend (Next.js), **para que** tenhamos uma base organizada e pronta para o desenvolvimento.
* **Critérios de Aceitação:**
    1. A estrutura do monorepo com as pastas `apps/servico-ia` e `apps/portal-web` está criada.
    2. O serviço de IA retorna uma resposta "OK" em um endpoint de health check.
    3. A aplicação Next.js exibe uma página inicial simples.
    4. A conexão com o banco de dados Supabase está configurada e funcionando.

**História 1.2: API de Criação de Conta de Usuário**
* **Como** um desenvolvedor, **eu quero** um endpoint de API seguro para criar um novo usuário (com e-mail), **para que** o bot de onboarding possa registrar novos clientes e gerar um link seguro de ativação.
* **Critérios de Aceitação:**
    1. Existe um endpoint `POST /api/users`.
    2. O endpoint recebe um e-mail no corpo da requisição.
    3. Um novo usuário é criado com sucesso no Supabase com status "pendente".
    4. A API gera e retorna um token de ativação único e de curta duração.
    5. O sistema trata adequadamente o erro caso o e-mail já exista.

**História 1.3: Início do Onboarding Conversacional**
* **Como** um novo usuário, **eu quero** iniciar uma conversa no WhatsApp e ser saudado por uma IA que explica o serviço, **para que** eu entenda a proposta de valor.
* **Critérios de Aceitação:**
    1. O sistema responde a uma saudação inicial no WhatsApp.
    2. A IA se apresenta e explica o propósito do serviço.
    3. A comunicação da IA segue um tom humanizado.

**História 1.4: Coleta de E-mail e Envio do Link do Portal**
* **Como** um novo usuário interessado, **eu quero** fornecer meu e-mail na conversa do WhatsApp e receber um link seguro, **para que** eu possa continuar o processo de criação da conta no portal web.
* **Critérios de Aceitação:**
    1. A IA solicita e valida o e-mail do usuário.
    2. A conta do usuário é criada via API com status "pendente".
    3. A IA envia uma mensagem no WhatsApp contendo o link único e seguro para o portal de ativação.

**História 1.5: Criação de Senha no Portal**
* **Como** um novo usuário, **eu quero** clicar no link recebido no WhatsApp e ser levado a uma página segura para criar minha senha definitiva, **para que** minha conta seja ativada.
* **Critérios de Aceitação:**
    1. O link do WhatsApp leva a uma página no portal web que valida o token.
    2. O usuário é solicitado a criar e confirmar sua senha.
    3. Após a criação da senha, o status do usuário no banco de dados é atualizado para "ativo_nao_assinante".

**História 1.6: Conexão com o Strava no Portal**
* **Como** um usuário com conta ativa, **eu quero**, na tela seguinte, ser solicitado a conectar minha conta Strava, **para que** o serviço possa acessar meus dados de treino.
* **Critérios de Aceitação:**
    1. Imediatamente após criar a senha, a página exibe o botão "Conectar com o Strava".
    2. O fluxo de autorização do Strava (OAuth) é concluído dentro do navegador.
    3. Os tokens do Strava são salvos de forma segura, associados à conta do usuário.

**História 1.7: Fluxo de Assinatura no Portal**
* **Como** um usuário com o Strava conectado, **eu quero** ser direcionado para a página de pagamento para realizar a assinatura, **para que** eu possa desbloquear a análise dos meus treinos.
* **Critérios de Aceitação:**
    1. Após a conexão com o Strava, o usuário é levado para a página de checkout do Stripe.
    2. Após a confirmação do pagamento, o status do usuário é atualizado para "assinante_ativo".
    3. O portal exibe uma página final de sucesso.

**História 1.8: Confirmação Final no WhatsApp**
* **Como** um novo assinante, **eu quero** receber uma mensagem final de boas-vindas no WhatsApp, **para que** eu saiba que está tudo pronto.
* **Critérios de Aceitação:**
    1. O pagamento bem-sucedido dispara um evento que envia uma mensagem final para o WhatsApp.
    2. A mensagem confirma que a conta está ativa, o Strava conectado e que a próxima corrida será analisada.

---

#### **Detalhes do Épico 2: Core Loop de Análise de IA**

**História 2.1: Recebimento e Armazenamento de Atividades do Strava**
* **Como** um desenvolvedor, **eu quero** criar um endpoint de webhook para receber novas atividades do Strava e armazená-las de forma segura, **para que** os dados estejam prontos para serem processados pela IA.
* **Critérios de Aceitação:**
    1. Um endpoint `POST /api/webhooks/strava` está funcional e seguro.
    2. O sistema valida a assinatura do webhook para garantir que a requisição veio do Strava.
    3. Os dados JSON da nova atividade são salvos em uma tabela `atividades`.
    4. Após salvar, uma tarefa "analisar_atividade" é adicionada à fila (Redis/Celery).

**História 2.2: Orquestração dos Agentes de IA para Análise de Treino**
* **Como** um desenvolvedor, **eu quero** criar um worker que consome as tarefas da fila e usa o CrewAI, **para que** um insight de texto personalizado seja gerado para cada treino.
* **Critérios de Aceitação:**
    1. Um worker do Celery processa as tarefas da fila "analisar_atividade".
    2. O worker recupera os dados da atividade do Supabase.
    3. Os dados são passados para um fluxo do CrewAI.
    4. O insight de texto gerado é salvo na tabela `atividades`.

**História 2.3: Envio do Insight para o Usuário via WhatsApp**
* **Como** um usuário assinante, **eu quero** receber meu insight de treino personalizado em uma mensagem no WhatsApp, **para que** eu possa entender meu desempenho.
* **Critérios de Aceitação:**
    1. Após o insight ser salvo, uma tarefa "enviar_whatsapp" é disparada.
    2. O sistema recupera o telefone do usuário e o texto do insight.
    3. Uma mensagem formatada é enviada com sucesso via Evolution API.
    4. O sistema registra o status do envio.

---

#### **Detalhes do Épico 3: Portal de Conta do Usuário**

**História 3.1: Estrutura Básica e Roteamento do Portal**
* **Como** um desenvolvedor, **eu quero** configurar a estrutura básica e o sistema de roteamento do portal web Next.js, **para que** tenhamos as páginas prontas.
* **Critérios de Aceitação:**
    1. As rotas `/login`, `/conta` (protegida), `/conta/assinatura`, `/conta/alterar-senha`, `/conta/excluir-conta` estão criadas.
    2. Rotas protegidas redirecionam para `/login` se o usuário não estiver autenticado.

**História 3.2: Implementação do Fluxo de Login**
* **Como** um usuário registrado, **eu quero** poder fazer login no portal web, **para que** eu possa acessar minha conta.
* **Critérios de Aceitação:**
    1. A página `/login` contém um formulário de e-mail e senha.
    2. O formulário autentica o usuário via Supabase Auth.
    3. Em caso de sucesso, o usuário é redirecionado para `/conta`.
    4. Mensagens de erro apropriadas são exibidas em caso de falha.

**História 3.3: Gerenciamento de Assinatura via Stripe**
* **Como** um assinante logado, **eu quero** poder gerenciar minha assinatura, **para que** eu possa cancelar ou atualizar meus dados de pagamento.
* **Critérios de Aceitação:**
    1. A página `/conta/assinatura` exibe o status da assinatura.
    2. Um botão "Gerenciar Assinatura" redireciona o usuário para o portal de cliente do Stripe.

**História 3.4: Alteração de Senha**
* **Como** um usuário logado, **eu quero** poder alterar minha senha, **para que** eu possa manter minha conta segura.
* **Critérios de Aceitação:**
    1. A página `/conta/alterar-senha` contém um formulário para senha atual e nova.
    2. A senha é atualizada com sucesso no Supabase Auth.
    3. O usuário recebe uma notificação de sucesso.

**História 3.5: Exclusão de Conta**
* **Como** um usuário logado, **eu quero** poder excluir permanentemente minha conta, **para que** eu tenha controle sobre minhas informações.
* **Critérios de Aceitação:**
    1. A página `/conta/excluir-conta` explica as consequências da exclusão.
    2. Um passo extra de confirmação é exigido.
    3. A conta e os dados associados são removidos ou anonimizados.

---