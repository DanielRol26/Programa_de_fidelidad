import { useEffect, useState } from "react";
import {
    getTiposIdentificacion,
    getMarcas,
    getPaises,
    getDepartamentos,
    getCiudades,
} from "../../services/catalogoService";
import { crearInscripcion } from "../../services/inscripcionService";
import "./InscripcionForm.css";

const initialForm = {
    tipo_identificacion_id: "",
    numero_identificacion: "",
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    direccion: "",
    pais_id: "",
    departamento_id: "",
    ciudad_id: "",
    marca_id: "",
};

function InscripcionForm() {
    const [form, setForm] = useState(initialForm);

    const [tipos, setTipos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [paises, setPaises] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [ciudades, setCiudades] = useState([]);

    const [mensaje, setMensaje] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getTiposIdentificacion()
            .then((res) => setTipos(res.data || []))
            .catch(() => setTipos([]));
        getMarcas()
            .then((res) => setMarcas(res.data || []))
            .catch(() => setMarcas([]));
        getPaises()
            .then((res) => setPaises(res.data || []))
            .catch(() => setPaises([]));
    }, []);

    useEffect(() => {
        if (form.pais_id) {
            getDepartamentos(form.pais_id)
                .then((res) => setDepartamentos(res.data || []))
                .catch(() => setDepartamentos([]));
        }
    }, [form.pais_id]);

    useEffect(() => {
        if (form.departamento_id) {
            getCiudades(form.departamento_id)
                .then((res) => setCiudades(res.data || []))
                .catch(() => setCiudades([]));
        }
    }, [form.departamento_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => {
            if (name === "pais_id") {
                return { ...prev, pais_id: value, departamento_id: "", ciudad_id: "" };
            }
            if (name === "departamento_id") {
                return { ...prev, departamento_id: value, ciudad_id: "" };
            }
            return { ...prev, [name]: value };
        });

        if (name === "pais_id") setDepartamentos([]);
        if (name === "pais_id" || name === "departamento_id") setCiudades([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(null);
        setIsSubmitting(true);

        try {
            const datosParaBackend = { ...form };
            delete datosParaBackend.pais_id;
            delete datosParaBackend.departamento_id;
            await crearInscripcion(datosParaBackend);
            setMensaje({ tipo: "exito", texto: "¡Inscripción registrada con éxito!" });
            setForm(initialForm);
            setDepartamentos([]);
            setCiudades([]);
        } catch {
            setMensaje({ tipo: "error", texto: "Ocurrió un error al registrar la inscripción." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-card">
            <div className="form-top-accent" />
            <form className="form-content" onSubmit={handleSubmit}>
                <div className="form-section">
                    <h2 className="form-section-title">Datos Personales</h2>

                    <div className="form-grid-2" style={{ marginBottom: "1.25rem" }}>
                        <div className="form-field">
                            <label className="form-label" htmlFor="tipo_identificacion_id">
                                Tipo de identificación <span className="form-required">*</span>
                            </label>
                            <div className="form-select-wrapper">
                                <select
                                    id="tipo_identificacion_id"
                                    name="tipo_identificacion_id"
                                    className="form-select"
                                    value={form.tipo_identificacion_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona un tipo</option>
                                    {tipos.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-field">
                            <label className="form-label" htmlFor="numero_identificacion">
                                Número de identificación <span className="form-required">*</span>
                            </label>
                            <input
                                id="numero_identificacion"
                                type="text"
                                name="numero_identificacion"
                                className="form-input"
                                placeholder="Ej: 1023456789"
                                value={form.numero_identificacion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-grid-2" style={{ marginBottom: "1.25rem" }}>
                        <div className="form-field">
                            <label className="form-label" htmlFor="nombres">
                                Nombres <span className="form-required">*</span>
                            </label>
                            <input
                                id="nombres"
                                type="text"
                                name="nombres"
                                className="form-input"
                                placeholder="Tus nombres"
                                value={form.nombres}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label" htmlFor="apellidos">
                                Apellidos <span className="form-required">*</span>
                            </label>
                            <input
                                id="apellidos"
                                type="text"
                                name="apellidos"
                                className="form-input"
                                placeholder="Tus apellidos"
                                value={form.apellidos}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-field">
                            <label className="form-label" htmlFor="fecha_nacimiento">
                                Fecha de nacimiento <span className="form-required">*</span>
                            </label>
                            <input
                                id="fecha_nacimiento"
                                type="date"
                                name="fecha_nacimiento"
                                className="form-input"
                                value={form.fecha_nacimiento}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label" htmlFor="direccion">
                                Dirección de residencia <span className="form-required">*</span>
                            </label>
                            <input
                                id="direccion"
                                type="text"
                                name="direccion"
                                className="form-input"
                                placeholder="Ej: Calle 123 #45-67"
                                value={form.direccion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="form-section-title">Ubicación</h2>

                    <div className="form-grid-3">
                        <div className="form-field">
                            <label className="form-label" htmlFor="pais_id">
                                País <span className="form-required">*</span>
                            </label>
                            <div className="form-select-wrapper">
                                <select
                                    id="pais_id"
                                    name="pais_id"
                                    className="form-select"
                                    value={form.pais_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona un país</option>
                                    {paises.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-field">
                            <label className="form-label" htmlFor="departamento_id">
                                Departamento <span className="form-required">*</span>
                            </label>
                            <div className={`form-select-wrapper ${!form.pais_id ? "disabled" : ""}`}>
                                <select
                                    id="departamento_id"
                                    name="departamento_id"
                                    className="form-select"
                                    value={form.departamento_id}
                                    onChange={handleChange}
                                    required
                                    disabled={!form.pais_id}
                                >
                                    <option value="">
                                        {form.pais_id ? "Selecciona un departamento" : "Selecciona primero un país"}
                                    </option>
                                    {departamentos.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {!form.pais_id && <span className="form-hint">Requiere país</span>}
                        </div>

                        <div className="form-field">
                            <label className="form-label" htmlFor="ciudad_id">
                                Ciudad <span className="form-required">*</span>
                            </label>
                            <div className={`form-select-wrapper ${!form.departamento_id ? "disabled" : ""}`}>
                                <select
                                    id="ciudad_id"
                                    name="ciudad_id"
                                    className="form-select"
                                    value={form.ciudad_id}
                                    onChange={handleChange}
                                    required
                                    disabled={!form.departamento_id}
                                >
                                    <option value="">
                                        {form.departamento_id ? "Selecciona una ciudad" : "Selecciona un departamento"}
                                    </option>
                                    {ciudades.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {!form.departamento_id && <span className="form-hint">Requiere departamento</span>}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="form-section-title">Marca de Preferencia</h2>

                    <div className="form-grid-full">
                        <div className="form-field">
                            <label className="form-label" htmlFor="marca_id">
                                Marca <span className="form-required">*</span>
                            </label>
                            <div className="form-select-wrapper">
                                <select
                                    id="marca_id"
                                    name="marca_id"
                                    className="form-select"
                                    value={form.marca_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona una marca</option>
                                    {marcas.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <span className="spinner" aria-hidden="true" />
                                <span>Registrando inscripción...</span>
                            </>
                        ) : (
                            <span>Registrarme</span>
                        )}
                    </button>

                    {mensaje && (
                        <div
                            className={`feedback-card ${
                                mensaje.tipo === "exito" ? "feedback-success" : "feedback-error"
                            }`}
                            role="alert"
                        >
                            {mensaje.tipo === "exito" ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            )}
                            <span>{mensaje.texto}</span>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}

export default InscripcionForm;