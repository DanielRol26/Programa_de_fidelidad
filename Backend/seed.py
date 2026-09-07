from app import app
from models import db, Pais, Departamento, Ciudad, TipoIdentificacion, Marca

with app.app_context():
    db.drop_all()
    db.create_all()

    # Tipos de identificación
    tipos = ["Cédula de ciudadanía", "Cédula de extranjería", "Tarjeta de identidad", "Pasaporte"]
    for t in tipos:
        db.session.add(TipoIdentificacion(nombre=t))

    # Marcas del grupo
    marcas = ["Americanino", "American Eagle", "Chevignon", "Esprit", "Naf Naf", "Rifle"]
    for m in marcas:
        db.session.add(Marca(nombre=m))

    # Ubicaciones (ejemplo con Colombia, agrega más si necesitas)
    colombia = Pais(nombre="Colombia")
    db.session.add(colombia)
    db.session.flush()  # para obtener colombia.id antes del commit final

    antioquia = Departamento(nombre="Antioquia", pais_id=colombia.id)
    cundinamarca = Departamento(nombre="Cundinamarca", pais_id=colombia.id)
    db.session.add_all([antioquia, cundinamarca])
    db.session.flush()

    ciudades = [
        Ciudad(nombre="Medellín", departamento_id=antioquia.id),
        Ciudad(nombre="Envigado", departamento_id=antioquia.id),
        Ciudad(nombre="Itagüí", departamento_id=antioquia.id),
        Ciudad(nombre="Bogotá", departamento_id=cundinamarca.id),
        Ciudad(nombre="Soacha", departamento_id=cundinamarca.id),
    ]
    db.session.add_all(ciudades)

    db.session.commit()
    print("Base de datos poblada correctamente ✅")