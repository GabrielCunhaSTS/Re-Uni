# 🏠 ReUni

> **Plataforma inteligente para busca, divulgação e gerenciamento de moradias estudantis.**

O **ReUni** é uma plataforma web desenvolvida para facilitar a busca por **repúblicas e moradias estudantis**, conectando estudantes a anunciantes em um ambiente moderno, seguro, intuitivo e organizado.

O projeto foi construído com uma arquitetura moderna, utilizando **Next.js e TypeScript no frontend** e uma **API REST em Node.js e TypeScript no backend**, com persistência de dados em **MySQL** através do Sequelize ORM.

---

## 📖 Sobre o projeto

Encontrar uma moradia estudantil pode envolver diversas plataformas, anúncios desorganizados, falta de segurança e grande dificuldade para comparar diferentes opções ou gerenciar o dia a dia da república.

O **ReUni** soluciona esse problema centralizando todas as informações e interações em uma única plataforma. Estudantes podem pesquisar moradias, visualizar detalhes dos anúncios, salvar favoritos, enviar comprovantes de pagamento, negociar via chat e acompanhar chamados de manutenção e avisos em tempo real.

Para os anunciantes, o sistema oferece recursos completos para criação e gerenciamento de imóveis, painel financeiro, acompanhamento de solicitações de aluguel e controle de manutenções.

---

## 🔒 Conformidade, LGPD e Segurança

Como a plataforma lida com dados sensíveis de estudantes e proprietários, o **ReUni** incorpora diretrizes estritas de *Compliance* e Segurança:

* **Conformidade com a LGPD (Lei nº 13.709/18)**: Tratamento de dados fundamentado em bases legais claras, minimização de dados e direito ao esquecimento/exclusão de contas. Os documentos sensíveis possuem políticas estritas de retenção e criptografia.
* **Checagem de Vínculo e Segurança**: Restrição de áreas operacionais internas (como o mural de manutenção) exclusivamente a usuários com contrato de aluguel `ativo` ou `aprovado`.
* **Validação de Perfis**: Protocolos para verificação de comprovantes de matrícula e checagem de antecedentes criminais de ambas as partes, assegurando um ambiente residencial confiável e livre de fraudes.

---

## 🎯 Objetivos

* Facilitar a busca e a seleção de moradias estudantis;
* Centralizar anúncios de repúblicas em uma única solução tecnológica;
* Oferecer canais de comunicação integrados (chat, mensagens e mural de manutenções);
* Gerenciar aspectos financeiros e envio de comprovantes com rastreabilidade;
* Garantir segurança jurídica e residencial através de validação de antecedentes e conformidade com a LGPD;
* Aplicar conceitos avançados de desenvolvimento Full Stack em uma aplicação real e escalável.

---

## ✨ Funcionalidades

### 👤 Usuários e Autenticação (`authService`, `usuarioService`)
* Cadastro e login de usuários com autenticação segura via JWT;
* Gerenciamento de sessão e perfil do usuário;
* Edição de informações pessoais e configurações da conta.

### 🏠 Moradias e Anúncios (`republicaService`, `republicaFiltroService`, `imagemService`)
* Cadastro, edição e exclusão de repúblicas e anúncios;
* Visualização detalhada das moradias com informações sobre localização e características;
* Upload e gerenciamento de imagens dos imóveis;
* Filtros de pesquisa avançados e listagem dinâmica.

### 💰 Aluguéis e Financeiro (`aluguelService`, `comprovanteService`, `dashboardFinanceiroService`)
* Solicitação e acompanhamento de aluguéis;
* Envio e validação de comprovantes de pagamento;
* Dashboard financeiro para acompanhamento de receitas e status de locação.

### 🛠️ Manutenção e Avisos (`manutencaoService`)
* Abertura de chamados de reparo, avisos gerais ou ocorrências urgentes (exclusivo para moradores com vínculo/aluguel ativo);
* Mural de avisos e manutenções visível para os moradores da república;
* Painel do anunciante para atualização de status dos chamados (*Pendente*, *Em Andamento*, *Concluído*).

### 🔔 Notificações e Mensagens (`notificacaoService`, `mensagemService`)
* Sistema de notificações automáticas integrado para alertar anunciantes e estudantes sobre novos chamados e atualizações;
* Central de mensagens e chat interno para comunicação direta entre usuários.

### 💬 Interação e Avaliações (`comentarioService`, `respostaComentarioService`, `avaliacaoService`, `favoritoService`)
* Sistema de favoritos para salvar moradias de interesse;
* Comentários em anúncios e respostas encadeadas;
* Avaliações detalhadas das repúblicas.

### 🎨 Interface
* Design responsivo e interface moderna construída com componentes React;
* Feedback visual para ações do usuário (via `sonner`);
* Formulários estruturados com validação robusta de dados.

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
| **MySQL**           | Banco de dados relacional        |
| **JWT**             | Autenticação                     |
| **bcrypt**          | Criptografia de senhas           |
| **Multer**          | Upload de arquivos               |
| **Zod**             | Validação de dados               |
| **Helmet**          | Segurança HTTP                   |
| **CORS**            | Controle de acesso entre origens |
| **Swagger/OpenAPI** | Documentação da API              |

---

# 🏗️ Arquitetura

O projeto adota uma arquitetura desacoplada, dividida em duas aplicações principais:

```text
ReUni
│
├── Frontend (Next.js App Router)
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── types/
│
└── Backend (Node.js / Express API)
    └── src/
        ├── config/
        ├── controllers/
        ├── middlewares/
        ├── models/
        ├── routes/
        ├── services/ 
        ├── validators/
        └── server.ts
```

---

# 📂 Estrutura do projeto
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
```
> A estrutura pode sofrer alterações conforme o desenvolvimento e a implementação de novas funcionalidades

---



# 🔐 Segurança e Autenticação



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

/api/respostas

/api/configuracoes

/api/alugueis

/api/dashboard

/api/avaliacoes

/api/notificacoes

/api/mensagens

/api/comprovantes

/api/manutencoes

/api/uploads

```



A API é responsável por:



* Autenticação e controle de sessão;

* Cadastro e gerenciamento de usuários;

* CRUD e filtragem de moradias (repúblicas);

* Gerenciamento de favoritos;

* Comentários e respostas encadeadas;
  
* Avaliações de moradias;

* Configurações da aplicação;

* Gestão de aluguéis e envio de comprovantes;

* Dashboard e métricas financeiras;

* Chamados de manutenção e avisos;

* Sistema de notificações e chat/mensagens internas;
  
* Upload e gerenciamento de arquivos/imagens;

* Validação de dados e comunicação segura com o banco de dados.;





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

