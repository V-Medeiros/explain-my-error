const errorInput = document.querySelector("#errorInput");
const contextSelect = document.querySelector("#contextSelect");
const analyzeButton = document.querySelector("#analyzeButton");
const clearButton = document.querySelector("#clearButton");
const statusText = document.querySelector("#statusText");
const exampleGrid = document.querySelector("#exampleGrid");
const emptyState = document.querySelector("#emptyState");
const resultContent = document.querySelector("#resultContent");
const matchLabel = document.querySelector("#matchLabel");
const resultTitle = document.querySelector("#resultTitle");
const confidenceBadge = document.querySelector("#confidenceBadge");
const explanationText = document.querySelector("#explanationText");
const causesList = document.querySelector("#causesList");
const stepsList = document.querySelector("#stepsList");
const checklistList = document.querySelector("#checklistList");

const examples = [
  {
    label: "JavaScript",
    context: "javascript",
    message: "TypeError: Cannot read properties of undefined (reading 'map')",
  },
  {
    label: "Python",
    context: "python",
    message: "ModuleNotFoundError: No module named 'requests'",
  },
  {
    label: "React",
    context: "react",
    message: "Warning: Each child in a list should have a unique \"key\" prop.",
  },
  {
    label: "Node",
    context: "node",
    message: "Error: listen EADDRINUSE: address already in use :::3000",
  },
  {
    label: "Git",
    context: "git",
    message: "fatal: refusing to merge unrelated histories",
  },
];

const patterns = [
  {
    id: "js-undefined-property",
    context: "javascript",
    title: "Valor undefined usado como objeto",
    keywords: [/cannot read propert(y|ies) of undefined/i, /undefined is not an object/i],
    explanation:
      "Seu código tentou acessar uma propriedade ou método em um valor que ainda não existe. O erro costuma aparecer quando dados assíncronos não chegaram, uma variável foi inicializada como undefined ou um caminho de objeto está errado.",
    causes: [
      "A resposta de uma API ainda está carregando quando o render ou a função executa.",
      "O nome da propriedade não bate com o objeto real recebido.",
      "Uma função retornou undefined em vez de array, objeto ou string.",
    ],
    steps: [
      "Encontre no stack trace a linha exata que lê a propriedade citada no erro.",
      "Faça log do valor imediatamente antes do acesso para confirmar se ele existe.",
      "Inicialize o valor com um padrão seguro, como array vazio ou objeto vazio, quando fizer sentido.",
      "Use optional chaining apenas quando o caso ausente for esperado, por exemplo data?.items?.map.",
    ],
    checklist: [
      "Verifique o formato real do dado no console.",
      "Confirme se promessas e fetches foram aguardados.",
      "Teste o fluxo com dados vazios, nulos e completos.",
      "Leia a primeira linha do stack trace que aponta para arquivo do seu projeto.",
    ],
  },
  {
    id: "python-module-not-found",
    context: "python",
    title: "Pacote Python não encontrado",
    keywords: [/modulenotfounderror/i, /no module named/i, /importerror/i],
    explanation:
      "O interpretador Python não encontrou o módulo importado no ambiente que está executando o programa. Quase sempre é diferença entre ambiente virtual, instalação ausente ou nome de pacote incorreto.",
    causes: [
      "O pacote não foi instalado no ambiente ativo.",
      "O terminal usa um Python diferente do editor ou da IDE.",
      "O nome usado no import não é o mesmo nome usado para instalar o pacote.",
    ],
    steps: [
      "Rode python --version e pip --version no mesmo terminal usado para iniciar o app.",
      "Instale o pacote no ambiente ativo com python -m pip install nome-do-pacote.",
      "Ative o virtualenv correto antes de executar o script.",
      "Se for módulo local, confirme se há __init__.py quando o pacote exigir e se você está rodando da pasta certa.",
    ],
    checklist: [
      "Ambiente virtual aparece no prompt.",
      "pip list mostra o pacote esperado.",
      "O arquivo não tem o mesmo nome do pacote importado.",
      "A configuração da IDE aponta para o mesmo interpretador.",
    ],
  },
  {
    id: "react-key-prop",
    context: "react",
    title: "Itens de lista sem key estável",
    keywords: [/unique "key" prop/i, /unique key prop/i, /each child in a list/i],
    explanation:
      "O React precisa de uma key única e estável para identificar cada item renderizado em uma lista. Sem isso, ele pode reaproveitar componentes de forma incorreta e mostrar estado visual trocado.",
    causes: [
      "Um .map renderiza elementos sem a propriedade key.",
      "A key usa índice do array em uma lista que pode ser reordenada ou filtrada.",
      "Dois itens diferentes recebem o mesmo identificador.",
    ],
    steps: [
      "Localize o .map ou array de componentes citado no aviso.",
      "Adicione key no primeiro elemento retornado por cada iteração.",
      "Prefira um id real vindo dos dados, como user.id ou task.slug.",
      "Evite index como key quando a lista muda de ordem, recebe filtros ou permite remoção.",
    ],
    checklist: [
      "Toda renderização em loop tem key.",
      "A key fica no elemento mais externo retornado pelo map.",
      "A key não muda a cada render, como Math.random().",
      "Não há ids duplicados na lista.",
    ],
  },
  {
    id: "node-port-in-use",
    context: "node",
    title: "Porta já ocupada",
    keywords: [/eaddrinuse/i, /address already in use/i, /listen.*3000/i],
    explanation:
      "O Node tentou iniciar um servidor em uma porta que já está sendo usada por outro processo. Isso acontece quando um servidor antigo continua rodando ou outro app usa a mesma porta.",
    causes: [
      "Uma instância anterior do servidor ficou aberta.",
      "Outro projeto está rodando na mesma porta.",
      "O watcher reiniciou o app antes de liberar o processo antigo.",
    ],
    steps: [
      "Pare o terminal antigo com Ctrl+C se ele ainda estiver aberto.",
      "Procure o processo que usa a porta e finalize apenas esse processo.",
      "Altere a porta do app com variável de ambiente ou configuração do servidor.",
      "Reinicie o servidor e confirme no navegador se a porta responde ao app certo.",
    ],
    checklist: [
      "Só existe um servidor do projeto rodando.",
      "A porta configurada bate com a URL aberta no navegador.",
      "Docker, Vite, Next ou Express não estão disputando a mesma porta.",
      "O script de dev encerra processos antigos corretamente.",
    ],
  },
  {
    id: "git-unrelated-histories",
    context: "git",
    title: "Históricos Git sem ancestral comum",
    keywords: [/refusing to merge unrelated histories/i, /unrelated histories/i],
    explanation:
      "O Git está tentando juntar dois repositórios ou branches que não compartilham a mesma origem de commits. É comum quando um repositório remoto foi criado com README/license e o projeto local foi iniciado separadamente.",
    causes: [
      "O repositório local e o remoto foram inicializados separadamente.",
      "Você adicionou um remote que aponta para outro projeto.",
      "A branch local não veio de clone ou fetch do mesmo histórico remoto.",
    ],
    steps: [
      "Confirme se o remote está correto com git remote -v.",
      "Se os projetos realmente devem ser unidos, rode git pull origin branch --allow-unrelated-histories.",
      "Resolva conflitos, revise os arquivos combinados e faça commit do merge.",
      "Se o remote estiver errado, troque a URL em vez de forçar o merge.",
    ],
    checklist: [
      "O remote aponta para o repositório certo.",
      "Você entende por que os históricos são diferentes.",
      "Conflitos foram revisados arquivo por arquivo.",
      "Nada sensível entrou no merge por engano.",
    ],
  },
  {
    id: "syntax-error",
    context: "auto",
    title: "Erro de sintaxe",
    keywords: [/syntaxerror/i, /unexpected token/i, /invalid syntax/i],
    explanation:
      "O parser encontrou código escrito fora da gramática esperada da linguagem. Normalmente a causa está na própria linha citada ou poucas linhas antes dela.",
    causes: [
      "Parênteses, chaves, colchetes ou aspas ficaram sem fechar.",
      "Há uma vírgula, dois pontos ou operador no lugar errado.",
      "O arquivo usa recurso de linguagem não suportado pela versão em execução.",
    ],
    steps: [
      "Abra a linha indicada no erro e também as cinco linhas anteriores.",
      "Confira pares de delimitadores e strings quebradas.",
      "Formate o arquivo para revelar blocos desalinhados.",
      "Compare a versão da linguagem/runtime com o recurso usado.",
    ],
    checklist: [
      "Delimitadores estão balanceados.",
      "Strings multilinha estão escritas corretamente.",
      "A linha anterior não ficou incompleta.",
      "O runtime suporta a sintaxe usada.",
    ],
  },
];

function renderExamples() {
  exampleGrid.innerHTML = "";

  examples.forEach((example) => {
    const button = document.createElement("button");
    button.className = "example-card";
    button.type = "button";
    button.innerHTML = `<strong>${example.label}</strong><span>${escapeHtml(example.message)}</span>`;
    button.addEventListener("click", () => {
      contextSelect.value = example.context;
      errorInput.value = example.message;
      analyzeError();
    });
    exampleGrid.appendChild(button);
  });
}

function analyzeError() {
  const rawMessage = errorInput.value.trim();

  if (!rawMessage) {
    showEmpty("Cole uma mensagem de erro para analisar.");
    return;
  }

  const selectedContext = contextSelect.value;
  const match = findBestMatch(rawMessage, selectedContext);
  const result = match.pattern || buildFallback(selectedContext);

  renderResult(result, match.score, selectedContext);
}

function findBestMatch(message, selectedContext) {
  const normalized = message.toLowerCase();
  let best = { pattern: null, score: 0 };

  patterns.forEach((pattern) => {
    const contextBoost =
      selectedContext === "auto" || pattern.context === "auto" || pattern.context === selectedContext ? 25 : 0;
    const keywordScore = pattern.keywords.reduce((score, keyword) => {
      return score + (keyword.test(normalized) ? 45 : 0);
    }, 0);
    const contextMention = pattern.context !== "auto" && normalized.includes(pattern.context) ? 10 : 0;
    const score = Math.min(98, contextBoost + keywordScore + contextMention);

    if (score > best.score) {
      best = { pattern, score };
    }
  });

  return best.score >= 45 ? best : { pattern: null, score: 32 };
}

function buildFallback(selectedContext) {
  const readableContext = selectedContext === "auto" ? "o contexto informado" : selectedContext;

  return {
    context: selectedContext,
    title: "Padrão específico não identificado",
    explanation:
      "Não encontrei uma assinatura conhecida nessa mensagem, mas ainda dá para depurar de forma metódica. Trate a primeira linha como o sintoma e o stack trace como o mapa até a causa.",
    causes: [
      `O erro pode depender de configuração, versão ou estado de execução em ${readableContext}.`,
      "A mensagem pode estar incompleta ou sem a parte do stack trace que aponta para o arquivo real.",
      "Pode ser uma combinação de entrada inválida, dependência ausente ou ordem incorreta de execução.",
    ],
    steps: [
      "Copie a primeira linha do erro e identifique o tipo, como TypeError, SyntaxError ou fatal.",
      "Procure a primeira referência a um arquivo do seu projeto no stack trace.",
      "Reproduza o problema com o menor trecho de código ou comando possível.",
      "Verifique versões, variáveis de ambiente, dependências instaladas e arquivos recém-alterados.",
    ],
    checklist: [
      "A mensagem completa foi colada, incluindo stack trace.",
      "O comando usado para reproduzir o erro é conhecido.",
      "Dependências foram instaladas depois da última alteração.",
      "A linha apontada pelo erro foi conferida junto com o contexto anterior.",
    ],
  };
}

function renderResult(result, score, selectedContext) {
  emptyState.classList.add("hidden");
  resultContent.classList.remove("hidden");
  resultTitle.textContent = result.title;
  explanationText.textContent = result.explanation;
  confidenceBadge.textContent = `${score}%`;
  matchLabel.textContent = `${formatContext(result.context, selectedContext)} · análise por padrões`;
  fillList(causesList, result.causes);
  fillList(stepsList, result.steps);
  fillList(checklistList, result.checklist);
  statusText.textContent = score >= 70 ? "Padrão encontrado com boa confiança." : "Análise genérica pronta.";
}

function fillList(list, items) {
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function showEmpty(message) {
  resultContent.classList.add("hidden");
  emptyState.classList.remove("hidden");
  matchLabel.textContent = "Sem análise";
  resultTitle.textContent = "Cole um erro para começar";
  confidenceBadge.textContent = "0%";
  statusText.textContent = message;
}

function clearAll() {
  errorInput.value = "";
  contextSelect.value = "auto";
  showEmpty("Pronto para analisar.");
  errorInput.focus();
}

function formatContext(resultContext, selectedContext) {
  const context = resultContext === "auto" ? selectedContext : resultContext;
  return context === "auto" ? "Geral" : context[0].toUpperCase() + context.slice(1);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

analyzeButton.addEventListener("click", analyzeError);
clearButton.addEventListener("click", clearAll);
errorInput.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    analyzeError();
  }
});

renderExamples();
