História 2.1: Marcar uma Refeição como Consumida
Épico: 2 - Registro de Consumo e Adesão ao Plano
Status: A Fazer
Prioridade: 3 (Essencial)

História de Usuário
Como um usuário do aplicativo,
Eu quero marcar uma refeição como "consumida" com um único clique,
Para que eu possa registrar meu progresso e adesão à dieta de forma rápida e fácil.

Critérios de Aceitação
Na tela de "Detalhes da Refeição", ao clicar no botão "Marcar como Consumido", uma nova entrada deve ser criada na tabela meal_consumption_logs.

O registro no log deve conter o user_id, o recipe_id da refeição consumida e a data atual (consumed_at).

Após o registro bem-sucedido, o modal de detalhes deve ser fechado.

Na tela de resumo do dia, a refeição que foi marcada como consumida deve ter uma indicação visual clara de que foi concluída (ex: um ícone de "check", cor de fundo alterada, ou um texto "Consumido").

O sistema deve impedir que a mesma refeição planejada seja marcada como consumida mais de uma vez no mesmo dia.

Notas do Arquiteto
Esta é a nossa primeira história com uma operação de escrita (INSERT).

Tabela Envolvida (Escrita):

meal_consumption_logs: A ação principal é um INSERT nesta tabela. Você irá inserir um novo registro contendo o user_id do usuário logado, o recipe_id da refeição confirmada e a data atual.

Tabelas Envolvidas (Leitura para UI):

Para implementar o Critério de Aceitação #4 (indicação visual), após a inserção, o front-end precisará recarregar os logs do dia (meal_consumption_logs) e compará-los com as refeições planejadas para atualizar a interface.