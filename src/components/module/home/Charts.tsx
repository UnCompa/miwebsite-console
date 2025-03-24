import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface WeekData {
  week: string; // Formato de la semana
  count: number | null; // Contador de eventos
}

interface ChartsProps {
  data: WeekData[]; // Datos que se pasan como props
  startDate: string; // Fecha de inicio para generar semanas
  endDate: string; // Fecha de fin para generar semanas
}

function formatWeekRange(dateString: string): string {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric' };

  const startOfWeek = new Intl.DateTimeFormat('en-US', options).format(date);
  const endOfWeek = new Intl.DateTimeFormat('en-US', options).format(new Date(date.setDate(date.getDate() + 6)));

  return `${startOfWeek} - ${endOfWeek}`;
}

function generateWeeks(startDate: string, endDate: string): WeekData[] {
  const weeks: WeekData[] = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  // Ajustar la fecha de inicio al inicio de la semana
  currentDate.setDate(currentDate.getDate() - currentDate.getDay()); // Ajustar al inicio de la semana

  while (currentDate <= end) {
    weeks.push({
      week: currentDate.toISOString().split('T')[0], // Normalizamos la fecha
      count: 0, // Por defecto sin datos
    });
    currentDate.setDate(currentDate.getDate() + 7); // Avanzar una semana
  }

  return weeks;
}

function mergeWeeks(apiData: WeekData[], allWeeks: WeekData[]): WeekData[] {
  return allWeeks.map(week => {
    const found = apiData.find(d => d.week.split('T')[0] === week.week);
    return {
      week: formatWeekRange(week.week),
      count: found ? found.count : null, // Si no hay datos, dejamos null
    };
  });
}

const Bars: React.FC<ChartsProps> = ({ data, startDate, endDate }) => {
  const allWeeks = generateWeeks(startDate, endDate);
  const formattedData = mergeWeeks(data, allWeeks);

  return (
    <div className="p-4 bg-black rounded-lg shadow-lg text-white">
      <h2 className="text-lg font-semibold text-center">Event Counts per Week</h2>
      <p className="text-sm text-center text-gray-400">{`${startDate} - ${endDate}`}</p>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <defs>
            <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1f29337" />
          <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#9ca3af" }} />
          <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
          <Tooltip cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} contentStyle={{ backgroundColor: "#1e40af", color: "#fff", borderRadius: "8px", padding: "8px" }} />

          <Bar dataKey="count" fill="url(#colorBar)" radius={[8, 8, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Bars;
