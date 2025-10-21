import React from 'react';
import './UpcomingAppointments.css';

const UpcomingAppointments = () => {
  const appointments = [
    {
      name: 'María González',
      service: 'Limpieza Facial',
      doctor: 'Dr. Ana',
      time: '10:00 AM',
    },
    {
      name: 'Carmen López',
      service: 'Microdermoabrasión',
      doctor: 'Dr. Sofía',
      time: '11:30 AM',
    },
    {
      name: 'Ana Rodríguez',
      service: 'Peeling Químico',
      doctor: 'Dr. Ana',
      time: '2:00 PM',
    },
  ];

  return (
    <div className="appointments-card">
      <h3 className="chart-title">Próximas Citas</h3>
      <div className="appointments-list">
        {appointments.map((apt, index) => (
          <div key={index} className="appointment-item">
            <div className="appointment-bar"></div>
            <div className="appointment-info">
              <h4 className="appointment-name">{apt.name}</h4>
              <p className="appointment-service">{apt.service}</p>
              {apt.doctor && <p className="appointment-doctor">{apt.doctor}</p>}
            </div>
            <div className="appointment-time">{apt.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
