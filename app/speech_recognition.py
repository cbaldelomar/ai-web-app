from flask import Blueprint, render_template

speech_recognition = Blueprint("speech_recognition", __name__)


@speech_recognition.route("/speech_recognition")
def speech_recognition_page():
    return render_template("speech_recognition.html")
