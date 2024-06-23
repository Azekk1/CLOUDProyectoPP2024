#Archivo para las pruebas unitarias

import unittest
from unittest.mock import patch
from estadisticas import app

class TestStatisticsAPI(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('estadisticas.db_connection.cursor')
    def test_top10_certificates(self, mock_cursor):
        mock_cursor.return_value.fetchall.return_value = [
            ('Certificado 1', 100),
            ('Certificado 2', 90),
            ('Certificado 3', 80),
            ('Certificado 4', 70),
            ('Certificado 5', 60),
            ('Certificado 6', 50),
            ('Certificado 7', 40),
            ('Certificado 8', 30),
            ('Certificado 9', 20),
            ('Certificado 10', 10)
        ]

        response = self.app.get('/api/top10')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data), 10)
        self.assertEqual(data[0]['name'], 'Certificado 1')
        self.assertEqual(data[0]['numero_de_usuarios'], 100)

    @patch('estadisticas.db_connection.cursor')
    def test_average_certificates_per_year(self, mock_cursor):
        mock_cursor.return_value.fetchall.return_value = [
            (2019, 5.0),
            (2020, 4.5),
            (2021, 4.0)
        ]

        response = self.app.get('/api/avgYear')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data), 3)
        self.assertEqual(data[0]['entry_year'], 2019)
        self.assertEqual(data[0]['promedio_certificados'], 5.0)

    @patch('estadisticas.db_connection.cursor')
    def test_average_certificates_per_career(self, mock_cursor):
        mock_cursor.return_value.fetchall.return_value = [
            ('Engineering', 4.2),
            ('Arts', 3.8),
            ('Science', 4.5)
        ]

        response = self.app.get('/api/avgCareer')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data), 3)
        self.assertEqual(data[0]['name'], 'Engineering')
        self.assertEqual(data[0]['promedio_certificados'], 4.2)

    @patch('estadisticas.db_connection.cursor')
    def test_careers_certificates(self, mock_cursor):
        mock_cursor.return_value.fetchall.return_value = [
            ('Engineering', 'Certificado A'),
            ('Arts', 'Certificado B'),
            ('Science', 'Certificado C')
        ]

        response = self.app.get('/api/careers')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data), 3)
        self.assertEqual(data[0]['career_name'], 'Engineering')
        self.assertEqual(data[0]['certificate_name'], 'Certificado A')

if __name__ == '__main__':
    unittest.main()
