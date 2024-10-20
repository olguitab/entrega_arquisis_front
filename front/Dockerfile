# Dockerfile
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copia el código de la aplicación al contenedor
COPY . .

# Expone el puerto que utiliza la aplicación
EXPOSE 4000

# Comando para ejecutar la aplicación en modo desarrollo
CMD ["npm", "start"]
