// El Router-dom permite mostrar diferentes componentes o páginas según el URL, en este caso que trabajamos con 
// el headery cursos, cuando se ejecute el servidor va a dar la URL y a ella le tendrémos que agregar el elemento al que 
// queremos hacer referencia, por ejemplo: http://localhost:5173/header o http://localhost:5173/cursos
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CursosPage from './pages/cursoPage.jsx';
import SolicitarCitaPage from './pages/SolicitarCitaCliente.jsx';
import CalendarioCitas from './components/layout/calendarioCitas.jsx';
import ModalCitaExitosa from './components/layout/ModalCitaSolicitada.jsx';
import Adminpage from './pages/adminPage.jsx';

function App() {
  return (
    <BrowserRouter>
      {/* Definimos rutas con <Routes> y <Route path="..." element={<Componente />} />
      Cuando la URL coincide con el path, React muestra ese componente. */}
      <Routes>
        <Route path="/cursos" element={<CursosPage />} />
        <Route path='/cita' element={< SolicitarCitaPage />} />
        <Route path='/calendario' element={< CalendarioCitas />} />
        <Route path='/modal' element={<ModalCitaExitosa />} />
        <Route path='/admin' element={< Adminpage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
