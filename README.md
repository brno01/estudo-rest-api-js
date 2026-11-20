# Naja API

[![ci](https://github.com/brno01/estudo-rest-api-js/actions/workflows/ci.yml/badge.svg)](https://github.com/brno01/estudo-rest-api-js/actions/workflows/ci.yml)
[![security](https://github.com/brno01/estudo-rest-api-js/actions/workflows/security.yml/badge.svg)](https://github.com/brno01/estudo-rest-api-js/actions/workflows/security.yml)
[![licença: Apache-2.0](https://img.shields.io/badge/licen%C3%A7a-Apache--2.0-blue.svg)](LICENSE)

API REST de estudo, em Node.js, Express e MySQL, feita em 2022: cadastro de usuários com login por JWT, categorias, produtos (com upload de imagem), clientes e pedidos.

Autor: Bruno Santos de Oliveira.

## Estado
Projeto de estudo, parado desde 2022. O banco de dados que ele usava foi desativado, então a API não roda sem um MySQL novo criado a partir dos scripts em `model/`. Não há testes.

## Requisitos e instalação
- Node.js 20 ou mais novo.
- Um MySQL ou MariaDB com o esquema de `model/`.

```bash
npm ci
```

## Configuração
As variáveis vêm do ambiente (ou de um `.env`, lido pelo `dotenv`), nunca do repositório:

| Variável | Para que serve |
|---|---|
| `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` | Conexão com o banco (`database/mysql.js`). |
| `JWT_KEY` | Segredo de assinatura dos tokens de login. |

## Uso
```bash
npm start   # sobe com nodemon a partir de server.js
```

Rotas, montadas em `app.js`:

| Rota | Arquivo |
|---|---|
| `/users` | `routes/users.js` (cadastro e login) |
| `/categories` | `routes/categories.js` |
| `/products` | `routes/products.js` |
| `/clients` | `routes/clients.js` |
| `/requests` | `routes/requests.js` |

As coleções do Postman em `Collection's Naja/` mostram exemplos de chamadas.

## Verificações e CI
Não há testes. No GitHub, todo PR e todo push na `main` rodam dois workflows:
- `ci`: instala as dependências, confere a sintaxe de todos os arquivos `.js` e que os módulos carregam.
- `security`: segredos, dependências vulneráveis, análise estática e os próprios workflows. Uma falha na `main` abre uma issue `security-scan`.

O `claude` é o revisor sob demanda: comentar `@claude` num PR ou numa issue, ou rodar o workflow à mão para uma auditoria que abre issues. Só o dono do repositório consegue acioná-lo.

## Estrutura
- `server.js`, `app.js`: ponto de entrada e aplicação Express.
- `routes/`, `controllers/`: rotas e regras de cada recurso.
- `middleware/auth.js`: validação do JWT.
- `database/mysql.js`: conexão com o banco.
- `model/`: scripts SQL e modelos do MySQL Workbench.
- `Collection's Naja/`: coleções do Postman.

## Segurança
- As rotas não têm limite de requisições (o CodeQL aponta isso em 22 pontos). Como a API não está no ar, ficou como está.
- Relate vulnerabilidades pela aba **Security** (**Report a vulnerability**), não por issue pública.

## Licença
[Apache-2.0](LICENSE)
