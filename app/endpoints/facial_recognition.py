"""Modulo de reconocimiento facial"""

import os
import base64
import face_recognition
import cv2
import numpy as np
from flask import Blueprint, render_template, request, jsonify


# Ruta para almacenar las caras conocidas
USER_FACES_DIR = "./app/user_faces"
if not os.path.exists(USER_FACES_DIR):
    os.makedirs(USER_FACES_DIR)

# Cargar caras conocidas
known_face_encodings = []
known_face_names = []


def load_user_faces():
    """Carga los rostros registrados al iniciar la aplicación."""
    user_face_encodings = []
    user_face_names = []

    for filename in os.listdir(USER_FACES_DIR):
        if filename.endswith(".jpg") or filename.endswith(".png"):
            name = os.path.splitext(filename)[0]
            image_path = os.path.join(USER_FACES_DIR, filename)
            image = face_recognition.load_image_file(image_path)
            face_encoding = face_recognition.face_encodings(image)
            if face_encoding:
                user_face_encodings.append(face_encoding[0])
                user_face_names.append(name)

    return user_face_encodings, user_face_names


# Cargar rostros conocidos al iniciar
known_face_encodings, known_face_names = load_user_faces()

facial_recognition_bp = Blueprint("facial_recognition", __name__)


@facial_recognition_bp.route("/facial_recognition")
def index():
    """Vista de reconocimiento facial"""
    return render_template("facial_recognition.html")


@facial_recognition_bp.route("/facial_recognition/register", methods=["POST"])
def register():
    """Registra un nuevo usuario si su rostro no existe en la base de datos."""
    data = request.json
    name = data.get("name")
    image_data = data.get("image")

    if not name or not image_data:
        return jsonify({"message": "Nombre o imagen no proporcionados."}), 400

    # Decodificar la imagen base64
    image_bytes = base64.b64decode(image_data.split(",")[1])
    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    # Convertir la imagen a formato RGB
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Obtener la codificación del rostro
    face_encodings = face_recognition.face_encodings(rgb_image)

    if not face_encodings:
        return jsonify({"message": "No se detectó ningun rostro en la imagen."}), 400

    new_face_encoding = face_encodings[0]

    # Comprobar si la cara ya está registrada
    matches = face_recognition.compare_faces(known_face_encodings, new_face_encoding)
    face_distances = face_recognition.face_distance(
        known_face_encodings, new_face_encoding
    )

    if any(matches):
        best_match_index = np.argmin(face_distances)
        existing_name = known_face_names[best_match_index]
        return (
            jsonify(
                {"message": f"Este rostro ya está registrado como '{existing_name}'."}
            ),
            409,
        )

    # Guardar la imagen y añadir la codificación a la base de datos
    image_path = os.path.join(USER_FACES_DIR, f"{name}.jpg")
    cv2.imwrite(image_path, image)

    known_face_encodings.append(new_face_encoding)
    known_face_names.append(name)

    return "", 204


@facial_recognition_bp.route("/facial_recognition/authenticate", methods=["POST"])
def authenticate():
    """Autentica a un usuario comparando su rostro con la base de datos."""
    data = request.json
    image_data = data.get("image")

    if not image_data:
        return jsonify({"message": "Imagen no proporcionada."}), 400

    # Decodificar la imagen base64
    image_bytes = base64.b64decode(image_data.split(",")[1])
    image_array = np.frombuffer(image_bytes, dtype=np.uint8)

    if len(image_array) == 0:
        return (
            jsonify(
                {"message": "No se encontró contenido en la imagen. Intente de nuevo."}
            ),
            400,
        )

    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    # Convertir a RGB
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Detectar caras
    face_encodings = face_recognition.face_encodings(rgb_image)

    if not face_encodings:
        return (
            jsonify(
                {
                    "message": "No se detectó ningun rostro en la imagen. Intente de nuevo."
                }
            ),
            400,
        )

    # Comparar con caras conocidas
    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        face_distances = face_recognition.face_distance(
            known_face_encodings, face_encoding
        )

        if len(face_distances):
            best_match_index = np.argmin(face_distances)

            if matches[best_match_index]:
                name = known_face_names[best_match_index]
                return jsonify({"name": name})

    return jsonify({"message": "Usuario no reconocido."}), 404
