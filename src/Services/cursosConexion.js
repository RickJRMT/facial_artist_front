import axios from "axios";

const API_URL_CURSOS = "http://localhost:3000/api/cursos"

export const getCursos = () => {
    return axios.get(API_URL_CURSOS);
};

export const getCursoPorId = (id) => {
    return axios.get(`${API_URL_CURSOS}/${id}`);
}

export const crearCurso = (curso) => {
    return axios.post(API_URL_CURSOS, curso);
}

export const actualizarCurso = (id, curso) => {
    return axios.put(`${API_URL_CURSOS}/${id}`, curso);
}

export const eliminarCurso = (id) => {
    return axios.delete(`${API_URL_CURSOS}/${id}`);
}

