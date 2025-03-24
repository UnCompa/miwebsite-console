import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface BarChartData {
  name: string; // Nombre de la categoría o etiqueta
  value: number; // Valor correspondiente
}

interface BarChartProps {
  data: BarChartData[]; // Datos que se pasan como props
  title: string; // Título del gráfico
  startDate: string; // Fecha de inicio para mostrar
  endDate: string; // Fecha de fin para mostrar
}

const BarChartComponent: React.FC<BarChartProps> = ({ data, title, startDate, endDate }) => {
  return (
    <div className="p-4 bg-stone-950/5 border-stone-200/10 text-stone-200 rounded-lg shadow-lg border">
      <h2 className="text-lg font-semibold text-center">{title}</h2>
      <p className="text-sm text-center text-gray-400">{`${startDate} - ${endDate}`}</p>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <defs>
            <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1f29337" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} />
          <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
          <Tooltip cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} contentStyle={{ backgroundColor: "#1e40af", color: "#fff", borderRadius: "8px", padding: "8px" }} />

          <Bar dataKey="value" fill="url(#colorBar)" radius={[8, 8, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartComponent;