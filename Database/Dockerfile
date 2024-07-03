# Usa la imagen base de MySQL
FROM mysql:8.0

# Definir variables de entorno para configurar la base de datos
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=login
ENV MYSQL_USER=myuser
ENV MYSQL_PASSWORD=mypassword

# Copiar el archivo SQL a la carpeta /docker-entrypoint-initdb.d/ dentro del contenedor
# MySQL automáticamente ejecutará archivos SQL en esa carpeta al iniciar
COPY login.sql /docker-entrypoint-initdb.d/

# Exponer el puerto 3307 para MySQL
EXPOSE 3306

# Comando para iniciar el servidor MySQL al iniciar el contenedor
CMD ["mysqld"]
