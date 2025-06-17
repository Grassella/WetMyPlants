from flask import Flask, request, redirect
from dotenv import load_dotenv
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User, Room, Plant
from .api.auth_routes import auth_routes
from .api.user_routes import user_routes
from .api.plant_routes import plant_routes
from .api.room_routes import room_routes
from .seeds import seed_commands
from .config import Config

load_dotenv()  # Ensures .env variables are loaded before config

app = Flask(__name__, static_folder="../../frontend/dist", static_url_path="/")
app.config.from_object(Config)

# Setup extensions
db.init_app(app)
Migrate(app, db)
login = LoginManager(app)
login.login_view = "auth.unauthorized"


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Register blueprints
app.register_blueprint(user_routes, url_prefix="/api/users")
app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(plant_routes, url_prefix="/api/plant")
app.register_blueprint(room_routes, url_prefix="/api/room")

# CORS setup
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# CLI
app.cli.add_command(seed_commands)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        "csrf_token",
        generate_csrf(),
        secure=False,  # Set to True with HTTPS
        samesite=None,  # Adjust as needed for production
        httponly=True,
    )
    return response


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def react_root(path):
    if path == "favicon.ico":
        return app.send_from_directory("public", "favicon.ico")
    return app.send_static_file("index.html")
