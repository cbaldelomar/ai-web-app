import os
import random
from flask import render_template, request
from werkzeug.utils import secure_filename
from . import app


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/facial_recognition", methods=["GET", "POST"])
def facial_recognition():
    result = None  # Default: No result

    if request.method == "POST":
        # Handle image upload
        file = request.files["image"]
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(file_path)

            # Simulate facial recognition (replace with actual logic)
            # For example, use face_recognition library or OpenCV to analyze the image.
            # Here, I'm just simulating with a static result.
            result = "Rostro reconocido con éxito."  # Replace with actual result from facial recognition logic

    return render_template("facial_recognition.html", result=result)


@app.route("/sentiment_analysis", methods=["GET", "POST"])
def sentiment_analysis():
    result = None  # Default: No result
    if request.method == "POST":
        text = request.form["text"]

        # Simulate AI sentiment analysis (replace with real AI model)
        emotions = ["Positivo 😊", "Negativo 😞", "Neutral 😐"]
        result = random.choice(emotions)

    return render_template("sentiment_analysis.html", result=result)


@app.route("/request_classification")
def request_classification():
    return render_template("request_classification.html")


@app.route("/speech_recognition")
def speech_recognition():
    return render_template("speech_recognition.html")


@app.route("/supervised_learning")
def supervised_learning():
    return render_template("supervised_learning.html")


@app.route("/chatbot")
def chatbot():
    return render_template("chatbot.html")
