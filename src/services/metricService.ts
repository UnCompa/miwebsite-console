import apiBase from "../config/api,config"

export const metricService = {
  getMetricForWeek: async (startDate: string, endDate: string, eventName?: string) => {
    console.log(startDate)
    console.log(endDate)
    console.log(eventName)
    const startDatetime = new Date(startDate).toISOString()
    const endDatetime = new Date(endDate).toISOString()
    let url = ''
    if (eventName) {
      url = `/metrics/events-count-week?startDate=${startDatetime}&endDate= ${endDatetime}&eventName=${eventName}`
    } else {
      url = `/metrics/events-count-week?startDate=${startDatetime}&endDate=${endDatetime}`
    }
    const response = await apiBase.get(url)
    return response.data
  }
}