# Express Bring me a PDF

> A simple express api that generates PDFs from html
>
> - From urls
> - From html templates using [Handlebars](https://github.com/handlebars-lang/handlebars.js) and json data

> based on https://github.com/codewithabhi17/node-puppeteer

Requirements

- Node ^18.5.0
- NPM ^8.12.1

#

How to run the server

```
npm install
node app.js
```
Foram modificados os arquivos index.js e ajustados os css responsáveis pela tabela.
    - Foram inseridos comportamentos para a tabela nao quebrar, nao sobrescrever e dividir adicionando o table header em cada quebra de página.
    - Também foi feito uma tratativa com os footer, para poder exibir de acordo com o protótipo.
    - Remoção de header custom no arquivo app.js