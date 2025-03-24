import apiBase from "../config/api,config"
import { GetContentSection } from "../interfaces/apis/getContentSection.interface"

export const contentService = {
  getSections: async (): Promise<GetContentSection[]> => {
    const response = await apiBase.get('/content/getsection')
    return response.data as GetContentSection[]
  }
}