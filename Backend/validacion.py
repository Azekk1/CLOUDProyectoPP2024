import fitz  # PyMuPDF
from PIL import Image

# Función para extraer texto de un PDF
def extraer_texto_pdf(ruta_pdf):
    texto = ''
    with fitz.open(ruta_pdf) as doc:
        for pagina in doc:
            texto += pagina.get_text()
    return texto



# Función para validar el nombre en el certificado
def validar_nombre_certificado(texto_certificado, nombre_estudiante):
    # Suponiendo que el nombre del estudiante debe aparecer exactamente como se proporciona
    return nombre_estudiante in texto_certificado

# Función para validar si el documento es un certificado
def es_certificado_valido(texto_certificado):
    texto_min = texto_certificado.lower()
    palabras_clave = ["aprobado", "approved", "completado", "complete"]
    return any(palabra in texto_min for palabra in palabras_clave)


#funcion validar certificado completa
def validar_certificado(ruta, nombre_estudiante):
    texto_certificado = extraer_texto_pdf(ruta)
    # O usar extraer_texto_imagen si el PDF contiene principalmente imágenes
    if es_certificado_valido(texto_certificado) and validar_nombre_certificado(texto_certificado, nombre_estudiante):
        return "aprobado"
    else:
        return "rechazado"
    