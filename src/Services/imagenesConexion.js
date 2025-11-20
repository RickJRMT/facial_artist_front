import axiosInstance from "./axiosInstance";

const API_URL_IMAGENES = "http://localhost:3000/api/imagenes";

// Subir imagen a un curso
export const subirImagen = (tabla, campoId, id, imagenData) => {
  return axiosInstance.put(`${API_URL_IMAGENES}/subir/${tabla}/${campoId}/${id}`, imagenData);
};

// Obtener imagen
export const obtenerImagen = (tabla, campoId, id) => {
  return axiosInstance.get(`${API_URL_IMAGENES}/obtener/${tabla}/${campoId}/${id}`);
};

// Eliminar imagen
export const eliminarImagen = (tabla, campoId, id) => {
  return axiosInstance.delete(`${API_URL_IMAGENES}/eliminar/${tabla}/${campoId}/${id}`);
};

// Insertar imagen
export const insertarImagen = (tabla, campoId, id, imagenData) => {
  return axiosInstance.post(`${API_URL_IMAGENES}/insertar/${tabla}/${campoId}/${id}`, imagenData);
};
