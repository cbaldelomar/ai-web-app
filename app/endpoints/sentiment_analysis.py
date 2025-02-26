from flask import Blueprint, render_template

sentiment_analysis_bp = Blueprint("sentiment_analysis", __name__)


@sentiment_analysis_bp.route("/sentiment_analysis/<user_name>")
def index(user_name):
    return render_template("sentiment_analysis.html", user_name=user_name)
