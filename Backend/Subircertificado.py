from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import os
import uuid
from datetime import datetime
from validacion import validar_certificado

app = Flask(__name__)
CORS(app)

# Configuración de la conexión a la base de datos MySQL
db_connection = pymysql.connect(
    host='localhost',
    port=3307,
    user='myuser',
    password='mypassword',
    database='login'
)


# Función para obtener el ID del certificado desde la base de datos
def obtener_id_certificado(nombre_certificado):
    cursor = db_connection.cursor()
    cursor.execute('SELECT certificate_id FROM certificate WHERE name = %s', (nombre_certificado,))
    certificate_id = cursor.fetchone()
    return certificate_id[0] if certificate_id else None

# Ruta al directorio donde se guardarán los certificados
CERTIFICATES_DIR = 'certificates'

# Verificar si el directorio "certificates" existe, si no, crearlo
if not os.path.exists(CERTIFICATES_DIR):
    os.makedirs(CERTIFICATES_DIR)


# Función para subir un certificado y almacenar información en la base de datos
@app.route('/dashboard', methods=['POST'])
def upload_certificate():
    # Obtener los datos del cuerpo de la solicitud
    user_id = request.form.get('user_id')
    certificate_name = request.form.get('certificate_name')
    certificate_file = request.files['file']
    
    # Verificar si se subió un archivo
    if not certificate_file:
        return jsonify({'error': 'No file uploaded'}), 400

    # Verificar si se seleccionó un archivo
    if certificate_file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Generar un nombre único para el archivo
    file_name = f"{str(uuid.uuid4())}.pdf"

    # Guardar el archivo en el servidor
    file_path = os.path.join(CERTIFICATES_DIR, file_name)
    certificate_file.save(file_path)

    # Llamada a la función de validación de certificados (debes implementar esta función)
    aprooved = validar_certificado(file_path)  # Retorna True si el certificado es válido, False en caso contrario

    
    # Crear una URL para el archivo
    file_path = f"http://your-server.com/{CERTIFICATES_DIR}/{file_name}"
    
    # Obtener la fecha y hora actual
    current_time = datetime.now()

    # Insertar los datos en la base de datos
    with db_connection.cursor() as cursor:
        # Obtener el ID del certificado basado en el nombre
        certificate_id = obtener_id_certificado(certificate_name)
        
        sql = """
        INSERT INTO user_certificate (user_id, certificate_id, file_url, is_valid, upload_time)
        VALUES (%s, %s, %s, %s, %s)
        """
        # Ejecutar la consulta SQL con los valores correspondientes
        cursor.execute(sql, (user_id, certificate_id, file_path, aprooved, current_time))

        # Obtener el ID del certificado recién insertado
        certificate_id = cursor.lastrowid

        # Confirmar los cambios en la base de datos
        db_connection.commit()

    # Retornar el ID del certificado
    return jsonify({'message': 'Archivo guardado con exito'}), 201


if __name__ == "__main__":
    app.run(port=3000)  # Cambia el puerto a 3000