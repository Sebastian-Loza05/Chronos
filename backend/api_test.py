import unittest
from profile_api import app as app1
from auth_api import app as app2
from tasks_api import app as app3
from ia_api import app as app4

from models import Users

class TestChronos(unittest.TestCase):

    API_URL_AUTH = 'http://127.0.0.1:3000/'
    API_URL_PROFILE = 'http://127.0.0.1:3001/'
    API_URL_TASK = 'http://127.0.0.1:3002/'
    API_URL_IA = 'http://127.0.0.1:3003/'

    NEW_USER = {
        "username": "dittochap",
        "password": "1234",
        "nombre": "Sebastián",
        "apellido": "Tuesta",
        "genero": "male",
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
        "name": "Estudiar ADA",
        "date": "2023-10-20",
        "start_time": "17:30:00",
        "end_time": "19:00:00"
    }

    NEW_TASK_BLOCKED = {
        "date": "2023-10-20"
    }

    SEARCH_TASK = {
        "type_search": 2,
        "begin_date": "2023-10-20",
        "end_date": "2023-10-27"
    }

    UPDATE_TASK = {
        "name": "Retirarme de ADA"
    }

    NEW_CODE = {
        "codigo": "es-AR-TomasNeutral"
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

        self.app4 = app4.test_client()
        self.app4_context = app4.app_context()
        self.app4.testing = True
        self.app4_context.push()

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

    def test_03_logout(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.HEADERS['Authorization'] = 'Bearer ' + data['token']

        r = self.app2.delete('/logout', headers=self.HEADERS)
        data = r.get_json()
        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['message'])

    def test_04_get_token(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.HEADERS['Authorization'] = 'Bearer ' + data['token']

        r = self.app2.get('/auth/token', headers=self.HEADERS)
        data = r.get_json()
        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['success'])

    def test_05_patch_profile(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.HEADERS['Authorization'] = 'Bearer ' + data['token']

        data = {'foto': "https://media.discordapp.net/attachments/1155323431915630594/1171520201183998045/image_17.png?ex=655cfa35&is=654a8535&hm=7bd18544dbac9719106aee1b8e756209f2afa458da7ded9cae2c532d3be19089&=&width=421&height=423" }

        r = self.app1.patch('/profile', headers=self.HEADERS, json=data)
        data = r.get_json()
        self.assertEqual(r.status_code, 200)
        self.assertTrue(data)

    def test_06_get_profile(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.HEADERS['Authorization'] = 'Bearer ' + data['token']

        r = self.app1.get('/profile', headers=self.HEADERS)
        data = r.get_json()
        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['success'])

    def test_07_delete_profile(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.HEADERS['Authorization'] = 'Bearer ' + data['token']

        r = self.app1.delete('/profile', headers=self.HEADERS)
        data = r.get_json()
        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['success'])

    def test_08_post_task(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.HEADERS['Authorization'] = 'Bearer ' + data['token']

        r = self.app3.post('/task', json=self.NEW_TASK, headers=self.HEADERS)
        data = r.get_json()
        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['success'])
        self.assertTrue(data['created'])

    def test_09_get_task(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.HEADERS['Authorization'] = 'Bearer ' + data['token']

        r = self.app3.post('/task', json=self.NEW_TASK, headers=self.HEADERS)
        data = r.get_json()

        self.SEARCH_TASK['type_search'] = data['created']['id']

        r = self.app3.post('/tasks/search', json=self.SEARCH_TASK, headers=self.HEADERS)
        data = r.get_json()

        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['success'])
        self.assertTrue(data['tasks'])

    def test_10_patch_task(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.HEADERS['Authorization'] = 'Bearer ' + data['token']

        r = self.app3.post('/task', json=self.NEW_TASK, headers=self.HEADERS)
        data = r.get_json()

        task_id = data['created']['id']

        r = self.app3.patch('/task/' + str(task_id), json=self.UPDATE_TASK, headers=self.HEADERS)
        data = r.get_json()

        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['success'])
        self.assertTrue(data['task_updated'])

    def test_11_post_task_blocked(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.HEADERS['Authorization'] = 'Bearer ' + data['token']

        r = self.app3.post('/task/blocked', json=self.NEW_TASK_BLOCKED, headers=self.HEADERS)
        data = r.get_json()

        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['success'])
        self.assertTrue(data['blocked_day'])

    def test_12_patch_voice(self):
        r = self.app1.post('/sign_in', json=self.NEW_USER)
        data = r.get_json()
        self.HEADERS['Authorization'] = 'Bearer ' + data['token']

        r = self.app4.patch('/voice/change', json=self.NEW_CODE, headers=self.HEADERS)
        data = r.get_json()

        self.assertEqual(r.status_code, 200)
        self.assertTrue(data['success'])
        self.assertTrue(data['voz'])

    # def test_12_post_recommendation(self):
    #     r = self.app1.post('/sign_in', json=self.NEW_USER)
    #     data = r.get_json()
    #     self.HEADERS['Authorization'] = 'Bearer ' + data['token']
    #
    #     audio_path = 'Prueba.m4a'
    #     content_type = 'multipart/form-data'
    #     data = {'audio': open(audio_path, 'rb')}
    #
    #     r = self.app4.post('/voice/recomendations', headers=self.HEADERS, content_type=content_type, data=data)
    #
    #     data = r.get_json()
    #     self.assertTrue(data.headers['Content-Type'])

if __name__ == "__main__":
    unittest.main()
