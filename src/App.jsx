// El Router-dom permite mostrar diferentes componentes o páginas según el URL, en este caso que trabajamos con 
// el headery cursos, cuando se ejecute el servidor va a dar la URL y a ella le tendrémos que agregar el elemento al que 
// queremos hacer referencia, por ejemplo: http://localhost:5173/header o http://localhost:5173/cursos
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CursosPage from './pages/cursoPage.jsx';
import SolicitarCitaPage from './pages/SolicitarCitaCliente.jsx';
import CalendarioCitas from './components/layout/calendarioCitas.jsx';
import ModalCitaExitosa from './components/layout/ModalCitaSolicitada.jsx';
import Homecliente from './pages/homeCliente.jsx';
import Adminpage from './pages/adminPage.jsx';
import SolicitarCitaCard from './pages/SolicitarCitaAdmin.jsx';

function App() {
  return (
    <BrowserRouter>
      {/* Definimos rutas con <Routes> y <Route path="..." element={<Componente />} />
      Cuando la URL coincide con el path, React muestra ese componente. */}
      <Routes>
        {/* Ruta por defecto al entrar a la raiz (/) muestra HomeCliente */}
        <Route path='/' element={<Homecliente />} />

        <Route path="/cursos" element={<CursosPage />} />
        <Route path='/cita' element={< SolicitarCitaPage />} />
        <Route path='/calendario' element={< CalendarioCitas />} />
        <Route path='/modal' element={<ModalCitaExitosa />} />
        <Route path='/homecliente' element={< Homecliente />} />
        <Route path='/admin' element={< AdminPage />} />
        <Route path='/adminCita' element={< SolicitarCitaCard />} />

        {/* Opcional: redirección para rutas no encontradas */}
        <Route path="*" element={<Homecliente />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
