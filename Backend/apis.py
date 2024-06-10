from flask import Flask, request, jsonify
from flask_cors import CORS
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

# Ruta para obtener un usuario por su nombre
@app.route('/api/users/<user_name>', methods=['GET'])
def get_user_by_username(user_name):
    # Crear un cursor para ejecutar consultas SQL
    cursor = db_connection.cursor()

    # Ejecutar una consulta para obtener el usuario por su nombre
    cursor.execute('SELECT * FROM users WHERE user_name = %s', (user_name,))
    user = cursor.fetchone()  # Obtener el primer resultado (si hay alguno)
    cursor.execute('SELECT * FROM career WHERE career_id = %s', (user[1],))
    career_data = cursor.fetchone()
    cursor.execute('SELECT * FROM role WHERE role_id = %s', (user[2],))
    role_data = cursor.fetchone()

    cursor.close()  # Cerrar el cursor

    # Verificar si se encontró un usuario con el nombre proporcionado
    if user:
        # Si se encontró el usuario, devolver los datos como respuesta JSON
        user_data = {
            'user_id': user[0],
            'career_id': career_data[0],  # Se envía el ID de la carrera
            'career_name': career_data[1],  # Se envía el nombre de la carrera
            'role_id': role_data[0],  # Se envía el ID del rol
            'role_name': role_data[1],  # Se envía el nombre del rol
            'user_name': user[3],
            'password': user[4],
            'entry_year': user[5],
            'first_name': user[6],
            'last_name': user[7]
        }
        return jsonify(user_data), 200
    else:
        # Si no se encontró el usuario, devolver un mensaje de error
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

#ruta para obtener los nombres de los certificados
@app.route('/api/certificates', methods=['GET'])
def all_certificates():
    # Crear un cursor para ejecutar consultas SQL
    cursor = db_connection.cursor()

    # Ejecutar una consulta para obtener todos los certificados
    cursor.execute('SELECT certificate_id, name FROM certificate ORDER BY name;')
    certificates = cursor.fetchall()  # Obtener todos los resultados

    cursor.close()  # Cerrar el cursor

    # Convertir los resultados a un formato de lista de diccionarios
    result = [{'certificate_id': row[0], 'certificate_name': row[1]} for row in certificates]

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=4000)