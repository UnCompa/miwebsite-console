import apiBase from "../config/api,config"
import { GetAllContentBySectionId } from "../interfaces/apis/getAllContentBySectionId"
import { GetContentSection } from "../interfaces/apis/getContentSection.interface"
import { GetOnlyContentBySectionId } from "../interfaces/apis/getOnlyContentBySectionId"

export const contentService = {
  getSections: async (): Promise<GetContentSection[]> => {
    const response = await apiBase.get('/content/getsection')
    return response.data as GetContentSection[]
  },
  getAllContentBySectionId: async (idSection: string): Promise<GetAllContentBySectionId> => {
    const response = await apiBase.get(`/content/getallcontentbysectionid/${idSection}`)
    return response.data as GetAllContentBySectionId
  },
  getOnlyContentBySectionId: async (idSection: string): Promise<GetOnlyContentBySectionId[]> => {
    const response = await apiBase.get(`/content/getonlycontentbysection/${idSection}`)
    return response.data as GetOnlyContentBySectionId[]
  },
  createSection: async (data: FormData): Promise<GetOnlyContentBySectionId[]> => {
    const response = await apiBase.post(`/content/createsection`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data as GetOnlyContentBySectionId[]
  },
  updateSection: async (data: FormData, idSection: string): Promise<GetOnlyContentBySectionId[]> => {
    const response = await apiBase.put(`/content/updatesection/${idSection}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data as GetOnlyContentBySectionId[]
  },
  deleteSection: async (idSection: string): Promise<GetOnlyContentBySectionId[]> => {
    const response = await apiBase.delete(`/content/deletesection/${idSection}`)
    return response.data as GetOnlyContentBySectionId[]
  },
}