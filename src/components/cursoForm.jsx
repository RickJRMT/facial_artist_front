import { useState } from "react";
import { crearCurso } from "../Services/cursosConexion";
import { subirImagen } from "../Services/imagenesConexion";
import { fileToBase64 } from "../utils/imagenBase64";

export default function CursoForm({ onCursoCreado }) {
  const [formData, setFormData] = useState({
    idProfesional: "",
    nombreCurso: "",
    cursoDesc: "",
    cursoDuracion: "",
    cursoCosto: "",
    imagenBase64: "" // aquí guardamos la imagen para luego subirla
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const base64 = await fileToBase64(file); // conviertes a base64
    setFormData({ ...formData, imagenBase64: base64 }); // guardas en el estado
  } catch (err) {
    console.error("Error al convertir imagen:", err);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Paso 1: crear curso sin imagen
      const response = await crearCurso({
        idProfesional: formData.idProfesional,
        nombreCurso: formData.nombreCurso,
        cursoDesc: formData.cursoDesc,
        cursoDuracion: formData.cursoDuracion,
        cursoCosto: formData.cursoCosto
      });

      const nuevoCurso = response.data;

      // Paso 2: subir la imagen usando el idCurso devuelto
      if (formData.imagenBase64) {
        await subirImagen("cursos", "idCurso", nuevoCurso.idCurso, {
          imagen: formData.imagenBase64
        });

        // añadimos la imagen al objeto del curso
        nuevoCurso.cursoImagen = formData.imagenBase64;
      }

      alert("Curso creado con éxito ✅");

      setFormData({
        idProfesional: "",
        nombreCurso: "",
        cursoDesc: "",
        cursoDuracion: "",
        cursoCosto: "",
        imagenBase64: ""
      });

      if (onCursoCreado) onCursoCreado(nuevoCurso);
    } catch (error) {
      console.error(error);
      alert("Error al crear el curso ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h2>Crear Nuevo Curso</h2>

      <div>
        <label>ID Profesional:</label>
        <input
          type="number"
          name="idProfesional"
          value={formData.idProfesional}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Nombre del Curso:</label>
        <input
          type="text"
          name="nombreCurso"
          value={formData.nombreCurso}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Descripción:</label>
        <input
          type="text"
          name="cursoDesc"
          value={formData.cursoDesc}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Duración:</label>
        <input
          type="text"
          name="cursoDuracion"
          value={formData.cursoDuracion}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Costo:</label>
        <input
          type="number"
          name="cursoCosto"
          value={formData.cursoCosto}
          onChange={handleChange}
        />
      </div>

      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br />

      {formData.imagenBase64 && (
        <img src={formData.imagenBase64} alt="preview" width="150" />
      )}

      <button type="submit">Crear Curso</button>
    </form>
  );
}
