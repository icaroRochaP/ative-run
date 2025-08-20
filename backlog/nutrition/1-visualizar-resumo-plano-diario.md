História 1.1: Visualizar o Resumo do Plano do Dia
Épico: 1 - Visualização do Plano Nutricional
Status: A Fazer
Prioridade: 1 (Essencial)

História de Usuário
Como um usuário do aplicativo,
Eu quero ver um resumo de todas as minhas refeições planejadas para o dia atual,
Para que eu possa entender rapidamente o que preciso comer e acompanhar minha dieta.

Critérios de Aceitação
Ao abrir a tela de nutrição, o sistema deve identificar o dia da semana atual.

O sistema deve buscar o plano de refeições ativo do usuário e filtrar as refeições (plan_meals) para o dia da semana atual.

Para cada refeição encontrada (Café da Manhã, Almoço, Jantar), um card deve ser exibido na tela.

Cada card de refeição deve mostrar claramente:

O tipo da refeição (ex: "Breakfast").

O nome da receita (recipe.name).

O total de calorias da receita.

Os macros totais (Proteína, Carboidratos, Gordura) da receita.

Se não houver um plano ativo para o usuário ou refeições para o dia atual, uma mensagem amigável deve ser exibida (ex: "Você ainda não tem um plano de refeições para hoje.").

Notas do Arquiteto
Para implementar esta história, você irá realizar principalmente operações de leitura (SELECT).

Tabelas Envolvidas:

user_meal_plans: Primeiro, você precisa fazer uma SELECT nesta tabela para encontrar o plano ativo (is_active = true) para o user_id atual e obter o id deste plano.

plan_meals: Com o ID do plano ativo, você fará a SELECT principal nesta tabela, filtrando pelo user_meal_plan_id e pelo day_of_week atual (ex: 'quarta-feira').

recipes: A sua consulta em plan_meals deve usar a capacidade do Supabase de aninhar resultados. Você deve incluir os dados da tabela recipes diretamente na sua query para obter o nome da receita.

Cálculo de Macros: Lembre-se que os macros e calorias totais não estão na tabela recipes. Eles precisam ser calculados (via API ou no front-end) somando os valores de cada ingrediente da receita. Para otimização, uma Edge Function no Supabase pode fazer este cálculo e retorná-lo.