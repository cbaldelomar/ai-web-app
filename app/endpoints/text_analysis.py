"""Modulo de análisis de texto"""

from flask import Blueprint, render_template, request

text_analysis_bp = Blueprint("text_analysis", __name__)


@text_analysis_bp.route("/text-analysis/<user_name>")
def index(user_name):
    """Index"""
    return render_template("text_analysis.html", user_name=user_name)


@text_analysis_bp.route("/text-analysis/analyze", methods=["POST"])
def analyze():
    """Analyze text"""
    data = request.json
    text = data.get("text")

    return "", 204
    # return render_template("text-analisys.html", result=text)
