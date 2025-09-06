# Project Brief: IA Coach para Strava

### **Seção 1: Resumo Executivo**
O projeto visa criar um assistente de corrida pessoal com Inteligência Artificial, integrado ao Strava e com entrega de insights via WhatsApp. A solução resolve o problema de corredores amadores, especialmente iniciantes, que coletam dados de treino pelo Strava mas não possuem o conhecimento para interpretá-los e transformá-los em melhorias de performance. A proposta de valor principal é oferecer análises personalizadas e acionáveis sobre cada treino, entregues de forma conveniente e imediata, ajudando o atleta a entender seu desempenho e a acompanhar sua evolução de forma clara.

### **Seção 2: Declaração do Problema**
Atualmente, corredores amadores utilizam aplicativos como o Strava para registrar suas atividades, o que gera um grande volume de métricas de desempenho (ritmo, cadência, ganho de elevação, zonas de frequência cardíaca, etc.). A principal dor é que, embora ricos em detalhes, esses dados são apresentados de forma crua, sem uma interpretação personalizada. Isso leva a vários pontos de atrito:
* **Sobrecarga de Informação**: Usuários, especialmente iniciantes, sentem-se confusos e sobrecarregados, não sabendo em quais métricas focar para melhorar.
* **Falta de Contexto**: As soluções existentes não contextualizam os dados para o nível de condicionamento ou os objetivos específicos do atleta, oferecendo análises genéricas.
* **Ação Tardia ou Inexistente**: Sem uma orientação clara e imediata, o corredor perde a oportunidade de aplicar aprendizados do treino recém-concluído no seu próximo planejamento.
* **Alto Custo de Alternativas**: As soluções que oferecem análise aprofundada são geralmente plataformas complexas e caras ou o acesso a um treinador humano, que possui um custo elevado e não oferece feedback instantâneo.

### **Seção 3: Solução Proposta**
A solução é um serviço de assinatura que atua como um "treinador de corrida com IA". O fluxo principal é desenhado para ser simples e integrado à rotina do atleta:
1.  **Onboarding Conversacional e Venda**: O usuário inicia a interação no WhatsApp e é recebido por uma IA de onboarding com personalidade humana e especialista em vendas. Ela guiará o usuário, explicará o valor do serviço, quebrará objeções e o conduzirá pelo processo de assinatura e autorização segura com sua conta Strava.
2.  **Análise Automatizada**: Através de um webhook, o sistema detecta automaticamente cada nova atividade de corrida registrada no Strava.
3.  **Inteligência Artificial em Ação**: Um conjunto de agentes de IA (CrewAI) processa os dados brutos da atividade.
4.  **Entrega de Insights (Via Única)**: Após a assinatura, o modelo de interação se torna de via única para o MVP. O usuário recebe uma mensagem no WhatsApp com um resumo claro e personalizado.

### **Seção 4: Usuários-Alvo**
**Usuário Primário: "O Corredor Amador Conectado"**
* **Perfil**: Homens e mulheres, 25-45 anos, digitalmente letrados, com smartwatch e usuários ativos do Strava.
* **Nível de Corrida**: Iniciante a intermediário.
* **Dores**: Confusão com a quantidade de dados, frustração com a estagnação do progresso e falta de acesso a orientação de qualidade e baixo custo.
* **Objetivos**: Melhorar o desempenho (velocidade, distância) e correr de forma consistente e livre de lesões.

### **Seção 5: Metas e Métricas de Sucesso**
* **Objetivos de Negócio**: Atingir 100 assinantes e R$ 990,00 de MRR nos primeiros 3 meses; validar a arquitetura técnica com 99% de sucesso no processamento de webhooks.
* **Métricas de Sucesso do Usuário**: Engajamento > 70% (leitura das mensagens), Retenção com Churn < 15% ao mês.
* **KPIs**: Taxa de Conversão no onboarding (>10%), Tempo de entrega do insight (< 3 min).

### **Seção 6: Escopo do MVP**
* **Dentro do Escopo**: Onboarding conversacional com venda, Criação de conta de usuário (Supabase Auth), Assinatura via Stripe, Autenticação Strava, Análise de treino individual, Envio de insight via WhatsApp, Portal de Conta web mínimo (gerenciar assinatura, senha, etc.).
* **Fora do Escopo**: Interação contínua com a IA, análise de tendências de longo prazo, sugestão de treinos, dashboard web completo, outros esportes.

### **Seção 7: Considerações Técnicas**
* **Plataformas**: WhatsApp (via Evolution API) e um Web App mínimo para o portal da conta.
* **Tecnologias**: Backend com Python/FastAPI, Banco/Auth com Supabase, Filas com Redis/Celery, Pagamentos com Stripe, IA com CrewAI, Observabilidade com Sentry.
* **Arquitetura**: Orientada a eventos via webhooks, com processamento assíncrono.

### **Seção 8: Restrições e Premissas**
* **Restrições**: Dependência das APIs de Strava, Evolution API e Stripe. Infraestrutura self-hosted em servidor Oracle Cloud, resultando em baixo custo inicial.
* **Premissas**: Existe público pagante para o preço de R$9,90/mês; os insights da IA serão percebidos como valiosos; o WhatsApp é o canal ideal.

### **Seção 9: Riscos e Questões Abertas**
* **Riscos**: Baixa adoção se o valor não for percebido, dependência crítica de plataformas de terceiros, qualidade dos insights da IA, segurança dos dados.
* **Questões Abertas**: Qual o Custo de Aquisição de Cliente (CAC)? Qual a taxa de conversão real? Como os usuários reagirão à comunicação de via única?