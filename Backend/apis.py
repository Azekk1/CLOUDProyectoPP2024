from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import logging

app = Flask(__name__)
CORS(app)

# Configuración de la conexión a la base de datos MySQL en Azure
db_connection = pymysql.connect(
    host='basededatosproyectoprogra.mysql.database.azure.com',
    port=3306,
    user='myuser@basededatosproyectoprogra',
    password='Mypassword.',
    database='login'
)

# Configurar el logger
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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
            'names': user[6],
            'lastnames': user[7]
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

# Ruta para obtener los certificados con su estado de validación
@app.route('/api/certificates', methods=['GET'])
def all_certificates():
    cursor = db_connection.cursor()
    cursor.execute('SELECT certificate_id, name, validacion FROM certificate ORDER BY name;')
    certificates = cursor.fetchall()
    cursor.close()

    # Convertir los resultados a un formato de lista de diccionarios
    result = [{'certificate_id': row[0], 'certificate_name': row[1], 'validacion': row[2]} for row in certificates]

    return jsonify(result)

if __name__ == "__main__":
    app.run(port=4000)
