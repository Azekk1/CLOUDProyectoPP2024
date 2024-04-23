from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
import pymysql
import jwt

# Crear un objeto de zona horaria UTC
utc_timezone = timezone.utc

# Obtener la fecha y hora actual en UTC
current_utc_time = datetime.now(utc_timezone)

# Añadir 30 minutos a la fecha y hora actual
expiration_time = current_utc_time + timedelta(minutes=30)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'abcd1234'
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
            payload = {'username': email, 'exp': expiration_time}
            token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
            print(token)
            return jsonify({'token': token})
        else:
            return jsonify({'message': 'Contraseña incorrecta'}), 401
    else:
        return jsonify({'message': 'Usuario no encontrado'}), 404

@app.route('/logout', methods=['POST'])
def logout():

    return jsonify({'message': 'Sesión cerrada exitosamente'}), 200


if __name__ == '__main__':
    app.run(debug=True)