História 1.3: Visualizar o Plano Semanal Completo
Épico: 1 - Visualização do Plano Nutricional
Status: A Fazer
Prioridade: 4 (Importante)

História de Usuário
Como um usuário do aplicativo,
Eu quero ver meu plano de refeições para a semana inteira,
Para que eu possa me planejar e ter uma visão geral da minha dieta.

Critérios de Aceitação
Deve haver um botão ou aba que leve o usuário da visão diária para uma visão semanal.

A tela deve exibir os dias da semana (Segunda a Domingo).

Para cada dia, devem ser listados os nomes das receitas planejadas (ex: "Café: Ovos com Café", "Almoço: Panqueca de Frango").

O usuário deve poder navegar entre as semanas (semana atual, próxima semana).

Clicar em uma refeição na visão semanal deve abrir o mesmo modal de detalhes da História 1.2.

Notas do Arquiteto
Esta história exigirá uma SELECT na tabela plan_meals que busca todas as refeições para um user_meal_plan_id específico, e o front-end será responsável por agrupar os resultados por day_of_week.