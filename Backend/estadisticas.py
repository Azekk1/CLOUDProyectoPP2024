from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import os
import uuid
from datetime import datetime
import fitz  # PyMuPDF

app = Flask(__name__)
CORS(app)

# Configuración de la conexión a la base de datos MySQL en Azure
db_connection = pymysql.connect(
    host='basededatosproyectoprogra.mysql.database.azure.com',
    port=3306,
    user='myuser',
    password='Mypassword.',
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

# Función para validar el certificado completo (mantenida igual)
def validar_certificado(ruta, nombre_estudiante):
    texto_certificado = extraer_texto_pdf(ruta)
    if es_certificado_valido(texto_certificado) and validar_nombre_certificado(texto_certificado, nombre_estudiante):
        return "aprobado"
    else:
        return "rechazado"

# Función para obtener el nombre completo del usuario por su ID
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

# Ruta para obtener los 10 certificados más comunes
@app.route('/api/top10', methods=['GET'])
def top10_certificates():
    cursor = db_connection.cursor()

    cursor.execute('SELECT c.name, COUNT(uc.user_id) AS numero_de_usuarios FROM login.user_certificate uc JOIN certificate c ON uc.certificate_id = c.certificate_id GROUP BY c.name ORDER BY numero_de_usuarios DESC LIMIT 10;')
    top10 = cursor.fetchall()

    cursor.close()

    result = [{'name': row[0], 'numero_de_usuarios': row[1]} for row in top10]

    return jsonify(result)

# Ruta para obtener el promedio de certificados por año de ingreso
@app.route('/api/avgYear', methods=['GET'])
def average_certificates_per_year():
    cursor = db_connection.cursor()

    cursor.execute('WITH certificados_por_usuario AS ( SELECT u.entry_year, COUNT(c.certificate_id) AS numero_de_certificados FROM users u JOIN user_certificate c ON u.user_id = c.user_id GROUP BY u.user_id, u.entry_year ) SELECT entry_year, AVG(numero_de_certificados) AS promedio_certificados FROM certificados_por_usuario GROUP BY entry_year ORDER BY entry_year;')
    avgYear = cursor.fetchall()

    cursor.close()

    result = [{'entry_year': row[0], 'promedio_certificados': row[1]} for row in avgYear]

    return jsonify(result)

# Ruta para obtener el promedio de certificados por carrera
@app.route('/api/avgCareer', methods=['GET'])
def average_certificates_per_career():
    cursor = db_connection.cursor()

    cursor.execute('WITH certificados_por_usuario AS ( SELECT u.career_id, COUNT(c.certificate_id) AS numero_de_certificados FROM users u JOIN user_certificate c ON u.user_id = c.user_id GROUP BY u.user_id, u.career_id ) SELECT ca.name, AVG(cu.numero_de_certificados) AS promedio_certificados FROM certificados_por_usuario cu JOIN career ca ON cu.career_id = ca.career_id GROUP BY ca.name ORDER BY ca.name;')
    avgYear = cursor.fetchall()

    cursor.close()

    result = [{'name': row[0], 'promedio_certificados': row[1]} for row in avgYear]

    return jsonify(result)

# Ruta para obtener los certificados más comunes por carrera
@app.route('/api/careers', methods=['GET'])
def careers_certificates():
    cursor = db_connection.cursor()

    cursor.execute('WITH CertificadosPorCarrera AS ( SELECT u.career_id, uc.certificate_id, COUNT(uc.user_id) AS numero_de_usuarios FROM user_certificate uc JOIN users u ON uc.user_id = u.user_id GROUP BY u.career_id, uc.certificate_id ), CertificadoMasComunPorCarrera AS ( SELECT cpc.career_id, cpc.certificate_id, cpc.numero_de_usuarios, ROW_NUMBER() OVER (PARTITION BY cpc.career_id ORDER BY cpc.numero_de_usuarios DESC) AS rn FROM CertificadosPorCarrera cpc ) SELECT cr.name, ce.name FROM CertificadoMasComunPorCarrera cmc JOIN career cr ON cmc.career_id = cr.career_id JOIN certificate ce ON cmc.certificate_id = ce.certificate_id WHERE cmc.rn = 1 ORDER BY cr.name;')
    careers = cursor.fetchall()

    cursor.close()

    result = [{'career_name': row[0], 'certificate_name': row[1]} for row in careers]

    return jsonify(result)

# Ruta para obtener todos los certificados
@app.route('/api/all', methods=['GET'])
def all_certificates():
    cursor = db_connection.cursor()

    cursor.execute('SELECT c.certificate_id, c.name, ca.name FROM certificate c INNER JOIN career ca ON c.career_id = ca.career_id;')
    all = cursor.fetchall()

    cursor.close()

    result = [{'id': row[0], 'nombre': row[1], 'carrera': row[2]} for row in all]

    return jsonify(result)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 4001))
    app.run(host='0.0.0.0', port=port)

print("conectado estadisticas.py")