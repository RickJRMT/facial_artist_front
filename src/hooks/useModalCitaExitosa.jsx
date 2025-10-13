
import { useState } from 'react';

const useModalCitaExitosa = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [datosCita, setDatosCita] = useState({});

  const mostrarModal = (cita) => {
    setDatosCita(cita);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  return {
    modalVisible,
    mostrarModal,
    cerrarModal,
    datosCita,
  };
};

export default useModalCitaExitosa;
