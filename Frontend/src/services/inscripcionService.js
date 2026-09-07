import api from './api';

export const crearInscripcion = (data) => api.post("/inscripciones", data);