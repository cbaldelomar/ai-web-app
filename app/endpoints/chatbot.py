from flask import Blueprint, render_template

chatbot_bp = Blueprint("chatbot", __name__)


@chatbot_bp.route("/chatbot")
def index():
    return render_template("chatbot.html")
