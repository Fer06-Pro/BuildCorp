# BuildCorp — configuração final (Firebase e GitHub Pages)

Esta versão reúne os ajustes para computador e celular e deixa o portal pronto para **configuração** do Firebase. **O Firebase ainda não está conectado**: é necessário criar um projeto Firebase BuildCorp e copiar a configuração real.

## 1) Abrir o site

Abra esta pasta (a que contém `index.html`) no VS Code e use Live Server. Não abra os arquivos usando `file://`.

## 2) Configurar Firebase

1. No Firebase Console, crie **outro projeto**, exclusivo da BuildCorp (não reutilize o do Prime Bistro).
2. Em Configurações do projeto > Seus apps, registre um aplicativo **Web**. É possível escolher a instalação por **tag `<script>`**, mas não cole a própria tag no arquivo JavaScript.
3. Em `js/firebase-config.js`, substitua os valores vazios do objeto `firebaseConfig` pelos dados fornecidos no console. Mantenha `export const firebaseConfig = {...}`. Os campos `apiKey`, `authDomain`, `projectId` e `appId` são obrigatórios nesta implementação; outros campos públicos do mesmo objeto podem ser adicionados se aparecerem no console.
4. Em Authentication > Sign-in method, habilite **E-mail/Senha**.
5. Em Cloud Firestore, crie um banco **(default)** na região desejada, iniciando em modo de produção.
6. Na aba **Regras** do Firestore, substitua o conteúdo do editor por **todo** o conteúdo de `firebase/firestore.rules` e clique em **Publicar**.
7. Em Authentication > Configurações > Domínios autorizados, confira os domínios que usará para login, especialmente `localhost` no desenvolvimento e `fer06-pro.github.io` para publicação (se utilizar esse domínio).

Não inclua chaves privadas, senhas de administrador ou arquivos de service account no GitHub. A configuração **Web** do Firebase é pública; a proteção dos dados deve depender de Authentication e das regras do Firestore.

## 3) Testar

- Crie uma conta no `portal.html` e entre nela.
- Salve um projeto em `index.html`: deve alternar o coração sem mudar de página.
- Volte ao `portal.html`: o projeto deve estar listado. Salve uma nota e recarregue.
- Saia e entre com outra conta: favoritos e notas não devem ser compartilhados.
- Confira o botão **Entrar / Minha conta** e o idioma PT/EN no computador e no celular.

## 4) GitHub Pages — evitar 404

O ZIP está preparado com **`index.html` na raiz**, junto das pastas `css`, `images`, `js` e `firebase`. No repositório, envie **esses arquivos diretamente na raiz** (não coloque uma pasta `BuildCorp` por cima). Em **Settings > Pages**, use a branch `main` e pasta `/(root)`.

## Limites da demonstração

O simulador é ilustrativo. O formulário de contato **não envia mensagens**. A aplicação salva favoritos e notas por conta, mas não gerencia obras ou contratos reais.
