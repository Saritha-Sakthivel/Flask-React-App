from flask import Flask
from flask_restx import Api
# from config import DevConfig
from models import Recipe, User
from exts import db
from flask_migrate import Migrate
# from werkzeug.security import generate_password_hash,check_password_hash
from flask_jwt_extended import JWTManager
from recipes import recipe_ns
from auth import auth_ns
from flask_cors import CORS
from oauth import setup_oauth
from flask import Flask
from .config import Config
from .auth import auth_bp


def create_app(config):
    app=Flask(__name__)
    app.config.from_object(config)
    db.init_app(app)

    migrate=Migrate(app,db)
    JWTManager(app)

    setup_oauth(app)

    api=Api(app,doc='/docs')
    api.add_namespace(recipe_ns, path='/recipes')
    api.add_namespace(auth_ns, path='/auth')

    #model(serializer)


    @app.shell_context_processor
    def make_shell_context():
        return {
            "db":db,
            "Recipe":Recipe,
            "user":User
        }
        
    return app