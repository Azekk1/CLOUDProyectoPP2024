# Usar una imagen base de Node.js para construir la aplicación
FROM node:18 as build


# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package.json package-lock.json ./


# Instalar las dependencias
RUN npm install react

RUN npm install @tanstack/react-table

RUN npm install jsonwebtoken

RUN npm install rollup
# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que la aplicación de desarrollo se ejecutará
EXPOSE 5173

# Comando para ejecutar la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]
