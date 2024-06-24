# Usar una imagen base de Node.js para construir la aplicación de frontend
FROM node:18 as build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo package.json
COPY package.json ./

# Copiar el archivo package-lock.json desde la carpeta de frontend
COPY package-lock.json ./

# Instalar las dependencias de Node.js
RUN npm install --no-cache

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que la aplicación de desarrollo se ejecutará
EXPOSE 5173

# Comando para ejecutar la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]