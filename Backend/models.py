from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Pais(db.Model):
    __tablename__ = "pais"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False, unique=True)
    departamentos = db.relationship("Departamento", backref="pais", lazy=True)

    def serializa(self):
        return {"id": self.id, "nombre": self.nombre}


class Departamento(db.Model):
    __tablename__ = "departamento"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    pais_id = db.Column(db.Integer, db.ForeignKey("pais.id"), nullable=False)
    ciudades = db.relationship("Ciudad", backref="departamento", lazy=True)

    def serializa(self):
        return {"id": self.id, "nombre": self.nombre, "pais_id": self.pais_id}


class Ciudad(db.Model):
    __tablename__ = "ciudad"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    departamento_id = db.Column(db.Integer, db.ForeignKey("departamento.id"), nullable=False)

    def serializa(self):
        return {"id": self.id, "nombre": self.nombre, "departamento_id": self.departamento_id}


class TipoIdentificacion(db.Model):
    __tablename__ = "tipo_identificacion"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False, unique=True)

    def serializa(self):
        return {"id": self.id, "nombre": self.nombre}


class Marca(db.Model):
    __tablename__ = "marca"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False, unique=True)

    def serializa(self):
        return {"id": self.id, "nombre": self.nombre}


class Inscripcion(db.Model):
    __tablename__ = "inscripcion"
    id = db.Column(db.Integer, primary_key=True)
    tipo_identificacion_id = db.Column(db.Integer, db.ForeignKey("tipo_identificacion.id"), nullable=False)
    numero_identificacion = db.Column(db.String(30), nullable=False)
    nombres = db.Column(db.String(100), nullable=False)
    apellidos = db.Column(db.String(100), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    direccion = db.Column(db.String(200), nullable=False)
    ciudad_id = db.Column(db.Integer, db.ForeignKey("ciudad.id"), nullable=False)
    marca_id = db.Column(db.Integer, db.ForeignKey("marca.id"), nullable=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)

    tipo_identificacion = db.relationship("TipoIdentificacion")
    ciudad = db.relationship("Ciudad")
    marca = db.relationship("Marca")

    def serializa(self):
        return {
            "id": self.id,
            "tipo_identificacion": self.tipo_identificacion.nombre,
            "numero_identificacion": self.numero_identificacion,
            "nombres": self.nombres,
            "apellidos": self.apellidos,
            "fecha_nacimiento": self.fecha_nacimiento.isoformat(),
            "direccion": self.direccion,
            "ciudad": self.ciudad.nombre,
            "departamento": self.ciudad.departamento.nombre,
            "pais": self.ciudad.departamento.pais.nombre,
            "marca": self.marca.nombre,
            "fecha_registro": self.fecha_registro.isoformat(),
        }