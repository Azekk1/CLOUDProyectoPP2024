# Usa una imagen base de python
FROM python:3.9

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo requirements.txt
COPY requirements.txt .

# Instala las dependencias
RUN pip install -r requirements.txt

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto 5000
EXPOSE 5000

# Inicia la aplicación
CMD ["python","app.py"]
