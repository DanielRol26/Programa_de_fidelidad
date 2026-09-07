import api from './api';

export const getTiposIdentificacion = () => api.get("/tipos-identificacion");
export const getMarcas = () => api.get("/marcas");
export const getPaises = () => api.get("/paises");
export const getDepartamentos = (paisId) => api.get("/departamentos", { params: { pais_id: paisId } });
export const getCiudades = (departamentoId) => api.get("/ciudades", { params: { departamento_id: departamentoId } });