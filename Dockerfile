# Etapa 1: Build da aplicação
FROM node:16 AS builder

# Definindo diretório de trabalho
WORKDIR /usr/src/app

# Argumento de build para o contexto
ARG CONTEXT=.

# Copiando package.json e package-lock.json para instalar todas as dependências
COPY ${CONTEXT}/package.json ${CONTEXT}/package-lock.json ./

# Instalando todas as dependências (produção e desenvolvimento)
RUN npm install

# Copiando o restante dos arquivos para a etapa de build
COPY ${CONTEXT} .

# Compilando TypeScript para JavaScript
RUN npm run build

# Etapa 2: Container final para produção
FROM node:16

# Definindo diretório de trabalho
WORKDIR /usr/src/app

# Copiando apenas as dependências de produção do builder
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copiando apenas o código compilado
COPY --from=builder /usr/src/app/dist ./dist

# Expondo a porta da API
EXPOSE 3000

# Definindo a variável NODE_ENV como production
ENV NODE_ENV=production

# Comando para rodar a aplicação
CMD ["node", "dist/server.js"]
