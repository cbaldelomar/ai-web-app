from flask import Flask
from .endpoints import blueprints

app = Flask(__name__)

# Configure the uploads folder
app.config["UPLOAD_FOLDER"] = "uploads"  # Path to the folder
app.config["ALLOWED_EXTENSIONS"] = {
    "png",
    "jpg",
    "jpeg",
    "gif",
    "bmp",
}  # Allowed file types

# Set the maximum file size for uploads (optional)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max file size

# # Importar las rutas
# from app import routes

# Register each blueprint
for bp in blueprints:
    app.register_blueprint(bp)
