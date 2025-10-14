import React from 'react';
import './DonutChart.css';

const DonutChart = () => {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Estado de Citas Hoy</h3>
      <div className="donut-chart">
        <svg viewBox="0 0 200 200" className="donut-svg">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#22c55e"
            strokeWidth="40"
            strokeDasharray="314 314"
            transform="rotate(-90 100 100)"
          />
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#d4a017"
            strokeWidth="40"
            strokeDasharray="157 471"
            strokeDashoffset="-314"
            transform="rotate(-90 100 100)"
          />
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#ef4444"
            strokeWidth="40"
            strokeDasharray="78 550"
            strokeDashoffset="-471"
            transform="rotate(-90 100 100)"
          />
        </svg>
      </div>
    </div>
  );
};

export default DonutChart;
