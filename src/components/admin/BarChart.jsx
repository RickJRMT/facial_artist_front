import React from 'react';
import './BarChart.css';

const BarChart = () => {
  const data = [
    { day: 'Lun', value: 15 },
    { day: 'Mar', value: 18 },
    { day: 'Mie', value: 12 },
    { day: 'Jue', value: 20 },
    { day: 'Vie', value: 16 },
    { day: 'Sáb', value: 22 },
    { day: 'Dom', value: 8 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Citas Esta Semana</h3>
      <div className="bar-chart">
        {data.map((item, index) => (
          <div key={index} className="bar-container">
            <div
              className="bar"
              style={{
                height: `${(item.value / maxValue) * 100}%`
              }}
            >
              <span className="bar-value">{item.value}</span>
            </div>
            <span className="bar-label">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
