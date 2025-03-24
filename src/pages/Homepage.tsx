import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { WeekData } from '../components/module/home/Charts';
import BarChartComponent, { BarChartData } from '../components/ui/BarChart';
import { metricService } from '../services/metricService';
import useAuthStore from '../store/useAuthStore';

const Homepage: React.FC = () => {
  const dataProfile = useAuthStore(state => state.data)
  const queryData = { startDate: '2025-03-01T00:00:00.000Z', endDate: '2025-03-30T23:59:59.000Z', eventName: 'get-content-all' }
  const {data: metricData } = useQuery<WeekData[]>({
    queryKey: ['getMetrics', queryData],
    queryFn: () => metricService.getWeekMetrics(queryData)
  })
  console.log(metricData)
  const formaterData = (data: WeekData[]): BarChartData[] => {
    return data.map(metric => ({
      name: metric.week ?? '',
      value: metric.count ?? 0
    }))
  }
  const data = useMemo(() => {
    if (metricData) {

      return formaterData(metricData)
    }
  }, [metricData])
 /*  const [data] = useState<BarChartData[]>([
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
  ); */
  const startDate = "2025-03-01";
  const endDate = "2025-03-23";

  return (
    <div>
      <h1 className="font-bold text-3xl py-2">Bienvenido de nuevo <span className="text-shadow bg-gradient-to-tr from-cyan-500 to-teal-200 bg-clip-text text-transparent hover:translate-y-0.5 transition-all">{dataProfile?.username ?? 'Usuario'}</span></h1>
      <div className="grid grid-cols-3">
        <BarChartComponent title='Secciones de la semana' data={data} startDate={startDate} endDate={endDate} />
      </div>
    </div>
  )
}

export default Homepage