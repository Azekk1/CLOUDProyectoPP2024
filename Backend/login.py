from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
import pymysql
import jwt

# Crear un objeto de zona horaria UTC
utc_timezone = timezone.utc

app = Flask(__name__)
app.config['SECRET_KEY'] = 'abcd1234'
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

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    cursor = db_connection.cursor()
    cursor.execute('SELECT * FROM users WHERE user_name = %s', (email,))
    user = cursor.fetchone()
    print(f"Nombre usuario: {user[6]}",flush=True)
    print(f"Id usuario: {user[0]}",flush=True)
    if user:
        # Si se encontró el usuario, verificar la contraseña
        if user[4] == password:  # Suponiendo que la contraseña se almacena en la columna 'password'

            cursor.execute('SELECT * FROM career WHERE career_id = %s', (user[1],))
            career_data = cursor.fetchone()
            cursor.execute('SELECT * FROM role WHERE role_id = %s', (user[2],))
            role_data = cursor.fetchone()    

            # Obtener la fecha y hora actual en UTC
            current_utc_time = datetime.now(utc_timezone)

            # Añadir 30 minutos a la fecha y hora actual
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

if __name__ == '__main__':
    app.run()

print("conectado login.py")