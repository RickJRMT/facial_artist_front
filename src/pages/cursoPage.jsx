import { useEffect, useState } from "react";
import { getCursos, eliminarCurso } from "../Services/cursosConexion.js";
import CursoForm from "../components/cursoForm";


export default function CursosPage() {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    getCursos().then(res => setCursos(res.data));
  }, []);

  const handleCursoCreado = (nuevoCurso) => {
    setCursos([...cursos, nuevoCurso]);
  };

  const handleDelete = (id) => {
    deleteCurso(id).then(() => {
      setCursos(cursos.filter(curso => curso.idCurso !== id));
    });
  };

  return (
    <div>
      <h1>Gestión de Cursos</h1>

      <CursoForm onCursoCreado={handleCursoCreado} />

      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Curso</th>
            <th>Descripción</th>
            <th>Duración</th>
            <th>Costo</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso) => (
            <tr key={curso.idCurso}>
              <td>{curso.idCurso}</td>
              <td>{curso.nombreCurso}</td>
              <td>{curso.cursoDesc}</td>
              <td>{curso.cursoDuracion}</td>
              <td>${curso.cursoCosto}</td>
              <td>
                {curso.cursoImagen ? (
                  <img
                    src={curso.cursoImagen}
                    alt={curso.nombreCurso}
                    width="80"
                    height="60"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  "Sin imagen"
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(curso.idCurso)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
