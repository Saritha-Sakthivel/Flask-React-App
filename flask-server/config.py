from decouple import config
import os

BASE_DIR=os.path.dirname(os.path.realpath(__file__))


class Config:
    SECRET_KEY = config('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS=config('SQLALCHEMY_TRACK_MODIFICATIONS', cast=bool)
    GOOGLE_CLIENT_ID = config('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = config('GOOGLE_CLIENT_SECRET')
    GOOGLE_DISCOVERY_URL = config('GOOGLE_DISCOVERY_URL')


class DevConfig(Config):
    SQLALCHEMY_DATABASE_URI="sqlite:///" + os.path.join(BASE_DIR, 'app.db')
    DEBUG=True
    SQLALCHEMY_ECHO=True

class prodConfig(Config):
    pass
class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI='sqlite:///test.db'
    SQLALCHEMY_ECHO=False
    Testing=True

    
