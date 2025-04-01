import clsx from 'clsx';
import { format, isAfter, parseISO, subDays, subHours, subMonths, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useEffect, useMemo, useState } from 'react';
import { FaChartLine, FaDownload, FaSync } from 'react-icons/fa';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ReferenceLine as RechartsReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Theme, themes } from '../../constants/theme.constants';

// Tipos para los datos
export interface ChartDataPoint {
  [key: string]: any;
  timestamp: string | Date; // Requerido para filtrado por tiempo
}

// Tipo para las series de datos
export interface DataSeries {
  key: string;
  name: string;
  color?: string;
  type?: 'line' | 'area';
  strokeDasharray?: string;
}

// Tipo para las líneas de referencia
export interface ReferenceLine {
  y?: number;
  x?: string | number | Date;
  label?: string;
  color?: string;
}

// Tipo para los rangos de tiempo predefinidos
export type TimeRange = '1h' | '3h' | '12h' | '1d' | '3d' | '1w' | '2w' | '1m' | 'all';

// Tipo para el estilo de curva
export type CurveType = 'linear' | 'natural' | 'step' | 'monotone';

// Props del componente
export interface LineChartProps {
  // Datos y configuración
  data: ChartDataPoint[];
  series: DataSeries[];
  timestampKey?: string;

  // Apariencia
  title?: string;
  theme?: Theme;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  showDownload?: boolean;
  showDataPoints?: boolean;

  // Estilo de línea
  curveType?: CurveType;
  strokeWidth?: number;

  // Líneas de referencia
  referenceLines?: ReferenceLine[];

  // Formato
  xAxisFormat?: string;
  tooltipTimeFormat?: string;
  yAxisUnit?: string;

  // Filtrado de tiempo
  defaultTimeRange?: TimeRange;
  showTimeRangeSelector?: boolean;

  // Callbacks
  onRefresh?: () => void;

  // Clases personalizadas
  className?: string;
  chartClassName?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  // Datos y configuración
  data,
  series,
  timestampKey = 'timestamp',

  // Apariencia
  title,
  theme = 'primary',
  height = 300,
  showLegend = true,
  showGrid = true,
  showDownload = true,
  showDataPoints = true,

  // Estilo de línea
  curveType = 'monotone',
  strokeWidth = 2,

  // Líneas de referencia
  referenceLines = [],

  // Formato
  xAxisFormat = 'HH:mm',
  tooltipTimeFormat = 'dd MMM yyyy HH:mm',
  yAxisUnit,

  // Filtrado de tiempo
  defaultTimeRange = '1d',
  showTimeRangeSelector = true,

  // Callbacks
  onRefresh,

  // Clases personalizadas
  className,
  chartClassName,
}) => {
  // Estado para el rango de tiempo seleccionado
  const [timeRange, setTimeRange] = useState<TimeRange>(defaultTimeRange);

  // Estado para controlar si se está actualizando
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Extraer el color del tema
  const themeColor = themes[theme].split(' ').find(cls => cls.startsWith('text-'))?.replace('text-', '') || 'cyan-500';

  // Función para obtener la fecha límite según el rango de tiempo
  const getTimeRangeLimit = (range: TimeRange): Date => {
    const now = new Date();

    switch (range) {
      case '1h': return subHours(now, 1);
      case '3h': return subHours(now, 3);
      case '12h': return subHours(now, 12);
      case '1d': return subDays(now, 1);
      case '3d': return subDays(now, 3);
      case '1w': return subWeeks(now, 1);
      case '2w': return subWeeks(now, 2);
      case '1m': return subMonths(now, 1);
      case 'all': return new Date(0); // Principio de los tiempos
      default: return subDays(now, 1);
    }
  };

  // Filtrar datos según el rango de tiempo seleccionado
  const filteredData = useMemo(() => {
    if (timeRange === 'all') return data;

    const timeLimit = getTimeRangeLimit(timeRange);

    return data.filter(item => {
      const timestamp = typeof item[timestampKey] === 'string'
        ? parseISO(item[timestampKey])
        : item[timestampKey];

      return isAfter(timestamp, timeLimit);
    });
  }, [data, timeRange, timestampKey]);

  // Formatear datos para Recharts
  const formattedData = useMemo(() => {
    return filteredData.map(item => {
      const timestamp = typeof item[timestampKey] === 'string'
        ? parseISO(item[timestampKey])
        : item[timestampKey];

      return {
        ...item,
        [timestampKey]: timestamp,
        formattedTime: format(timestamp, xAxisFormat, { locale: es })
      };
    });
  }, [filteredData, timestampKey, xAxisFormat]);

  // Función para manejar la actualización
  const handleRefresh = () => {
    if (onRefresh) {
      setIsRefreshing(true);
      onRefresh();

      // Simular un tiempo de carga
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };

  // Función para descargar los datos como CSV
  const handleDownload = () => {
    // Crear encabezados
    const headers = [timestampKey, ...series.map(s => s.key)];

    // Crear filas
    const rows = formattedData.map(item => {
      return headers.map(header => {
        if (header === timestampKey) {
          return format(item[header], 'yyyy-MM-dd HH:mm:ss');
        }
        return item[header] || 0;
      }).join(',');
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
    link.setAttribute('download', `chart-data-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Efecto para simular la actualización cuando cambia el rango de tiempo
  useEffect(() => {
    setIsRefreshing(true);
    const timer = setTimeout(() => {
      setIsRefreshing(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [timeRange]);

  // Función para formatear el tooltip
  const formatTooltip = (value: number, name: string) => {
    const matchingSeries = series.find(s => s.key === name);
    const displayName = matchingSeries ? matchingSeries.name : name;

    if (yAxisUnit) {
      return [`${value} ${yAxisUnit}`, displayName];
    }

    return [value, displayName];
  };

  // Función para personalizar el tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900/95 border border-neutral-800 rounded-lg shadow-lg p-3 text-sm">
          <p className="font-medium text-white mb-1">
            {typeof label === 'object'
              ? format(label, tooltipTimeFormat, { locale: es })
              : label}
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`tooltip-${index}`} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-300">{entry.name}:</span>
                <span className="font-medium text-white">
                  {entry.value} {yAxisUnit}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  // Opciones de rango de tiempo
  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: '1h', label: '1h' },
    { value: '3h', label: '3h' },
    { value: '12h', label: '12h' },
    { value: '1d', label: '1d' },
    { value: '3d', label: '3d' },
    { value: '1w', label: '1w' },
    { value: '2w', label: '2w' },
    { value: '1m', label: '1m' },
    { value: 'all', label: 'Todo' },
  ];

  // Verificar si hay series de tipo área
  const hasAreaSeries = series.some(s => s.type === 'area');

  return (
    <div className={clsx(
      "p-4 bg-neutral-900/90 border border-neutral-800 rounded-lg shadow-lg",
      className
    )}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <FaChartLine className={`text-${themeColor}`} />
          {title && (
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Selector de rango de tiempo */}
          {showTimeRangeSelector && (
            <div className="flex items-center bg-neutral-800 rounded-lg overflow-hidden">
              {timeRangeOptions.map(option => (
                <button
                  key={option.value}
                  className={clsx(
                    "px-2 py-1 text-xs font-medium transition-colors",
                    timeRange === option.value
                      ? `bg-${themeColor} text-white`
                      : "text-gray-300 hover:bg-neutral-700"
                  )}
                  onClick={() => setTimeRange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {/* Botón de actualizar */}
          {onRefresh && (
            <button
              className={clsx(
                "p-2 rounded-lg text-gray-300 hover:text-white transition-colors",
                `hover:bg-${themeColor}/20`,
                isRefreshing && "animate-spin"
              )}
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Actualizar datos"
            >
              <FaSync />
            </button>
          )}

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
        {isRefreshing && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/50 z-10 rounded-lg">
            <div className="animate-pulse text-white font-medium">Actualizando...</div>
          </div>
        )}

        <ResponsiveContainer width="100%" height={height}>
          {hasAreaSeries ? (
            <ComposedChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              )}

              <XAxis
                dataKey={timestampKey}
                tickFormatter={(value) => {
                  if (typeof value === 'object') {
                    return format(value, xAxisFormat, { locale: es });
                  }
                  return value;
                }}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={{ stroke: '#4b5563' }}
                tickLine={{ stroke: '#4b5563' }}
              />

              <YAxis
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={{ stroke: '#4b5563' }}
                tickLine={{ stroke: '#4b5563' }}
                tickFormatter={(value) => yAxisUnit ? `${value} ${yAxisUnit}` : value}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "rgba(75, 85, 99, 0.2)" }}
              />

              {showLegend && (
                <Legend
                  formatter={(value, entry) => {
                    const matchingSeries = series.find(s => s.key === entry.dataKey);
                    return matchingSeries ? matchingSeries.name : value;
                  }}
                  wrapperStyle={{ paddingTop: 10 }}
                />
              )}

              {/* Líneas de referencia */}
              {referenceLines.map((line, index) => (
                <RechartsReferenceLine
                  key={`ref-line-${index}`}
                  y={line.y}
                  x={line.x}
                  stroke={line.color || '#ff7300'}
                  strokeDasharray="3 3"
                  label={line.label}
                />
              ))}

              {series.map((s, index) => {
                const color = s.color || getSeriesColor(index, theme);

                if (s.type === 'area') {
                  return (
                    <Area
                      key={s.key}
                      type={curveType}
                      dataKey={s.key}
                      name={s.name}
                      stroke={color}
                      fill={`url(#color-area-${s.key})`}
                      strokeWidth={strokeWidth}
                      activeDot={showDataPoints ? { r: 6, strokeWidth: 1, stroke: '#fff' } : false}
                      dot={showDataPoints ? { r: 3, strokeWidth: 1, stroke: '#fff' } : false}
                      strokeDasharray={s.strokeDasharray}
                    />
                  );
                }

                return (
                  <Line
                    key={s.key}
                    type={curveType}
                    dataKey={s.key}
                    name={s.name}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    activeDot={showDataPoints ? { r: 6, strokeWidth: 1, stroke: '#fff' } : false}
                    dot={showDataPoints ? { r: 3, strokeWidth: 1, stroke: '#fff' } : false}
                    strokeDasharray={s.strokeDasharray}
                  />
                );
              })}

              <defs>
                {series.filter(s => s.type === 'area').map((s, index) => {
                  const color = s.color || getSeriesColor(index, theme);
                  return (
                    <linearGradient key={`gradient-${s.key}`} id={`color-area-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                    </linearGradient>
                  );
                })}
              </defs>
            </ComposedChart>
          ) : (
            <RechartsLineChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              )}

              <XAxis
                dataKey={timestampKey}
                tickFormatter={(value) => {
                  if (typeof value === 'object') {
                    return format(value, xAxisFormat, { locale: es });
                  }
                  return value;
                }}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={{ stroke: '#4b5563' }}
                tickLine={{ stroke: '#4b5563' }}
              />

              <YAxis
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={{ stroke: '#4b5563' }}
                tickLine={{ stroke: '#4b5563' }}
                tickFormatter={(value) => yAxisUnit ? `${value} ${yAxisUnit}` : value}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "rgba(75, 85, 99, 0.2)" }}
              />

              {showLegend && (
                <Legend
                  formatter={(value, entry) => {
                    const matchingSeries = series.find(s => s.key === entry.dataKey);
                    return matchingSeries ? matchingSeries.name : value;
                  }}
                  wrapperStyle={{ paddingTop: 10 }}
                />
              )}

              {/* Líneas de referencia */}
              {referenceLines.map((line, index) => (
                <RechartsReferenceLine
                  key={`ref-line-${index}`}
                  y={line.y}
                  x={line.x}
                  stroke={line.color || '#ff7300'}
                  strokeDasharray="3 3"
                  label={line.label}
                />
              ))}

              {series.map((s, index) => (
                <Line
                  key={s.key}
                  type={curveType}
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color || getSeriesColor(index, theme)}
                  strokeWidth={strokeWidth}
                  activeDot={showDataPoints ? { r: 6, strokeWidth: 1, stroke: '#fff' } : false}
                  dot={showDataPoints ? { r: 3, strokeWidth: 1, stroke: '#fff' } : false}
                  strokeDasharray={s.strokeDasharray}
                />
              ))}
            </RechartsLineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Función para generar colores para las series basados en el tema
const getSeriesColor = (index: number, theme: Theme): string => {
  const themeColors: Record<Theme, string[]> = {
    primary: ['#22d3ee', '#06b6d4', '#0891b2', '#0e7490'],
    secondary: ['#93c5fd', '#60a5fa', '#3b82f6', '#2563eb'],
    success: ['#86efac', '#4ade80', '#22c55e', '#16a34a'],
    warning: ['#fde047', '#facc15', '#eab308', '#ca8a04'],
    danger: ['#fca5a5', '#f87171', '#ef4444', '#dc2626'],
    neutral: ['#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280'],
  };

  const colors = themeColors[theme] || themeColors.primary;
  return colors[index % colors.length];
};

export default LineChart;
