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
    port=3307,
    user='myuser',
    password='mypassword',
    database='login'
)


def obtener_id_certificado(data):
    certificado = data.get('nombre_certificado')
    cursor = db_connection.cursor()
    cursor.execute('SELECT * FROM certificate WHERE name= %s', (certificado,))
    certificate_id = cursor.fetchone()
    return(certificate_id)

# Function to upload a certificate and store it in the database
@app.route('/subircertificado', methods=['POST'])
def upload_certificate(userData):
    data = request.json
    user_id = userData.user_id
    
    # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    # Get the uploaded file
    file = request.files['file']

    # Check if a file was actually uploaded
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Generate a unique file name
    file_name = f"{str(uuid.uuid4())}.pdf"

    # Save the file to the server
    file_path = os.path.join('certificates', file_name)
    file.save(file_path)

    # Create a URL for the file
    file_url = f"http://your-server.com/certificates/{file_name}"

    # Store the file path and URL in the database
    with db_connection.cursor() as cursor:
        # Insert the file path, URL, user ID and certificate ID into the user_certificate table
        sql = "INSERT INTO user_certificate (user_id, certificate_id, file_url) VALUES (%s, %s, %s)"
        cursor.execute(sql, ( user_id, certificate_id, file_url))

        # Get the ID of the newly inserted certificate
        certificate_id = cursor.lastrowid

        # Commit the changes
        db_connection.commit()

    # Return the certificate ID
    return jsonify({'certificate_id': certificate_id}), 201



