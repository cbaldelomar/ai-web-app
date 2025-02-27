# Import blueprints from individual route files
from .home import home_bp
from .facial_recognition import facial_recognition_bp
from .text_analysis import text_analysis_bp
from .chatbot import chatbot_bp

# List of blueprints to register in main app
blueprints = [home_bp, facial_recognition_bp, text_analysis_bp, chatbot_bp]
