"""Modulo de análisis de texto"""

from flask import Blueprint, render_template, request, jsonify
from transformers import pipeline
import nltk
import joblib

# Descargar el recurso de tokenización de oraciones de NLTK
nltk.download("punkt")

# Cargar el modelo de análisis de sentimientos
analizador_sentimientos = pipeline(
    "sentiment-analysis", model="finiteautomata/beto-sentiment-analysis"
)

# Cargar el modelo de clasificación (que incluye el vectorizador)
modelo = joblib.load("app/utils/modelo_clasificacion.pkl")

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

    # Dividir el texto en oraciones usando NLTK
    oraciones = nltk.sent_tokenize(text, language="spanish")

    # Analizar el sentimiento de cada oración
    sentimientos = []
    for oracion in oraciones:
        resultado = analizador_sentimientos(oracion)
        sentimiento = resultado[0]["label"]
        confianza = round(resultado[0]["score"], 2)

        # Normalizar las etiquetas de sentimiento
        sentimiento = sentimiento.upper()  # Convertir a mayúsculas para evitar errores
        if sentimiento in ["POSITIVE", "POS"]:
            sticker = "positive.png"
        elif sentimiento in ["NEGATIVE", "NEG"]:
            sticker = "negative.png"
        else:
            sticker = "neutral.png"

        sentimientos.append(
            {
                "oracion": oracion,
                "sentimiento": sentimiento,
                "confianza": confianza,
                "sticker": sticker,
            }
        )

    # Preprocesar el texto y predecir el departamento (clasificación de texto)
    departamento = modelo.predict([text])[0]

    # Devolver los resultados como JSON
    return jsonify({"departamento": departamento, "sentimientos": sentimientos})
