import axios from 'axios'
import { toast } from 'vue-sonner'
import type { Province, WilayahApiResponse } from '@/interfaces/location.interface'

const PROVINCES_URL = '/apiwilayah/api/provinces.json'

class LocationService {
  private static instance: LocationService

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService()
    }
    return LocationService.instance
  }

  // Method untuk mengambil semua provinsi
  async getProvinces(): Promise<Province[]> {
    try {
      // Panggil API menggunakan axios
      const response = await axios.get<WilayahApiResponse>(PROVINCES_URL)

      console.log('✅ [GET PROVINCES]', response.data)

      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data
      }

      throw new Error('Invalid API response structure')
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Gagal mengambil data provinsi dari server.'
      console.error('❌ [GET PROVINCES]', error)
      toast.error(msg)
      return [] // Kembalikan array kosong jika gagal
    }
  }
}

export const locationService = LocationService.getInstance()
