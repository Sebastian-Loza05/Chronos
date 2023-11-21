from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import UniqueConstraint
from decouple import config
from werkzeug.security import generate_password_hash, check_password_hash
from base64 import b64encode

DATA_USER = config('DATA_USER')
DATA_PASSWORD = config('DATA_PASSWORD')
HOST = config('HOST')
PORT = config('PORT')
DATABASE_NAME = config('DATABASE_NAME')

database_path = 'postgresql://{}:{}@{}:{}/{}'.format(
    DATA_USER,
    DATA_PASSWORD,
    HOST,
    PORT,
    DATABASE_NAME
)

db = SQLAlchemy()

def setup_db(app, database_path=database_path):
    app.config['SQLALCHEMY_DATABASE_URI'] = database_path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)
    with app.app_context():
        db.create_all()

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    profile = db.relationship('Profile', uselist=False, back_populates='user')
    tasks = db.relationship('Tasks', cascade='all,delete', backref='user')

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def format(self):
        return {
            'id': self.id,
            'username': self.username
        }

    def insert(self):
        try:
            db.session.add(self)
            db.session.commit()
            return self.id
        except Exception as e:
            print(e)
            db.session.rollback()
            return -1
        finally:
            db.session.close()

    def delete(self):
        try:
            self.profile.delete()
            db.session.delete(self)
            db.session.commit()
        except Exception as e:
            print(e)
            db.session.rollback()
        finally:
            db.session.close()

    @staticmethod
    def get_by_username(username):
        return Users.query.filter_by(
            username=username
        ).one_or_none()

    @staticmethod
    def get_by_id(user_id):
        return Users.query.filter_by(
            id=user_id
        ).one_or_none()


class Profile(db.Model):
    __tablename__ = 'profile'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    genero = db.Column(db.String(10), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    pais = db.Column(db.String(50), nullable=False)
    celular = db.Column(db.Integer, unique=True, nullable=False)
    correo = db.Column(db.String(150), nullable=False)
    foto = db.Column(db.Text, nullable=True)
    user = db.relationship('Users', back_populates='profile')

    def format(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'nombre': self.nombre,
            'apellido': self.apellido,
            'genero': self.genero,
            'fecha_nacimiento': self.fecha_nacimiento,
            'pais': self.pais,
            'celular': self.celular,
            'correo': self.correo,
            'foto': self.foto if self.foto else "URL predeterminada o None"
        }

    def insert(self):
        try:
            db.session.add(self)
            db.session.commit()
            return self.id
        except Exception as e:
            print(e)
            db.session.rollback()
            return -1
        finally:
            db.session.close()

    def update(self):
        try:
            db.session.commit()
            return self.id
        except Exception as e:
            print(e)
            db.session.rollback()
            return -1
        finally:
            db.session.close()

    def delete(self):
        try:
            db.session.delete(self)
            db.session.commit()
        except Exception as e:
            print(e)
            db.session.rollback()
        finally:
            db.session.close()

    @staticmethod
    def get_by_profile_id(user_id):
        return Profile.query.filter_by(
            user_id=user_id
        ).one_or_none()

class Tasks(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    lugar = db.Column(db.String(100), nullable=True)
    estado = db.Column(db.Boolean, default=False)
    descripcion = db.Column(db.String(255), nullable=True)
    fecha = db.Column(db.Date, nullable=False)
    hora_inicio = db.Column(db.Time, nullable=False)
    hora_final = db.Column(db.Time, nullable=False)

    def __repr__(self):
        return f'Task: id = {self.id}, user_id = {self.user_id}, nombre = {self.nombre}, estado = {self.estado}, fecha = {self.fecha}, inicio = {self.hora_inicio}, fin = {self.hora_final}'

    def format(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.nombre,
            'place': self.lugar,
            'state': self.estado,
            'description': self.descripcion,
            'date': self.fecha,
            'start_time': self.hora_inicio.strftime('%H:%M:%S'),
            'end_time': self.hora_final.strftime('%H:%M:%S')
        }

    def format_ia(self):
        fecha = self.fecha.strftime('%d/%m/%Y')
        hora = self.hora_inicio.strftime('%H:%M') + ' - ' + self.hora_final.strftime('%H:%M')
        nombre = self.nombre
        return str(self.id) + ' ' + fecha + ' ' + hora + ': ' + nombre

    def insert(self):
        try:
            db.session.add(self)
            db.session.commit()
            return self.id
        except Exception as e:
            print(e)
            db.session.rollback()
            return -1
        finally:
            db.session.close()

    def update(self):
        try:
            db.session.commit()
            return self.id
        except Exception as e:
            print(e)
            db.session.rollback()
            return -1
        finally:
            db.session.close()

    def delete(self):
        try:
            db.session.delete(self)
            db.session.commit()
        except Exception as e:
            print(e)
            db.session.rollback()
        finally:
            db.session.close()

    @staticmethod
    def get_task_by_id(id, user_id):
        return Tasks.query.filter_by(
            id=id,
            user_id=user_id
        ).one_or_none()

    @staticmethod
    def get_tasks_by_user(user_id):
        return Tasks.query.filter_by(
            user_id=user_id
        ).all()

    @staticmethod
    def get_tasks_by_user_by_date(user_id, date):
        return Tasks.query.filter(
            (Tasks.user_id == user_id) & (Tasks.fecha >= date)
        ).all()

    @staticmethod
    def get_task_by_date(date):
        return Tasks.query.filter_by(
            fecha=date
        ).all()

