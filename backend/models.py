from flask_sqlalchemy import SQLAlchemy
from decouple import config
from werkzeug.security import generate_password_hash, check_password_hash

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

