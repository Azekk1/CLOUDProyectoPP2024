#Archivo con las APIS para las estadisticas

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
import pymysql

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
#Ruta para encontrar los certificados mas comunes
@app.route('/api/top10', methods=['GET'])
def top10_certificates():
    # Crear un cursor para ejecutar consultas SQL
    cursor = db_connection.cursor()

    # Ejecutar una consulta para obtener el usuario por su nombre
    cursor.execute('SELECT c.name, COUNT(uc.user_id) AS numero_de_usuarios FROM login.user_certificate uc JOIN certificate c ON uc.certificate_id = c.certificate_id GROUP BY c.name ORDER BY numero_de_usuarios DESC LIMIT 10;')
    top10 = cursor.fetchall()  # Obtener el primer resultado (si hay alguno)

    cursor.close()  # Cerrar el cursor

     # Convertir los resultados a un formato de lista de diccionarios
    result = [{'name': row[0], 'numero_de_usuarios': row[1]} for row in top10]

    return jsonify(result)

#Ruta para encontrar el promedio de certificados por año de ingreso
@app.route('/api/avgYear', methods=['GET'])
def average_certificates_per_year():
    # Crear un cursor para ejecutar consultas SQL
    cursor = db_connection.cursor()

    # Ejecutar una consulta para obtener el usuario por su nombre
    cursor.execute('WITH certificados_por_usuario AS ( SELECT u.entry_year, COUNT(c.certificate_id) AS numero_de_certificados FROM users u JOIN user_certificate c ON u.user_id = c.user_id GROUP BY u.user_id, u.entry_year ) SELECT entry_year, AVG(numero_de_certificados) AS promedio_certificados FROM certificados_por_usuario GROUP BY entry_year ORDER BY entry_year;')
    avgYear = cursor.fetchall()  # Obtener el primer resultado (si hay alguno)

    cursor.close()  # Cerrar el cursor

     # Convertir los resultados a un formato de lista de diccionarios
    result = [{'entry_year': row[0], 'promedio_certificados': row[1]} for row in avgYear]

    return jsonify(result)

#Ruta para encontrar el promedio de certificados por carrera
@app.route('/api/avgCareer', methods=['GET'])
def average_certificates_per_career():
    # Crear un cursor para ejecutar consultas SQL
    cursor = db_connection.cursor()

    # Ejecutar una consulta para obtener el usuario por su nombre
    cursor.execute('WITH certificados_por_usuario AS ( SELECT u.career_id, COUNT(c.certificate_id) AS numero_de_certificados FROM users u JOIN user_certificate c ON u.user_id = c.user_id GROUP BY u.user_id, u.career_id ) SELECT ca.name, AVG(cu.numero_de_certificados) AS promedio_certificados FROM certificados_por_usuario cu JOIN career ca ON cu.career_id = ca.career_id GROUP BY ca.name ORDER BY ca.name;')
    avgYear = cursor.fetchall()  # Obtener el primer resultado (si hay alguno)

    cursor.close()  # Cerrar el cursor

     # Convertir los resultados a un formato de lista de diccionarios
    result = [{'name': row[0], 'promedio_certificados': row[1]} for row in avgYear]

    return jsonify(result)

#Ruta para encontrar los certificados mas comunes por carrera
@app.route('/api/careers', methods=['GET'])
def careers_certificates():
    # Crear un cursor para ejecutar consultas SQL
    cursor = db_connection.cursor()

    # Ejecutar una consulta para obtener el usuario por su nombre
    cursor.execute('WITH CertificadosPorCarrera AS ( SELECT u.career_id, uc.certificate_id, COUNT(uc.user_id) AS numero_de_usuarios FROM user_certificate uc JOIN users u ON uc.user_id = u.user_id GROUP BY u.career_id, uc.certificate_id ), CertificadoMasComunPorCarrera AS ( SELECT cpc.career_id, cpc.certificate_id, cpc.numero_de_usuarios, ROW_NUMBER() OVER (PARTITION BY cpc.career_id ORDER BY cpc.numero_de_usuarios DESC) AS rn FROM CertificadosPorCarrera cpc ) SELECT cr.name, ce.name FROM CertificadoMasComunPorCarrera cmc JOIN career cr ON cmc.career_id = cr.career_id JOIN certificate ce ON cmc.certificate_id = ce.certificate_id WHERE cmc.rn = 1 ORDER BY cr.name;')
    careers = cursor.fetchall()  # Obtener el primer resultado (si hay alguno)

    cursor.close()  # Cerrar el cursor

     # Convertir los resultados a un formato de lista de diccionarios
    result = [{'career_name': row[0], 'certificate_name': row[1]} for row in careers]

    return jsonify(result)


#Ruta para traer todos los certificados
@app.route('/api/all', methods=['GET'])
def all_certificates():
    # Crear un cursor para ejecutar consultas SQL
    cursor = db_connection.cursor()

    # Ejecutar una consulta para obtener el usuario por su nombre
    cursor.execute('SELECT c.certificate_id, c.name, ca.name FROM certificate c INNER JOIN career ca ON c.career_id = ca.career_id;')
    all = cursor.fetchall()  # Obtener el primer resultado (si hay alguno)

    cursor.close()  # Cerrar el cursor

     # Convertir los resultados a un formato de lista de diccionarios
    result = [{'id': row[0], 'nombre': row[1], 'carrera': row[2]} for row in all]

    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, port=4001)