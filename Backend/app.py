from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import os
import uuid
from datetime import datetime, timedelta, timezone
import jwt
import fitz  # PyMuPDF
import logging
import time

# Crear un objeto de zona horaria UTC
utc_timezone = timezone.utc

app = Flask(__name__)
app.config['SECRET_KEY'] = 'abcd1234'
CORS(app)

db_host = 'database'  # Nombre del servicio de la base de datos en Docker Compose
db_port = 3306
db_user = 'myuser'
db_password = 'mypassword'
db_name = 'login'

# Función para esperar a que la base de datos esté disponible
def wait_for_db():
    max_retries = 10
    retries = 0
    while retries < max_retries:
        try:
            db_connection = pymysql.connect(
                host=db_host,
                port=db_port,
                user=db_user,
                password=db_password,
                database=db_name,
                ssl={"ssl": {"enabled": True, "verify_identity": False, "ca": "./BaltimoreCyberTrustRoot.crt.pem"}}
            )
            db_connection.close()
            print("Conexión establecida con la base de datos")
            return True
        except pymysql.err.OperationalError as e:
            print(f"Error de conexión a la base de datos: {e}")
            print("Esperando 5 segundos antes de reintentar...")
            time.sleep(5)
            retries += 1
    return False

# Esperar a que la base de datos esté lista antes de iniciar la aplicación
while not wait_for_db():
    print("Esperando a que la base de datos esté lista...")



# Configurar el logger
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/')
def home():
    return 'Backend Proyecto Programación Profesional 2024'

# Loggings
@app.route('/debug')
def debug_route():
    logger.debug("La tabla no tiene datos")
    return "La tabla no tiene datos"

@app.route('/info')
def info_route():
    logger.info("Mostrando tabla de:")
    return "Mostrando tabla de:"

@app.route('/error')
def error_route():
    logger.error("Error al obtener datos")
    return "Error al obtener datos"

# Función para extraer texto de un PDF (mantenida igual)
def extraer_texto_pdf(ruta_pdf):
    texto = ''
    with fitz.open(ruta_pdf) as doc:
        for pagina in doc:
            texto += pagina.get_text()
    return texto

# Función para validar el nombre en el certificado (mantenida igual)
def validar_nombre_certificado(texto_certificado, nombre_estudiante):
    return nombre_estudiante in texto_certificado

# Función para validar si el documento es un certificado (mantenida igual)
def es_certificado_valido(texto_certificado):
    texto_min = texto_certificado.lower()
    palabras_clave = ["aprobado", "approved", "completado", "complete"]
    return any(palabra in texto_min for palabra in palabras_clave)

# Función para validar un certificado completo
def validar_certificado(ruta_pdf, nombre_estudiante):
    texto_certificado = extraer_texto_pdf(ruta_pdf)
    validez = es_certificado_valido(texto_certificado)
    validar_nombre = validar_nombre_certificado(texto_certificado, nombre_estudiante)
    
    # Opcional: Imprimir para verificar resultados
    print(f"Texto del certificado: {texto_certificado}", flush=True)
    print(f"El nombre del estudiante es: {nombre_estudiante}", flush=True)
    print(f"Es válido: {validez}", flush=True)
    print(f"Validación de nombre: {validar_nombre}", flush=True)
    
    if validez and validar_nombre:
        return "aprobado"
    else:
        return "rechazado"

def obtener_nombre_usuario(user_id):
    cursor = db_connection.cursor()
    cursor.execute('SELECT names, lastnames FROM users WHERE user_id = %s', (user_id,))
    user_data = cursor.fetchone()
    cursor.close()
    return f"{user_data[0]} {user_data[1]}" if user_data else None

def obtener_id_certificado(nombre_certificado):
    cursor = db_connection.cursor()
    cursor.execute('SELECT certificate_id FROM certificate WHERE name = %s', (nombre_certificado,))
    certificate_id = cursor.fetchone()
    return certificate_id[0] if certificate_id else None

# Ruta para el login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    cursor = db_connection.cursor()
    cursor.execute('SELECT * FROM users WHERE user_name = %s', (email,))
    user = cursor.fetchone()
    print(f"Nombre usuario: {user[6]}", flush=True)
    print(f"Id usuario: {user[0]}", flush=True)
    if user:
        if user[4] == password:
            cursor.execute('SELECT * FROM career WHERE career_id = %s', (user[1],))
            career_data = cursor.fetchone()
            cursor.execute('SELECT * FROM role WHERE role_id = %s', (user[2],))
            role_data = cursor.fetchone()

            current_utc_time = datetime.now(utc_timezone)
            expiration_time = current_utc_time + timedelta(minutes=30)
            token = jwt.encode({'sub': email, 'user_id': user[0], 'user_role': user[1], 'iat': current_utc_time, 'exp': expiration_time}, app.config['SECRET_KEY'], algorithm='HS256')
            print(token)
            return jsonify({'token': token, 'expirationTime': expiration_time})
        else:
            return jsonify({'message': 'Contraseña incorrecta'}), 401
    else:
        return jsonify({'message': 'Usuario no encontrado'}), 404

@app.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Sesión cerrada exitosamente'}), 200

# Ruta para obtener un usuario por su nombre
@app.route('/api/users/<user_name>', methods=['GET'])
def get_user_by_username(user_name):
    cursor = db_connection.cursor()
    cursor.execute('SELECT * FROM users WHERE user_name = %s', (user_name,))
    user = cursor.fetchone()
    cursor.execute('SELECT * FROM career WHERE career_id = %s', (user[1],))
    career_data = cursor.fetchone()
    cursor.execute('SELECT * FROM role WHERE role_id = %s', (user[2],))
    role_data = cursor.fetchone()
    cursor.close()

    if user:
        user_data = {
            'user_id': user[0],
            'career_id': career_data[0],
            'career_name': career_data[1],
            'role_id': role_data[0],
            'role_name': role_data[1],
            'user_name': user[3],
            'password': user[4],
            'entry_year': user[5],
            'names': user[6],
            'lastnames': user[7]
        }
        return jsonify(user_data), 200
    else:
        return jsonify({'message': 'Usuario no encontrado'}), 404

# Ruta para obtener todos los usuarios
@app.route('/api/users', methods=['GET'])
def get_users():
    cursor = db_connection.cursor(pymysql.cursors.DictCursor)
    cursor.execute('SELECT * FROM users')
    users = cursor.fetchall()
    cursor.close()
    return jsonify(users)

# Ruta para crear un nuevo usuario
@app.route('/api/users', methods=['POST'])
def create_user():
    new_user = request.json
    cursor = db_connection.cursor()
    cursor.execute('INSERT INTO users (career_id, role_id, user_name, password, entry_year) VALUES (%s, %s, %s, %s, %s)', (new_user['career_id'], new_user['role_id'], new_user['user_name'], new_user['password'], new_user['entry_year']))
    db_connection.commit()
    cursor.close()
    return jsonify({'message': 'Usuario creado correctamente'}), 201

# Ruta para eliminar un usuario existente
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    cursor = db_connection.cursor()
    cursor.execute('DELETE FROM users WHERE user_id=%s', (user_id,))
    db_connection.commit()
    cursor.close()
    return jsonify({'message': 'Usuario eliminado correctamente'})

# Ruta para obtener los certificados con su estado de validación
@app.route('/api/certificates', methods=['GET'])
def all_certificates():
    cursor = db_connection.cursor()
    cursor.execute('SELECT certificate_id, name FROM certificate ORDER BY name;')
    certificates = cursor.fetchall()
    cursor.close()
    result = [{'certificate_id': row[0], 'certificate_name': row[1]} for row in certificates]
    return jsonify(result)

# Ruta para subir un certificado y almacenar información en la base de datos
@app.route('/dashboard', methods=['POST'])
def upload_certificate():
    user_id = request.form.get('user_id')
    print(f"Id usuario: {user_id}", flush=True)
    certificate_name = request.form.get('certificate_name')
    certificate_file = request.files['file']

    if not certificate_file:
        return jsonify({'error': 'No se subió ningún archivo'}), 400

    if certificate_file.filename == '':
        return jsonify({'error': 'No se seleccionó ningún archivo'}), 400

    file_name = f"{str(uuid.uuid4())}.pdf"
    file_path = os.path.join('certificates', file_name)
    certificate_file.save(file_path)
    
    nombre_estudiante = obtener_nombre_usuario(user_id)
    aprooved = validar_certificado(file_path, nombre_estudiante)
    print(f"Certificado aprobado: {aprooved}", flush=True)

    file_path = f"http://your-server.com/{file_path}"

    current_time = datetime.now()

    with db_connection.cursor() as cursor:
        certificate_id = obtener_id_certificado(certificate_name)
        
        sql = """
        INSERT INTO user_certificate (user_id, certificate_id, file_path, approved, upload_time)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (user_id, certificate_id, file_path, aprooved, current_time))
        db_connection.commit()

    return jsonify({'message': 'Certificado subido exitosamente'})

# Ruta para obtener el dashboard de un usuario
@app.route('/dashboard/<int:user_id>', methods=['GET'])
def user_dashboard(user_id):
    with db_connection.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute("""
        SELECT uc.user_certificate_id, c.name AS certificate_name, uc.file_path, uc.approved, uc.upload_time
        FROM user_certificate uc
        INNER JOIN certificate c ON uc.certificate_id = c.certificate_id
        WHERE uc.user_id = %s;
        """, (user_id,))
        certificates = cursor.fetchall()

    return jsonify(certificates)

@app.route("/favicon.ico")
def favicon():
    return "", 200

# Ruta para obtener estadísticas
@app.route('/api/estadisticas/<string:career>/<string:start_date>/<string:end_date>', methods=['GET'])
def get_estadisticas(career, start_date, end_date):
    print(career, flush=True)
    start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
    end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()

    cursor = db_connection.cursor(pymysql.cursors.DictCursor)
    query = """
    SELECT u.user_id, u.user_name, c.career_id, c.name, uc.approved, uc.upload_time
    FROM users u
    INNER JOIN career c ON u.career_id = c.career_id
    INNER JOIN user_certificate uc ON u.user_id = uc.user_id
    WHERE c.name = %s AND uc.upload_time BETWEEN %s AND %s;
    """
    cursor.execute(query, (career, start_date_obj, end_date_obj))
    results = cursor.fetchall()
    cursor.close()

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
