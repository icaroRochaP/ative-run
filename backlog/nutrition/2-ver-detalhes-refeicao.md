História 1.2: Ver os Detalhes Completos de uma Refeição
Épico: 1 - Visualização do Plano Nutricional
Status: A Fazer
Prioridade: 2 (Essencial)

História de Usuário
Como um usuário do aplicativo,
Eu quero clicar em uma refeição do meu plano diário para ver todos os seus detalhes,
Para que eu saiba exatamente quais ingredientes usar e como prepará-la.

Critérios de Aceitação
Quando o usuário clica em qualquer card de refeição da tela de resumo, um modal ou uma nova tela de "Detalhes" deve ser aberta.

A tela de detalhes deve exibir o nome da receita e os macros totais (Calorias, Proteína, Carboidratos, Gordura), confirmando as informações do card.

Uma seção "Ingredientes" deve listar todos os alimentos (foods) que compõem a receita.

Para cada ingrediente, deve ser exibida a quantidade e a unidade de medida para o usuário (usando o campo display_unit, ex: "2 ovos", "100g de frango").

Se houver instruções de preparo (recipes.description), elas devem ser exibidas em uma seção "Modo de Preparo".

A tela deve conter um botão "Fechar" para retornar à tela de resumo.

A tela deve conter um botão "Marcar como Consumido" ("Mark as Eaten").

Notas do Arquiteto
Esta história foca em buscar os dados detalhados de uma única receita usando o recipe_id que você já obteve na história anterior.

Tabelas Envolvidas:

recipes: A consulta principal será nesta tabela, filtrando pelo id da receita.

recipe_ingredients: Sua query deve aninhar os resultados desta tabela para listar os ingredientes.

foods: Dentro da consulta de recipe_ingredients, você deve aninhar os dados da tabela foods para obter o nome e os macros de cada ingrediente.

Query Exemplo (Conceitual): A sua chamada à API do Supabase será parecida com:
supabase.from('recipes').select('name, description, recipe_ingredients(*, foods(*))').eq('id', recipeId)