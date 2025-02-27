from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import os
import uuid
from datetime import datetime
import fitz

app = Flask(__name__)
CORS(app)

# Configuración de la conexión a la base de datos MySQL en Azure
db_connection = pymysql.connect(
    host='127.0.0.1',
    port=3307,
    user='myuser',
    password='mypassword',
    database='login',
    ssl={"ssl": {"enabled": True, "verify_identity": False, "ca": "./BaltimoreCyberTrustRoot.crt.pem"}}
)

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
    print(f"Texto del certificado: {texto_certificado}",flush=True)
    print(f"El nombre del estudiante es: {nombre_estudiante}",flush=True)
    print(f"Es válido: {validez}",flush=True)
    print(f"Validación de nombre: {validar_nombre}",flush=True)
    
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

# Función para obtener el ID del certificado desde la base de datos (mantenida igual)
def obtener_id_certificado(nombre_certificado):
    cursor = db_connection.cursor()
    cursor.execute('SELECT certificate_id FROM certificate WHERE name = %s', (nombre_certificado,))
    certificate_id = cursor.fetchone()
    return certificate_id[0] if certificate_id else None

# Ruta para subir un certificado y almacenar información en la base de datos
@app.route('/dashboard', methods=['POST'])
def upload_certificate():
    user_id = request.form.get('user_id')
    print(f"Id usuario: {user_id}",flush=True)
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

    # Llamada a la función de validación de certificados (debes implementar esta función)
    aprooved = validar_certificado(file_path, nombre_estudiante)  # Retorna True si el certificado es válido, False en caso contrario
    print(f"Certificado aprobado: {aprooved}",flush=True)

    
    file_path = f"http://your-server.com/{file_path}"  # Reemplaza 'your-server.com' con tu URL real

    current_time = datetime.now()

    with db_connection.cursor() as cursor:
        certificate_id = obtener_id_certificado(certificate_name)
        
        sql = """
        INSERT INTO user_certificate (user_id, certificate_id, file_path, approved, upload_time)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (user_id, certificate_id, file_path, aprooved, current_time))
        db_connection.commit()

    return jsonify({'message': 'Archivo guardado correctamente'}), 201

if __name__ == '__main__':
    app.run()

print("conectado api subircertificado.py")