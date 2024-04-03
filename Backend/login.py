from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql

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

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    cursor = db_connection.cursor()
    cursor.execute('SELECT * FROM users WHERE user_name = %s', (email,))
    user = cursor.fetchone()

    if user:
        # Si se encontró el usuario, verificar la contraseña
        if user[4] == password:  # Suponiendo que el hash de la contraseña se almacena en la columna 'password'
            return jsonify({'message': 'Inicio de sesion exitoso'}), 200
        else:
            return jsonify({'message': 'Contraseña incorrecta'}), 401
    else:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    cursor.close()


if __name__ == '__main__':
    app.run(debug=True)