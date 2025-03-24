import { WeekData } from "../components/module/home/Charts";
import apiBase from "../config/api,config";

interface IGetWeekMetricsParams {
  startDate: string;
  endDate: string;
  eventName?: string;
}

export const metricService = {
  getWeekMetrics: async (params: IGetWeekMetricsParams): Promise<WeekData[]> => {
    const res = await apiBase.get(`/metrics/events-count-week?startDate=${params.startDate}&endDate=${params.endDate}&eventName=${params.eventName}`)
    return res.data
  }
}