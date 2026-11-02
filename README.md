# BuildCorp — versão remodelada (portfólio)

Site conceitual de construtora, **não representa uma empresa real**. Os três empreendimentos e os renders SVG são ilustrativos; não há estatísticas, avaliações ou ofertas comerciais inventadas.

## Estrutura

- `index.html`: página premium em azul-escuro com hero, portfólio de 3 conceitos, diferenciais, simulador, comparador, checklist, guia por perfil, FAQ e formulário de contato demonstrativo.
- `portal.html`: login, cadastro, recuperação de senha, salvar projetos e notas pessoais.
- `css/site.css`: visual unificado e responsivo.
- `js/site.js`: menus, PT/EN, abas da central, simulador, FAQ e estado do botão Entrar/Minha conta.
- `js/portal.js`: Auth + Firestore após configuração.
- `js/favorites.js`: salva e remove projetos no Firestore sem sair da página e atualiza o coração.
- `js/firebase-config.js`: configuração pendente do Firebase para **esta aplicação**.
- `images/*.svg`: renders conceituais originais preservados.
- `firebase/firestore.rules`: regras de acesso por UID.

## Como executar

Extraia, abra a pasta no VS Code e use **Live Server**. Confira homepage e `portal.html`, no computador e celular. Troque o idioma usando `EN`/`PT`.

## Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/) e crie um projeto Firebase exclusivo da BuildCorp, separado do Prime.
2. Adicione app **Web** e preencha `js/firebase-config.js` com `apiKey`, `authDomain`, `projectId`, `appId`.
3. Habilite Authentication > E-mail/Senha. Em Authorized domains, autorize sua URL de publicação e `localhost` para desenvolvimento.
4. Ative Firestore, entre em Rules, cole `firebase/firestore.rules` e publique.
5. Teste uma conta: faça login em `portal.html`, volte à página inicial e clique **Salvar projeto**. O botão deve mudar de estado sem redirecionar. Confirme na lista do portal e teste nota, saída, novo login e sincronização no mesmo usuário em outro navegador.
6. Teste com um segundo usuário e confirme que dados da primeira conta ficam inacessíveis.

O portal guarda **projetos salvos e notas**, não contratos, pagamentos, cronogramas reais, arquivos da obra nem comunicações de construtoras. Um portal de acompanhamento real exigirá perfis administrativos controlados no servidor, autorizações e processos adicionais.

## Simulador e formulário

O simulador é **apenas matemático**, com taxa fixa ilustrativa de 0,5% ao mês, sem seguros, tarifas, análise de crédito ou orçamento. Não deve ser anunciado como proposta de financiamento. O formulário de contato exibe aviso e **não envia mensagens** até integração de serviço de envio externo.

## Antes de usar comercialmente

Substitua nome, fotos/ilustrações, descrição de empreendimentos e informações por dados verificados. Caso o site seja usado para um cliente, confirme licenças de imagens e textos, informações regulatórias, política de privacidade, regras de acesso ao banco e funcionamento real dos formulários.

## Verificação efetuada

Estrutura, rotas e scripts conferidos estaticamente. JS validado sintaticamente. **Firebase ao vivo não testado** por faltar configuração real; teste visual automatizado não concluiu neste ambiente, portanto revise desktop/mobile em navegador.

## Atualização visual final — conceito aprovado

- Página inicial refeita para o estilo azul-marinho fotográfico: fachada iluminada, título serifado, quatro benefícios, serviços em cards fotográficos, seção institucional e portfólio ilustrativo.
- Materiais fotográficos locais `*.webp` originados de recortes dos mockups conceituais produzidos para este portfólio. São imagens **demonstrativas**, não fotos de obras da BuildCorp.
- Os três IDs originais (`infinity-tower`, `smart-office`, `eco-resort`) permanecem para a área do cliente e links de salvar favoritos.
- Simulador de financiamento ilustrativo, comparador, checklist, FAQ, PT/EN e contato demonstrativo continuam abaixo das novas seções.
- A seção de reputação está preparada visualmente, mas não afirma avaliações reais nem números de obras fictícios.

A implementação segue a estética da referência, não a geometria exata de um mockup gerado. O visual final deve ser conferido no Live Server em desktop e mobile.

## Ajustes locais para esta versão

- Os três projetos agora usam botões que salvam/removem favoritos diretamente na página inicial, sem redirecionamento, após a configuração do Firebase.
- O botão no cabeçalho mostra **Entrar/Sign in** desconectado e **Minha conta/My account** logado.
- A configuração Web em `js/firebase-config.js` **ainda precisa ser preenchida** com os dados de um projeto Firebase **BuildCorp**, separado do Prime Bistro.
- As regras em `firebase/firestore.rules` devem ser publicadas no console do Firestore; o arquivo no ZIP, por si só, não publica regras.
- O site não possui integração real de formulário de contato ou financiamento; ambos permanecem ilustrativos.


## Ajuste visual responsivo (novembro/2026)

- A faixa de benefícios foi reorganizada para que cada título fique acima de sua descrição, com quatro colunas em telas largas, duas em tablets e uma coluna legível nos celulares.
- A grade de serviços agora utiliza quatro, duas ou uma coluna de acordo com o espaço disponível; os cartões não ficam espremidos no celular.
- O conteúdo principal da capa tem fontes e botões adaptativos para telas estreitas.
- A imagem `images/comercial.webp` foi recortada para remover uma faixa de texto que já fazia parte do arquivo original.
- A configuração Firebase Web **não foi preenchida**, pois depende dos dados fornecidos pelo Firebase Console do projeto BuildCorp. As regras do Firestore também precisam ser publicadas no console.
- O formulário de contato permanece demonstrativo, sem envio real de mensagens; o Firebase implementado aqui serve para autenticação, favoritos e notas.
