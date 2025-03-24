import React, { useState } from 'react';
import BarChartComponent, { BarChartData } from '../components/ui/BarChart';

const Homepage: React.FC = () => {
  const [data] = useState<BarChartData[]>([
    {
      name: "2025-03-17",
      value: 138
    },
    {
      name: "2025-03-23",
      value: 120
    },
    {
      name: "2025-03-01",
      value: 34
    },
  ]
  );
  const startDate = "2025-03-01";
  const endDate = "2025-03-23";

  return (
    <div>
      <h1 className="font-bold text-3xl py-2">Bienvenido de nuevo <span className="text-shadow bg-gradient-to-tr from-cyan-500 to-teal-200 bg-clip-text text-transparent hover:translate-y-0.5 transition-all">Juan</span></h1>
      <div className="grid grid-cols-3">
        <BarChartComponent title='Secciones de la semana' data={data} startDate={startDate} endDate={endDate} />
      </div>
    </div>
  )
}

export default Homepage