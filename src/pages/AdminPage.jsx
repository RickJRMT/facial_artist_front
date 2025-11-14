import React, { useState } from 'react';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import Sidebar from '../components/admin/Sidebar';
import Navbar from '../components/admin/Navbar';
import StatCard from '../components/admin/StatCard';
import ClientesView from '../components/admin/views/ClientesView';
import ServiciosView from '../components/admin/views/ServiciosView';
import CursosView from '../components/admin/views/CursosView';
import './AdminPage.css';
import CitasAdmin from '../components/admin/CitasAdmin';
import Agenda from '../components/admin/Agenda';
import { useClientes } from '../hooks/CargarClientes';


const AdminPage = () => {
  const [activeMenu, setActiveMenu] = useState('inicio');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { clientes } = useClientes();


  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-app-container">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />

      {sidebarOpen && <div className="sidebar-overlay" onClick={handleSidebarClose}></div>}

      <div className="main-content">
        <Navbar onMenuClick={handleMenuClick} />

        {activeMenu === 'inicio' && (
          <div className="dashboard-content">
            <div className="dashboard-header">
              <h1 className="dashboard-title">Dashboard</h1>
              <p className="dashboard-subtitle">Resumen general del salón de belleza</p>
            </div>

            <div className="stats-grid">
              <StatCard
                title="Citas Hoy"
                value="23"
                subtitle="8 pendientes"
                icon={Calendar}
                iconColor="icon-yellow"
              />
              <StatCard
                title="Clientes Registrados"
                value={clientes.length || 0}
                subtitle="Total de clientes"
                icon={TrendingUp}
                iconColor="icon-green"
              />
              <StatCard
                title="Tiempo Promedio"
                value="45min"
                subtitle="por procedimiento"
                icon={Clock}
                iconColor="icon-blue"
              />
            </div>
          </div>
        )}

        {activeMenu === 'clientes' && <ClientesView />}
        {activeMenu === 'servicios' && <ServiciosView />}
        {activeMenu === 'citas' && <CitasAdmin />}
        {activeMenu === 'cursos' && <CursosView />}
        {activeMenu === 'agenda' && <Agenda />}
      </div>
    </div>
  );
};

export default AdminPage;
