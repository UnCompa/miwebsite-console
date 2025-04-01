import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import Calendar from '../components/core/Calendar';
import { WeekData } from '../components/module/home/Charts';
import BarChart from '../components/ui/BarChartBetter';
import LineChart from '../components/ui/LineChart';
import PieChart from '../components/ui/PieChart';
import { metricService } from '../services/metricService';

const eventName = "get-content-all";


const Homepage: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2025-03-01T00:00:00.000Z'),
    endDate: new Date('2025-04-01T00:00:00.000Z')
  })
  const { data, refetch } = useQuery<WeekData[]>({
    queryKey: ['metricForWeek', dateRange.startDate, dateRange.endDate, eventName],
    queryFn: ({ queryKey }) => {
      const [, startDate, endDate, eventName] = queryKey as [string, string, string, string];
      return metricService.getMetricForWeek(startDate, endDate, eventName);
    },
    refetchOnWindowFocus: true,
    refetchInterval: 60000,
  });
  const formatData = data?.map((data) => {
    return {
      timestamp: data.week,
      count: data.count || 0,
      week: new Date(data.week).toDateString(),
    }
  })
  const handleRefresh = () => {
    console.log(data)
    refetch()
  }
  const handleSliceClick = (algo: any) => {
    console.log(algo)
  }
  return (
    <div>
      <h1 className="font-bold text-3xl py-2">Bienvenido de nuevo <span className="text-shadow bg-gradient-to-tr from-cyan-500 to-teal-200 bg-clip-text text-transparent hover:translate-y-0.5 transition-all">Juan</span></h1>
      <Calendar
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onChange={(start, end) => setDateRange({ startDate: start, endDate: end })}
        selectionMode="range"
        theme="primary"
        showPresetRanges={true}
        placeholder="Selecciona un rango de fechas"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <BarChart
          title="Uso de Recursos"
          data={formatData || []}  // Proveer un valor por defecto si formatData es undefined
          series={[
            { key: 'count', name: 'Valor' },
            { key: 'week', name: 'Semana' }
          ]}
          theme="primary"
          stacked={false}
          yAxisUnit="#"
          onRefresh={handleRefresh}
          defaultTimeRange="1w"
        />
        <LineChart
          title="Uso de Recursos"
          data={formatData || []}  // Proveer un valor por defecto si formatData es undefined
          series={[
            { key: 'count', name: 'Valor' },
            { key: 'week', name: 'Semana' }
          ]}
          theme="primary"
          showDataPoints={true}
          yAxisUnit="°"
          onRefresh={handleRefresh}
          curveType="natural"
          defaultTimeRange="1w"
          referenceLines={[
            { y: 100, label: 'Minimo', color: '#ef4444' }
          ]}
        />
        <PieChart
          title="Distribución de Recursos"
          data={[
            { name: 'Aplicación Web', value: 350 },
            { name: 'Base de Datos', value: 275 },
            { name: 'Almacenamiento', value: 180 },
            { name: 'Procesamiento', value: 120 },
            { name: 'Otros', value: 75 }
          ]}
          theme="primary"
          innerRadius={30}  // Para gráfico tipo donut
          valueUnit="GB"
          showPercentage={true}
          onSliceClick={(data) => handleSliceClick(data)}
          showLegend={true}
        />
        {/* <BarChartComponent title='Secciones de la semana' data={data} startDate={startDate} endDate={endDate} /> */}
      </div>
    </div>
  )
}

export default Homepage