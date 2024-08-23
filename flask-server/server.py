from flask import Flask, request, jsonify
from models import db, User

app = Flask(__name__)
app.config["SECRET_KEY"]='d94dad4e8bb31018bb2d2d22459958ba'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///flask.db"

SQLALCHEMY_TRACK_MODIFICATIONS=False
SQLALCHEMY_ECHO = True

db.init_app(app)

with app.app_context():
    print("Creating all tables...")
    db.create_all()
    print("Tables created.")

# @app.route('/members')
# def members():
#     return {"members": ["member1","member2","member3"]}

@app.route('/signup', methods=["POST"])
def signup():
    email = request.json["email"]
    password = request.json["password"]

    return jsonify({
        "id":"1",
        "email":email
    })

if __name__ == '__main__':
    app.run(debug=True)
