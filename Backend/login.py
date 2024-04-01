from flask import Flask, request, jsonify
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if email == 'test@example.com' and password == 'test1234':
            return jsonify({'message': 'Login successful'})
        else:
            return jsonify({'error': 'Invalid email or password'})

api.add_resource(Login, '/login')

if __name__ == '__main__':
    app.run(debug=True)