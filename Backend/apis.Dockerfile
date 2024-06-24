# Usar una imagen base de Python
FROM python:3.8-slim

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de requisitos primero para aprovechar la caché de capas de Docker
COPY Dependencias.txt .

# Instalar las dependencias de la aplicación
RUN pip install --no-cache-dir -r Dependencias.txt

# Copiar el resto del código de la aplicación al directorio de trabajo
COPY apis.py /app/

# Establecer la variable de entorno FLASK_APP
ENV FLASK_APP=apis.py

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 4000

# Comando para ejecutar la aplicación
CMD ["flask", "run", "--host=0.0.0.0", "--port=4000"]
