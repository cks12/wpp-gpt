# Define a imagem base do node
FROM node:18

# Define as variáveis ​​de ambiente
ENV DEBIAN_FRONTEND=noninteractive
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Instala o Chromium
RUN apt-get update && \
    apt-get install -y chromium && \
    rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários
COPY package*.json ./
COPY tsconfig*.json ./
COPY src/ src/

# Instala as dependências do projeto
RUN npm install --silent

# Compila o código TypeScript
RUN npm run build

# Expor a porta do servidor
EXPOSE 3000

# Inicializa o servidor
CMD ["npm", "run", "start"]