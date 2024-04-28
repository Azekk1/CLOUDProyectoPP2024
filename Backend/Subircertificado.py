from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import os
import uuid

app = Flask(__name__)
CORS(app)

# Configuración de la conexión a la base de datos MySQL
db_connection = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    password='login',
    database='login'
)

@app.route('/api/certificates', methods=['POST'])
def upload_certificate():
    # Verificar que el usuario esté autenticado y tenga permisos para subir certificados
    if not request.authorization or not request.authorization.username or not request.authorization.password:
        return jsonify({'error': 'Autenticación requerida'}), 401

    user = get_user(request.authorization.username, request.authorization.password)
    if not user:
        return jsonify({'error': 'Usuario o contraseña inválidos'}), 401

    # Obtener los datos del certificado de la solicitud
    career_id = request.form.get('career_id')
    certificate_id = request.form.get('certificate_id')
    file = request.files.get('file')

    # Verificar que la carrera y el certificado sugerido existan en la base de datos
    if not career_id or not certificate_id or not file:
        return jsonify({'error': 'Datos del certificado inválidos'}), 400

    career = get_career(career_id)
    if not career:
        return jsonify({'error': 'Carrera inválida'}), 400

    certificate = get_certificate(certificate_id)
    if not certificate:
        return jsonify({'error': 'Certificado sugerido inválido'}), 400

    # Guardar el archivo del certificado en el servidor web
    file_path = save_file(file)

    # Crear un nuevo registro en la tabla certificates de la base de datos
    with db_connection.cursor() as cursor:
        cursor.execute(
            'INSERT INTO certificates (career_id, certificate_id, file_path, student_id, status) VALUES (%s, %s, %s, %s, %s)',
            (career_id, certificate_id, file_path, user['id'], 'pendiente')
        )
        db_connection.commit()

    return jsonify({'message': 'Certificado subido con éxito'}), 201

def get_user(username, password):
    # Obtener el usuario de la base de datos
    with db_connection.cursor() as cursor:
        cursor.execute(
            'SELECT * FROM users WHERE user_name = %s AND password = %s',
            (username, password)
        )
        user = cursor.fetchone()
        return user

def get_career(career_id):
    # Obtener la carrera de la base de datos
    with db_connection.cursor() as cursor:
        cursor.execute(
            'SELECT * FROM careers WHERE id = %s',
            (career_id,)
        )
        career = cursor.fetchone()
        return career

def get_certificate(certificate_id):
    # Obtener el certificado sugerido de la base de datos
    with db_connection.cursor() as cursor:
        cursor.execute(
            'SELECT * FROM certificates_suggested WHERE id = %s',
            (certificate_id,)
        )
        certificate = cursor.fetchone()
        return certificate

def save_file(file):
    # Guardar el archivo del certificado en el servidor web
    file_path = f'certificates/{uuid.uuid4()}.{file.filename.split(".")[-1]}'
    file.save(file_path)
    return file_path

if __name__ == '__main__':
    app.run(debug=True)
