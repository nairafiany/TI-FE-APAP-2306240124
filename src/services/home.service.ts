import axios from 'axios'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'

const baseUrl = `${import.meta.env.VITE_API_URL}/home`

export interface HomeSummary {
  totalVehicles: number
  totalVendors: number
  totalBookings: number
}

export const homeService = {
  async getSummary(): Promise<HomeSummary> {
    const { data } = await axios.get<CommonResponseInterface<HomeSummary>>(`${baseUrl}/summary`)
    return data.data ?? { totalVehicles: 0, totalVendors: 0, totalBookings: 0 }
  },
}
