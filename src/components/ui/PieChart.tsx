import clsx from 'clsx';
import React, { useState } from 'react';
import { FaChartPie, FaDownload } from 'react-icons/fa';
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Sector,
  Tooltip
} from 'recharts';
import { Theme, themes } from '../../constants/theme.constants';

// Tipos para los datos
export interface PieChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

// Props del componente
export interface PieChartProps {
  // Datos
  data: PieChartDataPoint[];

  // Apariencia
  title?: string;
  theme?: Theme;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  showPercentage?: boolean;
  showDownload?: boolean;

  // Animación
  animationDuration?: number;
  startAngle?: number;
  endAngle?: number;

  // Formato
  valueUnit?: string;

  // Callbacks
  onSliceClick?: (data: PieChartDataPoint) => void;

  // Clases personalizadas
  className?: string;
  chartClassName?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  // Datos
  data,

  // Apariencia
  title,
  theme = 'primary',
  height = 300,
  innerRadius = 0,
  outerRadius = 80,
  showLegend = true,
  showLabels = true,
  showPercentage = true,
  showDownload = true,

  // Animación
  animationDuration = 500,
  startAngle = 0,
  endAngle = 360,

  // Formato
  valueUnit,

  // Callbacks
  onSliceClick,

  // Clases personalizadas
  className,
  chartClassName,
}) => {
  // Estado para el sector activo
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Extraer el color del tema
  const themeColor = themes[theme].split(' ').find(cls => cls.startsWith('text-'))?.replace('text-', '') || 'cyan-500';

  // Calcular el total para porcentajes
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  // Función para descargar los datos como CSV
  const handleDownload = () => {
    // Crear encabezados
    const headers = ['name', 'value', 'percentage'];

    // Crear filas
    const rows = data.map(item => {
      const percentage = ((item.value / total) * 100).toFixed(2);
      return [item.name, item.value, percentage].join(',');
    });

    // Crear contenido CSV
    const csvContent = [
      headers.join(','),
      ...rows
    ].join('\n');

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pie-chart-data.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para personalizar el tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(2);

      return (
        <div className="bg-neutral-900/95 border border-neutral-800 rounded-lg shadow-lg p-3 text-sm">
          <p className="font-medium text-white mb-1">{data.name}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: payload[0].color }}
              />
              <span className="text-gray-300">Valor:</span>
              <span className="font-medium text-white">
                {data.value} {valueUnit}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 opacity-0" />
              <span className="text-gray-300">Porcentaje:</span>
              <span className="font-medium text-white">
                {percentage}%
              </span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Función para renderizar el sector activo
  const renderActiveShape = (props: any) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, value
    } = props;

    const percentage = ((value / total) * 100).toFixed(1);
    const displayValue = valueUnit ? `${value} ${valueUnit}` : value;
    const sin = Math.sin(-Math.PI / 2);
    const cos = Math.cos(-Math.PI / 2);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        {showLabels && (
          <>
            <path
              d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
              stroke={fill}
              fill="none"
            />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text
              x={ex + (cos >= 0 ? 1 : -1) * 12}
              y={ey}
              textAnchor={textAnchor}
              fill="#999"
              fontSize={12}
            >
              {payload.name}
            </text>
            <text
              x={ex + (cos >= 0 ? 1 : -1) * 12}
              y={ey}
              dy={14}
              textAnchor={textAnchor}
              fill="#fff"
              fontSize={12}
              fontWeight="bold"
            >
              {displayValue} ({percentage}%)
            </text>
          </>
        )}
      </g>
    );
  };

  // Función para manejar el hover en un sector
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // Función para manejar el click en un sector
  const handleSliceClick = (data: any) => {
    if (onSliceClick) {
      onSliceClick(data);
    }
  };

  return (
    <div className={clsx(
      "p-4 bg-neutral-900/90 border border-neutral-800 rounded-lg shadow-lg",
      className
    )}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <FaChartPie className={`text-${themeColor}`} />
          {title && (
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Botón de descargar */}
          {showDownload && (
            <button
              className={clsx(
                "p-2 rounded-lg text-gray-300 hover:text-white transition-colors",
                `hover:bg-${themeColor}/20`
              )}
              onClick={handleDownload}
              title="Descargar datos (CSV)"
            >
              <FaDownload />
            </button>
          )}
        </div>
      </div>

      {/* Gráfico */}
      <div className={clsx("relative", chartClassName)}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              activeIndex={activeIndex !== null ? activeIndex : undefined}
              activeShape={showLabels ? renderActiveShape : undefined}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={startAngle}
              endAngle={endAngle}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onClick={handleSliceClick}
              animationDuration={animationDuration}
              label={showLabels && !activeIndex ? (entry) => {
                if (showPercentage) {
                  const percentage = ((entry.value / total) * 100).toFixed(0);
                  return `${percentage}%`;
                }
                return entry.name;
              } : false}
              labelLine={showLabels && !activeIndex}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || getSeriesColor(index, theme)}
                  stroke="#1a1a1a"
                  strokeWidth={1}
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />

            {showLegend && (
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                formatter={(value, entry, index) => (
                  <span className="text-gray-300">{value}</span>
                )}
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Función para generar colores para las series basados en el tema
const getSeriesColor = (index: number, theme: Theme): string => {
  const themeColors: Record<Theme, string[]> = {
    primary: ['#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75'],
    secondary: ['#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'],
    success: ['#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d'],
    warning: ['#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207'],
    danger: ['#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c'],
    neutral: ['#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563'],
  };

  const colors = themeColors[theme] || themeColors.primary;
  return colors[index % colors.length];
};

export default PieChart;
