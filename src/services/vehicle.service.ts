import axios from 'axios'
import { toast } from 'vue-sonner'
import type { Vehicle, VehicleCreatePayload } from '@/interfaces/vehicle.interface'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'

const baseVehicleUrl = import.meta.env.VITE_API_URL + '/vehicles'

export class VehicleService {
  private static instance: VehicleService

  public static getInstance(): VehicleService {
    if (!VehicleService.instance) {
      VehicleService.instance = new VehicleService()
    }
    return VehicleService.instance
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    try {
      const { data } = await axios.get<CommonResponseInterface<Vehicle[]>>(baseVehicleUrl)
      console.log('✅ [GET ALL VEHICLES] Response:', data)
      if (!data.data || data.data.length === 0) {
        toast.info('Belum ada kendaraan yang terdaftar.')
      }
      return data.data || []
    } catch (error: any) {
      console.error('❌ Gagal memuat kendaraan:', error)
      toast.error(
        `Gagal memuat daftar kendaraan ❌ (${error.response?.data?.message || error.message})`,
      )
      return []
    }
  }

  async getFilteredVehicles(type: string, keyword: string): Promise<Vehicle[]> {
    try {
      const { data } = await axios.get<CommonResponseInterface<Vehicle[]>>(
        `${baseVehicleUrl}/filter`,
        {
          params: { type, keyword },
        },
      )
      console.log('✅ [GET FILTERED VEHICLES] Response:', data)
      if (data.data.length === 0) {
        toast.info('Tidak ada kendaraan yang cocok dengan filter.')
      } else {
        toast.success(`Menampilkan ${data.data.length} kendaraan.`)
      }
      return data.data || []
    } catch (error: any) {
      console.error('❌ Gagal memfilter kendaraan:', error)
      toast.error(
        `Gagal memfilter kendaraan ❌ (${error.response?.data?.message || error.message})`,
      )
      return []
    }
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    try {
      const { data } = await axios.get<CommonResponseInterface<Vehicle>>(`${baseVehicleUrl}/${id}`)
      console.log('✅ [GET VEHICLE] Response:', data)
      return data.data || null
    } catch (error: any) {
      console.error('❌ Gagal memuat kendaraan:', error)
      toast.error(
        `Kendaraan tidak ditemukan ❌ (${error.response?.data?.message || error.message})`,
      )
      return null
    }
  }

  async createVehicle(payload: VehicleCreatePayload): Promise<Vehicle | null> {
    try {
      const { data } = await axios.post<CommonResponseInterface<Vehicle>>(baseVehicleUrl, payload)
      console.log('✅ [CREATE VEHICLE] Response:', data)

      if (data.status === 201) {
        // toast.success('Kendaraan berhasil dibuat 🥳')
        return data.data
      } else {
        toast.warning(data.message)
        return null
      }
    } catch (error: any) {
      console.error('❌ Gagal membuat kendaraan:', error)
      toast.error(`Gagal membuat kendaraan ❌ (${error.response?.data?.message || error.message})`)
      return null
    }
  }

  async updateVehicle(id: string, payload: VehicleCreatePayload): Promise<Vehicle | null> {
    try {
      const { data } = await axios.put<CommonResponseInterface<Vehicle>>(
        `${baseVehicleUrl}/${id}`,
        payload,
      )
      console.log('✅ [UPDATE VEHICLE] Response:', data)

      if (data.status === 200) {
        toast.success('Kendaraan berhasil diperbarui 📝')
        return data.data
      } else {
        toast.warning(data.message)
        return null
      }
    } catch (error: any) {
      console.error('❌ Gagal memperbarui kendaraan:', error)
      toast.error(
        `Gagal memperbarui kendaraan ❌ (${error.response?.data?.message || error.message})`,
      )
      return null
    }
  }

  async deleteVehicle(id: string): Promise<boolean> {
    console.log('🧹 Menghapus kendaraan dari backend ID:', id)
    try {
      const { data } = await axios.delete<CommonResponseInterface<void>>(`${baseVehicleUrl}/${id}`)
      console.log('✅ [DELETE VEHICLE] Response:', data)

      if (data.status === 200) {
        toast.success('Kendaraan berhasil dihapus 🗑️')
        return true
      } else {
        toast.warning(data.message)
        return false
      }
    } catch (error: any) {
      console.error('❌ Gagal menghapus kendaraan:', error)
      toast.error(
        `Gagal menghapus kendaraan ❌ (${error.response?.data?.message || error.message})`,
      )
      return false
    }
  }
}

export const vehicleService = VehicleService.getInstance()
