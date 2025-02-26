from flask import Blueprint, render_template

request_classification = Blueprint("request_classification", __name__)


@request_classification.route("/request_classification")
def request_classification_page():
    return render_template("request_classification.html")
