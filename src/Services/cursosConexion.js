import axiosInstance from './axiosInstance';

/**
 * URL base para las operaciones con cursos
 */
const API_URL_CURSOS = '/api/cursos';

/**
 * Obtiene la lista de todos los cursos disponibles
 * @returns {Promise<Array>} Array de cursos transformados para el frontend
 * @throws {Error} Si hay un error en la petición
 */
export const obtenerCursos = async () => {
    try {
        const response = await axiosInstance.get(API_URL_CURSOS);
        // Transformar los datos para que el frontend use los nombres esperados
        const cursos = Array.isArray(response.data)
            ? response.data.map(c => ({
                id: c.idCurso,
                nombre: c.nombreCurso,
                descripcion: c.cursoDescripcion,
                duracion: c.cursoDuracion,
                precio: c.cursoCosto,
                costo: c.cursoCosto, // Alias para compatibilidad
                estado: c.cursoEstado,
                imagen: c.cursoImagen,
                fechaCreacion: c.fechaCreacion,
                // Mantener también las propiedades originales para compatibilidad
                idCurso: c.idCurso,
                nombreCurso: c.nombreCurso,
                cursoDescripcion: c.cursoDescripcion,
                cursoDuracion: c.cursoDuracion,
                cursoCosto: c.cursoCosto,
                cursoEstado: c.cursoEstado,
                cursoImagen: c.cursoImagen
            }))
            : [];
        return cursos;
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        throw error;
    }
};

/**
 * Obtiene un curso por su ID
 * @param {number} id - ID del curso a obtener
 * @returns {Promise<Object>} Datos del curso
 * @throws {Error} Si hay un error en la petición o el curso no existe
 */
export const obtenerCursoPorId = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL_CURSOS}/${id}`);
        const curso = response.data;
        return {
            id: curso.idCurso,
            nombre: curso.nombreCurso,
            descripcion: curso.cursoDescripcion,
            duracion: curso.cursoDuracion,
            precio: curso.cursoCosto,
            costo: curso.cursoCosto,
            estado: curso.cursoEstado,
            imagen: curso.cursoImagen,
            fechaCreacion: curso.fechaCreacion,
            // Propiedades originales
            idCurso: curso.idCurso,
            nombreCurso: curso.nombreCurso,
            cursoDescripcion: curso.cursoDescripcion,
            cursoDuracion: curso.cursoDuracion,
            cursoCosto: curso.cursoCosto,
            cursoEstado: curso.cursoEstado,
            cursoImagen: curso.cursoImagen
        };
    } catch (error) {
        console.error(`Error al obtener curso con ID ${id}:`, error);
        throw error;
    }
};

/**
 * Crea un nuevo curso en el sistema
 * @param {Object} cursoData - Datos del curso a crear
 * @param {string} cursoData.nombreCurso - Nombre del curso
 * @param {string} cursoData.cursoDescripcion - Descripción del curso
 * @param {string} cursoData.cursoDuracion - Duración del curso
 * @param {number} cursoData.cursoCosto - Costo del curso
 * @param {string} [cursoData.cursoEstado] - Estado del curso ('activo' o 'inactivo', por defecto 'activo')
 * @param {string} [cursoData.cursoImagen] - Imagen en LONGBLOB (opcional)
 * @returns {Promise<Object>} Datos del curso creado
 * @throws {Error} Si hay un error en la creación
 */
export const crearCurso = async (cursoData) => {
    try {
        const response = await axiosInstance.post(API_URL_CURSOS, cursoData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear curso:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Actualiza un curso existente
 * @param {number} id - ID del curso a actualizar
 * @param {Object} cursoData - Datos actualizados del curso
 * @param {string} [cursoData.nombreCurso] - Nombre del curso (opcional)
 * @param {string} [cursoData.cursoDescripcion] - Descripción del curso (opcional)
 * @param {string} [cursoData.cursoDuracion] - Duración del curso (opcional)
 * @param {number} [cursoData.cursoCosto] - Costo del curso (opcional)
 * @param {string} [cursoData.cursoEstado] - Estado del curso ('activo' o 'inactivo') (opcional)
 * @param {string} [cursoData.cursoImagen] - Imagen en LONGBLOB (opcional)
 * @returns {Promise<Object>} Datos del curso actualizado
 * @throws {Error} Si hay un error en la actualización
 */
export const actualizarCurso = async (id, cursoData) => {
    try {
        const response = await axiosInstance.put(`${API_URL_CURSOS}/${id}`, cursoData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar curso:', error);
        throw error;
    }
};

/**
 * Elimina un curso del sistema
 * @param {number} id - ID del curso a eliminar
 * @returns {Promise<Object>} Resultado de la eliminación
 * @throws {Error} Si hay un error en la eliminación
 */
export const eliminarCurso = async (id) => {
    try {
        const response = await axiosInstance.delete(`${API_URL_CURSOS}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar curso:', error);
        
        // Personalizar el mensaje de error según el tipo de respuesta del servidor
        if (error.response?.status === 409 || error.response?.status === 400) {
            // Error por conflicto - probablemente tiene estudiantes inscritos o citas activas
            const errorMessage = error.response?.data?.message || 'El curso tiene estudiantes inscritos y no puede ser eliminado';
            const customError = new Error(errorMessage);
            customError.code = 'ACTIVE_STUDENTS';
            throw customError;
        }
        
        throw error;
    }
};

// Mantener compatibilidad con nombres anteriores
export const getCursos = obtenerCursos;
export const getCursoPorId = obtenerCursoPorId;

