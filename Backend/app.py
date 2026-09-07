from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
from logging import exception
from models import db, Pais, Departamento, Ciudad, TipoIdentificacion, Marca, Inscripcion
import os

app = Flask(__name__)
CORS(app)  # habilita peticiones desde el frontend (localhost:5173)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_DIR = os.path.join(BASE_DIR, "database")
os.makedirs(DB_DIR, exist_ok=True)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(DB_DIR, "fidelidad.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)


@app.route("/")
def home():
    return "<h1>API Programa de Fidelidad</h1>"


# ---------- CATÁLOGOS (para llenar los <select>) ----------

@app.route("/api/tipos-identificacion", methods=["GET"])
def getTiposIdentificacion():
    try:
        tipos = TipoIdentificacion.query.all()
        return jsonify([t.serializa() for t in tipos]), 200
    except Exception:
        exception("[SERVER]: Error")
        return jsonify({"msg": "Ha ocurrido un error"}), 500


@app.route("/api/marcas", methods=["GET"])
def getMarcas():
    try:
        marcas = Marca.query.all()
        return jsonify([m.serializa() for m in marcas]), 200
    except Exception:
        exception("[SERVER]: Error")
        return jsonify({"msg": "Ha ocurrido un error"}), 500


@app.route("/api/paises", methods=["GET"])
def getPaises():
    try:
        paises = Pais.query.all()
        return jsonify([p.serializa() for p in paises]), 200
    except Exception:
        exception("[SERVER]: Error")
        return jsonify({"msg": "Ha ocurrido un error"}), 500


@app.route("/api/departamentos", methods=["GET"])
def getDepartamentos():
    try:
        pais_id = request.args.get("pais_id")  # ?pais_id=1
        query = Departamento.query
        if pais_id:
            query = query.filter_by(pais_id=pais_id)
        departamentos = query.all()
        return jsonify([d.serializa() for d in departamentos]), 200
    except Exception:
        exception("[SERVER]: Error")
        return jsonify({"msg": "Ha ocurrido un error"}), 500


@app.route("/api/ciudades", methods=["GET"])
def getCiudades():
    try:
        departamento_id = request.args.get("departamento_id")  # ?departamento_id=1
        query = Ciudad.query
        if departamento_id:
            query = query.filter_by(departamento_id=departamento_id)
        ciudades = query.all()
        return jsonify([c.serializa() for c in ciudades]), 200
    except Exception:
        exception("[SERVER]: Error")
        return jsonify({"msg": "Ha ocurrido un error"}), 500


# ---------- INSCRIPCIONES ----------

@app.route("/api/inscripciones", methods=["GET"])
def getInscripciones():
    try:
        inscripciones = Inscripcion.query.all()
        return jsonify([i.serializa() for i in inscripciones]), 200
    except Exception:
        exception("[SERVER]: Error")
        return jsonify({"msg": "Ha ocurrido un error"}), 500


@app.route("/api/inscripciones", methods=["POST"])
def crearInscripcion():
    try:
        data = request.get_json()

        nueva = Inscripcion(
            tipo_identificacion_id=data["tipo_identificacion_id"],
            numero_identificacion=data["numero_identificacion"],
            nombres=data["nombres"],
            apellidos=data["apellidos"],
            fecha_nacimiento=datetime.strptime(data["fecha_nacimiento"], "%Y-%m-%d").date(),
            direccion=data["direccion"],
            ciudad_id=data["ciudad_id"],
            marca_id=data["marca_id"],
        )
        db.session.add(nueva)
        db.session.commit()
        return jsonify(nueva.serializa()), 201
    except KeyError as e:
        return jsonify({"msg": f"Falta el campo {e}"}), 400
    except Exception:
        exception("[SERVER]: Error")
        return jsonify({"msg": "Ha ocurrido un error"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=4000)