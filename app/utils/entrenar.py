from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import joblib

# Definir las categorías y los textos asociados
categorias_textos = {
    "Atención Estudiantil": [
        "¿Cómo puedo inscribirme en el próximo semestre?",
        "Necesito un certificado de estudios",
        "Quiero información sobre las becas disponibles",
        "¿Cuáles son los requisitos para cambiar de carrera?",
        "No encuentro mi horario de clases en la plataforma",
        "Me gustaría solicitar un cambio de asignatura",
        "¿Dónde puedo solicitar una constancia de estudios?",
        "Necesito ayuda con la inscripción a materias en línea",
        "¿Cómo puedo hacer una equivalencia de materias?",
        "Tengo problemas con mi expediente académico",
    ],
    "TIC": [
        "No puedo acceder a la plataforma de aprendizaje",
        "Olvidé mi contraseña del correo institucional",
        "El sistema no carga mis materias inscritas",
        "Error al subir una tarea en la plataforma",
        "Mi acceso al campus virtual está bloqueado",
        "¿Cómo configuro mi correo en el celular?",
        "Tengo problemas con el acceso al portal del estudiante",
        "No recibo correos en mi cuenta institucional",
        "¿Cómo recupero mi usuario de la plataforma?",
        "Se cayó la red WiFi del campus",
    ],
    "Caja": [
        "Necesito un comprobante de pago de mi matrícula",
        "¿Dónde puedo pagar mi colegiatura?",
        "Me cobraron doble la inscripción, ¿qué hago?",
        "Quiero saber si hay descuentos por pago anticipado",
        "Solicito una factura con mis datos fiscales",
        "¿Puedo pagar la matrícula en cuotas?",
        "Quiero conocer las fechas de pago del semestre",
        "¿Dónde puedo ver mis pagos anteriores?",
        "No me aparece el pago reflejado en la plataforma",
        "¿Cómo solicito un reembolso de mi matrícula?",
    ],
    "Soporte Técnico": [
        "El proyector del aula no funciona",
        "La conexión WiFi en la biblioteca es muy lenta",
        "El software del laboratorio de informática da error",
        "No puedo imprimir en la sala de computadoras",
        "Mi computadora no enciende y la necesito para mi clase",
        "La impresora de la biblioteca no tiene tinta",
        "El aire acondicionado en el aula no funciona",
        "Se desconfiguró mi cuenta en la PC del laboratorio",
        "El proyector muestra una imagen borrosa",
        "Necesito asistencia con mi cuenta de usuario",
    ],
    "Cobro": [
        "¿Cuánto debo por este semestre?",
        "Quiero saber si tengo pagos pendientes",
        "¿Puedo hacer un convenio de pago?",
        "Me llegó una notificación de deuda que ya pagué",
        "Necesito un estado de cuenta actualizado",
        "¿Cómo puedo pagar mi deuda en línea?",
        "Me llegó un aviso de cobro erróneo",
        "Quiero saber si puedo diferir el pago de la colegiatura",
        "¿Cuánto tiempo tengo para pagar antes de recargos?",
        "No me han aplicado un pago que realicé",
    ],
    "RRHH": [
        "¿Cuándo se deposita la nómina de los docentes?",
        "Necesito actualizar mis datos en Recursos Humanos",
        "Quiero saber sobre las prestaciones para empleados",
        "¿Cómo puedo solicitar un permiso laboral?",
        "Me gustaría aplicar a una vacante en la universidad",
        "¿Cómo puedo solicitar un aumento de sueldo?",
        "Tengo dudas sobre mis aportaciones a la seguridad social",
        "¿Cuáles son los requisitos para solicitar vacaciones?",
        "Necesito mi recibo de pago de nómina",
        "Quiero saber sobre los beneficios para jubilados",
    ],
    "Coordinación": [
        "Quiero cambiarme de horario en una materia",
        "Mi profesor no aparece en la lista de asignaciones",
        "Necesito coordinar la fecha de mi examen final",
        "¿Cuándo se publican los horarios del próximo ciclo?",
        "Me gustaría reunirme con el coordinador académico",
        "Necesito información sobre la carga académica",
        "Mi grupo ha cambiado sin previo aviso",
        "Quiero saber cómo solicitar una tutoría académica",
        "¿Cuáles son los criterios para la asignación de profesores?",
        "¿Cómo puedo inscribirme en una materia optativa?",
    ],
}

# Expandir las listas en textos y etiquetas
textos = []
etiquetas = []
for categoria, lista_textos in categorias_textos.items():
    textos.extend(lista_textos)
    etiquetas.extend([categoria] * len(lista_textos))

# Crear el modelo de clasificación
modelo = make_pipeline(TfidfVectorizer(), MultinomialNB())

# Entrenar el modelo
modelo.fit(textos, etiquetas)

# Guardar el modelo completo
joblib.dump(modelo, "app/utils/modelo_clasificacion.pkl")
