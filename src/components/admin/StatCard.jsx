import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, subtitle, icon: Icon, iconColor }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <div className={`stat-icon ${iconColor}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-subtitle">{subtitle}</div>
    </div>
  );
};

export default StatCard;
