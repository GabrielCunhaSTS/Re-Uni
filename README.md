# 🏠 ReUni

> **Plataforma inteligente para busca, divulgação e gerenciamento de moradias estudantis.**

O **ReUni** é uma plataforma web desenvolvida para facilitar a busca por **repúblicas e moradias estudantis**, conectando estudantes a anunciantes em um ambiente moderno, intuitivo e organizado.

O projeto foi desenvolvido com uma arquitetura moderna, utilizando **Next.js e TypeScript no frontend** e uma **API REST em Node.js e TypeScript no backend**, com persistência de dados em **MySQL**.

---

## 📖 Sobre o projeto

Encontrar uma moradia estudantil pode envolver diversas plataformas, anúncios desorganizados e dificuldade para comparar diferentes opções.

O **ReUni** busca solucionar esse problema centralizando as informações em uma única plataforma, permitindo que estudantes pesquisem moradias, visualizem detalhes dos anúncios, salvem seus favoritos e interajam com anunciantes.

Para os anunciantes, o sistema oferece recursos para criação e gerenciamento de anúncios, incluindo informações sobre a moradia e imagens.

---

## 🎯 Objetivos

* Facilitar a busca por moradias estudantis;
* Centralizar anúncios de repúblicas em uma única plataforma;
* Permitir filtros e pesquisas para encontrar moradias adequadas;
* Facilitar a divulgação de imóveis por anunciantes;
* Oferecer uma experiência moderna e responsiva;
* Aplicar conceitos de desenvolvimento Full Stack em uma aplicação real;
* Utilizar uma arquitetura organizada e escalável.

---

## ✨ Funcionalidades

### 👤 Usuários

* Cadastro de usuários;
* Login e autenticação;
* Gerenciamento de sessão;
* Perfil do usuário;
* Edição de informações pessoais;
* Sistema de favoritos.

### 🏠 Moradias

* Cadastro de repúblicas;
* Edição de anúncios;
* Exclusão de anúncios;
* Visualização detalhada das moradias;
* Informações sobre localização;
* Informações sobre características da república;
* Upload de imagens;
* Gerenciamento das imagens do anúncio.

### 🔎 Pesquisa

* Busca por moradias;
* Filtros de pesquisa;
* Visualização dos resultados;
* Pesquisa dinâmica;
* Página individual para cada anúncio.

### 💬 Interação

* Comentários em anúncios;
* Respostas aos comentários;
* Sistema de favoritos;
* Visualização de informações do anunciante.

### 🎨 Interface

* Design responsivo;
* Interface moderna;
* Componentização com React;
* Tema claro e escuro;
* Feedback visual para ações do usuário;
* Formulários com validação.

---

# 🛠️ Tecnologias

## Frontend

| Tecnologia          | Utilização                           |
| ------------------- | ------------------------------------ |
| **Next.js**         | Framework principal da aplicação web |
| **React**           | Construção da interface              |
| **TypeScript**      | Tipagem estática                     |
| **Tailwind CSS**    | Estilização                          |
| **shadcn/ui**       | Componentes de interface             |
| **React Hook Form** | Gerenciamento de formulários         |
| **Zod**             | Validação de dados                   |
| **TanStack Query**  | Gerenciamento de requisições e cache |
| **Lucide React**    | Ícones                               |

## Backend

| Tecnologia          | Utilização                       |
| ------------------- | -------------------------------- |
| **Node.js**         | Ambiente de execução             |
| **TypeScript**      | Tipagem estática                 |
| **Express.js**      | Construção da API REST           |
| **Sequelize**       | ORM                              |
| **MySQL**           | Banco de dados                   |
| **JWT**             | Autenticação                     |
| **bcrypt**          | Criptografia de senhas           |
| **Multer**          | Upload de arquivos               |
| **Zod**             | Validação de dados               |
| **Helmet**          | Segurança HTTP                   |
| **CORS**            | Controle de acesso entre origens |
| **Swagger/OpenAPI** | Documentação da API              |

---

# 🏗️ Arquitetura

O projeto é dividido em duas aplicações principais:

```text
ReUni
│
├── Frontend
│   ├── Next.js
│   ├── React
│   ├── TypeScript
│   └── Tailwind CSS
│
└── Backend
    ├── Node.js
    ├── Express
    ├── TypeScript
    ├── Sequelize
    └── MySQL
```

A separação entre frontend e backend permite maior organização, independência entre as aplicações e facilidade para futuras expansões.

---

# 📂 Estrutura do projeto

Uma estrutura simplificada da aplicação:

```text
ReUni/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── types/
│   └── public/
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── validators/
│       └── server.ts
│
├── .gitignore
└── README.md
```

> A estrutura pode sofrer alterações conforme o desenvolvimento e a implementação de novas funcionalidades.

---

# 🔐 Autenticação e segurança

A aplicação utiliza mecanismos de segurança para proteger os dados dos usuários e controlar o acesso aos recursos da API.

Entre os principais recursos estão:

* Autenticação baseada em JWT;
* Cookies HTTP-only;
* Senhas protegidas com `bcrypt`;
* Validação dos dados recebidos pela API;
* Middleware de autenticação;
* Controle de acesso a recursos protegidos;
* Helmet para proteção de headers HTTP;
* Configuração de CORS;
* Variáveis sensíveis armazenadas em `.env`.

---

# 🗄️ Banco de dados

O ReUni utiliza **MySQL** como banco de dados relacional.

O **Sequelize** é utilizado como ORM para facilitar a comunicação entre a API e o banco de dados.

Entre os principais dados administrados pela aplicação estão:

```text
Usuários
   │
   ├── Perfil
   ├── Favoritos
   └── Anúncios
          │
          ├── Localização
          ├── Imagens
          ├── Comentários
          │      └── Respostas
          └── Informações da moradia
```

A modelagem utiliza relacionamentos entre as entidades para manter os dados organizados e reduzir inconsistências.

---

# 🔌 API REST

O backend disponibiliza uma API REST responsável pela comunicação entre o frontend e o banco de dados.

Exemplos de recursos:

```text
/api/auth
/api/users
/api/republicas
/api/favoritos
/api/comentarios
/api/uploads
```

A API é responsável por:

* Autenticação;
* Cadastro e gerenciamento de usuários;
* CRUD de moradias;
* Gerenciamento de favoritos;
* Comentários e respostas;
* Upload de imagens;
* Validação dos dados;
* Comunicação com o banco de dados.

---

# 🧩 Desenvolvimento

Durante o desenvolvimento do ReUni são aplicados conceitos de desenvolvimento de software, como:

* Arquitetura modular;
* Separação de responsabilidades;
* Componentização;
* Tipagem estática;
* API REST;
* ORM;
* CRUD;
* Autenticação;
* Autorização;
* Validação de dados;
* Tratamento de erros;
* Relacionamentos em banco de dados;
* Upload de arquivos;
* Responsividade;
* Boas práticas de organização de código.

---

## 📋 Pré-requisitos

Antes de iniciar, é necessário possuir instalado:

* [Node.js](https://nodejs.org/)
* MySQL
* Git
* npm

---

# 🌐 Fluxo da aplicação

O funcionamento básico da plataforma segue o seguinte fluxo:

```text
              ┌──────────────┐
              │    Usuário   │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │   Next.js    │
              │  Frontend    │
              └──────┬───────┘
                     │
                     │ HTTP / REST
                     ▼
              ┌──────────────┐
              │   Express    │
              │     API      │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │  Sequelize   │
              │     ORM      │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │    MySQL     │
              └──────────────┘
```

---

# 📱 Responsividade

O frontend foi desenvolvido pensando em diferentes tamanhos de tela, permitindo que a plataforma seja utilizada em:

* 💻 Computadores;
* 💻 Notebooks;
* 📱 Smartphones;
* 📱 Tablets.

---

Durante o desenvolvimento, as rotas da API podem ser testadas utilizando ferramentas como:

* Postman;
* Insomnia;
* Swagger.

Exemplo de requisição:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "usuario@email.com",
  "senha": "123456"
}
```

---

# 📈 Próximos passos

Algumas funcionalidades planejadas para evolução do projeto:

* [ ] Sistema avançado de filtros;
* [ ] Melhorias no sistema de busca;
* [ ] Sistema de notificações;
* [ ] Chat entre estudantes e anunciantes;
* [ ] Integração com mapas;
* [ ] Avaliação de moradias;
* [ ] Melhorias de acessibilidade;
* [ ] Testes automatizados;
* [ ] Deploy em produção;
* [ ] Pipeline de CI/CD;
* [ ] Monitoramento da aplicação.

---

# 📊 Status

🚧 **Em desenvolvimento**

O ReUni está em constante evolução e novas funcionalidades estão sendo implementadas ao longo do desenvolvimento.

---

# 👨‍💻 Desenvolvedor

### Gabriel da Cunha Almeida Santos

Desenvolvedor com foco em **desenvolvimento web, backend, APIs e bancos de dados**, utilizando tecnologias modernas para construção de aplicações Full Stack.

### Principais tecnologias

```text
TypeScript • JavaScript • Next.js • React
Node.js • Express • Sequelize • MySQL
HTML • CSS • Tailwind CSS
```

---

# 📄 Licença

Este projeto foi desenvolvido para fins **acadêmicos, de estudo e portfólio**.

---

<div align="center">

### 🏠 ReUni

**Conectando estudantes ao lugar ideal para morar.**

⭐ Desenvolvido com dedicação para transformar uma necessidade real em uma solução tecnológica.

</div>
