import { defineStore } from 'pinia'
import axios from 'axios'
import { toast } from 'vue-sonner'

// Impor interface dari file terpisah
import type { Vendor } from '@/interfaces/vendor.interface'
import type {
  Vehicle,
  VehicleCreatePayload,
  VehicleUpdatePayload,
} from '@/interfaces/vehicle.interface'
import type { CommonResponseInterface } from '../interfaces/common.response.interface'

const baseVehicleUrl = `${import.meta.env.VITE_API_URL}/vehicles`
// Asumsi Anda punya endpoint untuk vendor
const baseVendorUrl = `${import.meta.env.VITE_API_URL}/vendors`

export const useVehicleStore = defineStore('vehicle', {
  state: () => ({
    vehicles: [] as Vehicle[],
    vendors: [] as Vendor[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAllVehicles() {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.get<CommonResponseInterface<Vehicle[]>>(baseVehicleUrl)

        this.vehicles = data.data || []

        if (this.vehicles.length === 0) toast.warning('Belum ada data kendaraan 🚗')
        else toast.success('Data kendaraan berhasil dimuat ✅')

        return this.vehicles
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Gagal terhubung ke server.'
        this.error = msg
        toast.error(`Error saat memuat kendaraan: ${msg}`)
        return []
      } finally {
        this.loading = false
      }
    },

    async fetchFilteredVehicles(type: string, keyword: string) {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.get<CommonResponseInterface<Vehicle[]>>(
          `${baseVehicleUrl}/filter`,
          {
            params: { type, keyword },
          },
        )
        this.vehicles = data.data || []
        toast.success(`Filter diterapkan: ${this.vehicles.length} kendaraan ditemukan.`)
        return this.vehicles
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Gagal melakukan filter.'
        this.error = msg
        toast.error(`Gagal memfilter kendaraan: ${msg}`)
        return []
      } finally {
        this.loading = false
      }
    },

    async getVehicleById(vehicleId: string) {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.get<CommonResponseInterface<Vehicle>>(
          `${baseVehicleUrl}/${vehicleId}`,
        )
        return data.data || null
      } catch (error: any) {
        const msg = error?.response?.data?.message || `Kendaraan ${vehicleId} tidak ditemukan.`
        this.error = msg
        toast.error(`Gagal memuat detail: ${msg}`)
        return null
      } finally {
        this.loading = false
      }
    },

    async createVehicle(payload: VehicleCreatePayload) {
      this.loading = true
      this.error = null
      try {
        // Endpoint: POST /api/vehicles
        const { data } = await axios.post<CommonResponseInterface<Vehicle>>(baseVehicleUrl, payload)

        if (data.status === 201) {
          this.vehicles.unshift(data.data) // Tambahkan ke list paling atas
          toast.success('Kendaraan baru berhasil dibuat 🥳')
          return data.data
        } else {
          toast.warning(`Gagal membuat kendaraan: ${data.message}`)
          return null
        }
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Error validasi atau server.'
        this.error = msg
        toast.error(`Error saat membuat kendaraan: ${msg}`)
        return null
      } finally {
        this.loading = false
      }
    },

    async updateVehicle(id: string, payload: VehicleUpdatePayload) {
      this.loading = true
      this.error = null
      try {
        // Endpoint: PUT /api/vehicles/{id}
        const { data } = await axios.put<CommonResponseInterface<Vehicle>>(
          `${baseVehicleUrl}/${id}`,
          payload,
        )

        if (data.status === 200) {
          toast.success('Kendaraan berhasil diperbarui 📝')
          // Update data di list state
          const index = this.vehicles.findIndex((v) => v.id === id)
          if (index !== -1) this.vehicles[index] = data.data
          return data.data
        } else {
          toast.warning(`Gagal memperbarui: ${data.message}`)
          return null
        }
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Error validasi atau server.'
        this.error = msg
        toast.error(`Error saat memperbarui kendaraan: ${msg}`)
        return null
      } finally {
        this.loading = false
      }
    },

    async deleteVehicle(vehicleId: string) {
      this.loading = true
      this.error = null
      try {
        // Endpoint: DELETE /api/vehicles/{id}
        const { data } = await axios.delete<CommonResponseInterface<void>>(
          `${baseVehicleUrl}/${vehicleId}`,
        )

        if (data.status === 200) {
          this.vehicles = this.vehicles.filter((v) => v.id !== vehicleId)
          toast.success('Kendaraan berhasil dihapus 🗑️')
          return true
        } else {
          toast.warning(data.message)
          return false
        }
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Gagal menghapus kendaraan.'
        this.error = msg
        toast.error(`Error: ${msg}`)
        return false
      } finally {
        this.loading = false
      }
    },

    async fetchVendors() {
      // Tidak set loading utama agar bisa jalan di background
      this.error = null
      try {
        const { data } = await axios.get<CommonResponseInterface<Vendor[]>>(baseVendorUrl)
        this.vendors = data.data || []
        return this.vendors
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Gagal memuat data vendor.'
        this.error = msg
        toast.error(`Error: ${msg}`)
        return []
      }
    },
  },
})
