# Twitter Clone

Projeto full stack desenvolvido com Django REST Framework no back-end e React no front-end.

O objetivo do projeto é simular uma rede social inspirada no Twitter/X, permitindo cadastro de usuários, autenticação, publicação de posts, seguidores, curtidas e comentários.

## Tecnologias utilizadas

## Deploy

### Back-end

https://twiter-clone-dthx.onrender.com

### Front-end

https://twiter-clone-smoky.vercel.app

### Back-end
- Python
- Django
- Django REST Framework
- Simple JWT
- django-cors-headers
- SQLite
- Poetry

### Front-end
- React
- Vite
- Axios
- React Router DOM
- CSS

## Funcionalidades

- Cadastro de usuário
- Login com JWT
- Refresh automático do token
- Logout
- Proteção de rotas
- Visualização e edição de perfil
- Alteração de senha
- Seguir usuários
- Deixar de seguir usuários
- Lista de seguidores
- Lista de usuários seguidos
- Criar posts
- Editar posts
- Excluir posts
- Feed com posts dos usuários seguidos
- Curtir posts
- Remover curtida
- Criar comentários
- Visualizar comentários

## Estrutura do projeto

```text
twitter-clone/
├── backend/
│   ├── accounts/
│   ├── interactions/
│   ├── posts/
│   ├── config/
│   ├── manage.py
│   ├── poetry.lock
│   └── pyproject.toml
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── services/
    ├── package.json
    └── vite.config.js