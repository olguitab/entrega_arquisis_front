# Dockerfile
FROM node:18

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE  4000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
