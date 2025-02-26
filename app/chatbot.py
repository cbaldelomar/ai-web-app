from flask import Blueprint, render_template

chatbot = Blueprint("chatbot", __name__)


@chatbot.route("/chatbot")
def chatbot_page():
    return render_template("chatbot.html")
