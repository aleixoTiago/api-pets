# imagem base
FROM node:18-alpine

# cria pasta dentro do container
WORKDIR /app

# copia package.json e package-lock.json
COPY package*.json ./

# instala dependências
RUN npm install

# copia o restante do projeto
COPY . .

# expõe a porta da tua API
EXPOSE 3000

# comando para iniciar o servidor
CMD ["npm", "start"]
