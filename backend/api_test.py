import unittest
from flask import (
    request,
    Flask
)
import json
from profile_api import app as app1
from auth_api import app as app2
from tasks_api import app as app3

from models import Users, setup_db

from flask_jwt_extended import (
    create_access_token
)

class TestChronos(unittest.TestCase):

    API_URL_AUTH = 'http://127.0.0.1:3000/'
    API_URL_PROFILE = 'http://127.0.0.1:3001/'
    API_URL_TASK = 'http://127.0.0.1:3002/'

    NEW_USER = {
        "username": "dittochap",
        "password": "1234",
        "nombre": "Sebastián",
        "apellido": "Tuesta",
        "genero": "M",
        "fecha_nacimiento": "2004-01-16",
        "pais": "Perú",
        "celular": 943759343,
        "correo": "dittochap@gmail.com"
    }

    LOGIN = {
        "username": "dittochap",
        "password": "1234"
    }

    NEW_TASK = {
        "name": "Estudiar Aritmetica",
        "date": "2023-10-20",
        "start_time": "17:30:00",
        "end_time": "19:00:00"
    }

    HEADERS = {}

    @classmethod
    def setUp(self):
        self.app1 = app1.test_client()
        self.app1_context = app1.app_context()
        self.app1.testing = True
        self.app1_context.push()

        self.app2 = app2.test_client()
        self.app2_context = app2.app_context()
        self.app2.testing = True
        self.app2_context.push()

        self.app3 = app3.test_client()
        self.app3_context = app3.app_context()
        self.app3.testing = True
        self.app3_context.push()

    # Limpieando data
    @classmethod
    def tearDown(self):
        user = Users.get_by_username(self.NEW_USER["username"])
        if user is not None:
            user.delete()

    def test_01_post_sign_in(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['created_user'])
        self.assertTrue(data['token'])

    def test_02_post_login(self):
        self.app1.post('/sign_in', json=self.NEW_USER)

        r = self.app2.post('/auth', json=self.LOGIN)
        data = r.get_json()
        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['profile'])
        self.assertTrue(data['token'])

    def test_02_logout(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.HEADERS['Authorization'] = 'Bearer ' + data['token']

        r = self.app2.delete('/logout', headers=self.HEADERS)
        data = r.get_json()
        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['message'])

    def test_03_get_token(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.HEADERS['Authorization'] = 'Bearer ' + data['token']

        r = self.app2.get('/auth/token', headers=self.HEADERS)
        data = r.get_json()
        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['success'])

    def test_04_get_profile(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.HEADERS['Authorization'] = 'Bearer ' + data['token']

        r = self.app1.get('/profile', headers=self.HEADERS)
        data = r.get_json()
        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['success'])

    def test_05_delete_profile(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.HEADERS['Authorization'] = 'Bearer ' + data['token']

        r = self.app1.delete('/profile', headers=self.HEADERS)
        data = r.get_json()
        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['success'])

    def test_06_post_task(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.HEADERS['Authorization'] = 'Bearer ' + data['token']

        r = self.app3.post('/task', json=self.NEW_TASK, headers=self.HEADERS)
        data = r.get_json()
        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['success'])
        self.assertTrue(data['created'])

if __name__ == "__main__":
    unittest.main()
