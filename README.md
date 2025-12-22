# Pet API

API REST para o aplicativo pet-neighborhood, construída com Node.js, Express e PostgreSQL. 
 
## Tecnologias
- Node.js
- Express
- PostgreSQL
- Docker & Docker Compose
- bcrypt
- JWT

## Pré-requisitos
- Docker
- Docker Compose
- Node.js (opcional, se rodar sem Docker)

## Como rodar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/pet-api.git
   cd pet-api

2. Crie o .env
   PORT=3000
   DB_HOST=postgres
   DB_PORT=5432
   DB_USER=pet_user
   DB_PASSWORD=pet_password
   DB_NAME=pet_api

3. Suba o container
   docker compose up --build

4. Url
   http://localhost:3000

### Endpoints principais
Documentação simples da API:
    
    ```md
    ## 📌 Endpoints
    
    ### Criar usuário
    **POST** `/users`
    
    ```json
    {
      "nome": "João",
      "email": "joao@email.com",
      "senha": "123456"
    }
   
 
