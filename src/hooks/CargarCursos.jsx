import { useState, useEffect } from 'react';
import { obtenerCursos } from '../Services/cursosConexion';

export function UseCursos() {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarCursos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await obtenerCursos();
            setCursos(data);
        } catch (error) {
            console.error('Error al cargar cursos:', error);
            setError(error);
            setCursos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarCursos();
    }, []);

    return { 
        cursos, 
        loading, 
        error, 
        recargarCursos: cargarCursos 
    };
}

export function UseCursosActivos() {
    const { cursos, loading, error, recargarCursos } = UseCursos();
    
    const cursosActivos = cursos.filter(curso => 
        (curso.estado || curso.cursoEstado || 'activo') === 'activo'
    );

    return { 
        cursos: cursosActivos, 
        loading, 
        error, 
        recargarCursos 
    };
}