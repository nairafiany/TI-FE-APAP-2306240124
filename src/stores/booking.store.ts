import { defineStore } from 'pinia'
import axios from 'axios'
import { toast } from 'vue-sonner'

// Impor semua interface booking
import type {
  Booking,
  BookingCreatePayload,
  BookingSearchPayload,
  BookingUpdateDetailsPayload,
  BookingUpdateStatusPayload,
  BookingUpdateAddOnsPayload,
} from '@/interfaces/booking.interface'

import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import type { Vehicle } from '@/interfaces/vehicle.interface' // [FIX] Hanya impor 'Vehicle' untuk hasil pencarian

// Base URL dari environment variables
const baseBookingUrl = `${import.meta.env.VITE_API_URL}/bookings`

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: [] as Booking[],
    // [FIX] State ini HARUS menggunakan tipe 'Vehicle[]' agar cocok dengan API
    availableVehicles: [] as Vehicle[],
    currentBooking: null as Booking | null,
    loading: false,
    loadingSearch: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAllBookings() {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.get<CommonResponseInterface<Booking[]>>(baseBookingUrl)
        this.bookings = (data.data || []).sort((a, b) => b.id.localeCompare(a.id))

        if (this.bookings.length === 0) toast.info('Belum ada data pesanan 📖')
        else toast.success('Data pesanan berhasil dimuat ✅')

        return this.bookings
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Gagal terhubung ke server.'
        this.error = msg
        toast.error(`Error saat memuat pesanan: ${msg}`)
        return []
      } finally {
        this.loading = false
      }
    },

    async getBookingById(id: string) {
      this.loading = true
      this.error = null
      this.currentBooking = null
      try {
        const { data } = await axios.get<CommonResponseInterface<Booking>>(
          `${baseBookingUrl}/${id}`,
        )
        if (data.status === 200 && data.data) {
          this.currentBooking = data.data
          toast.success(`Detail pesanan ${id} berhasil dimuat.`)
          return this.currentBooking
        } else {
          throw new Error(data.message || 'Booking not found')
        }
      } catch (error: any) {
        const msg = error?.response?.data?.message || `Gagal memuat detail pesanan ${id}.`
        this.error = msg
        toast.error(msg)
        return null
      } finally {
        this.loading = false
      }
    },

    async createBooking(payload: BookingCreatePayload): Promise<Booking | null> {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.post<CommonResponseInterface<Booking>>(baseBookingUrl, payload)
        if (data.status === 201 && data.data) {
          this.bookings.unshift(data.data)
          toast.success(`Pesanan ${data.data.id} berhasil dibuat! 🎉`)
          return data.data
        } else {
          throw new Error(data.message || 'Gagal membuat pesanan.')
        }
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Terjadi kesalahan saat membuat pesanan.'
        this.error = msg
        toast.error(`Error: ${msg}`)
        return null
      } finally {
        this.loading = false
      }
    },

    async searchAvailableVehicles(payload: BookingSearchPayload): Promise<Vehicle[]> {
      this.loadingSearch = true
      this.error = null
      this.availableVehicles = []
      try {
        const { data } = await axios.post<CommonResponseInterface<Vehicle[]>>(
          `${baseBookingUrl}/search`,
          payload,
        )
        if (data.status === 200) {
          this.availableVehicles = data.data || [] // Sekarang tidak ada error karena tipe sudah cocok
          if (this.availableVehicles.length === 0) {
            toast.info('Tidak ada kendaraan yang tersedia sesuai kriteria.')
          } else {
            toast.success(`${this.availableVehicles.length} kendaraan tersedia ditemukan.`)
          }
          return this.availableVehicles
        } else {
          throw new Error(data.message || 'Gagal mencari kendaraan.')
        }
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Terjadi kesalahan saat mencari kendaraan.'
        this.error = msg
        toast.error(`Error: ${msg}`)
        return []
      } finally {
        this.loadingSearch = false
      }
    },

    async updateBookingDetails(
      id: string,
      payload: BookingUpdateDetailsPayload,
    ): Promise<Booking | null> {
      this.loading = true
      this.error = null
      try {
        const url = `${baseBookingUrl}/${id}/update-details`
        const { data } = await axios.put<CommonResponseInterface<Booking>>(url, payload)

        if (data.status === 200 && data.data) {
          const index = this.bookings.findIndex((b) => b.id === id)
          if (index !== -1) this.bookings[index] = data.data
          if (this.currentBooking?.id === id) this.currentBooking = data.data

          toast.success(`Detail pesanan ${id} berhasil diperbarui.`)
          return data.data
        } else {
          throw new Error(data.message || 'Gagal memperbarui detail pesanan.')
        }
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Terjadi kesalahan saat memperbarui detail.'
        this.error = msg
        toast.error(`Error: ${msg}`)
        return null
      } finally {
        this.loading = false
      }
    },

    async updateBookingStatus(
      id: string,
      payload: BookingUpdateStatusPayload,
    ): Promise<Booking | null> {
      this.loading = true
      this.error = null
      try {
        const url = `${baseBookingUrl}/${id}/update-status` // URL diperbaiki
        const response = await axios.put<any>(url, payload)
        const updatedBookingData = response.data?.data as Booking

        if (response.data?.status === 200 && updatedBookingData) {
          const index = this.bookings.findIndex((b) => b.id === id)
          if (index !== -1) this.bookings[index] = updatedBookingData
          if (this.currentBooking?.id === id) this.currentBooking = updatedBookingData

          toast.success(`Status pesanan ${id} berhasil diubah menjadi ${payload.newStatus}.`)
          return updatedBookingData
        } else {
          throw new Error(response.data?.message || 'Gagal memperbarui status pesanan.')
        }
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Terjadi kesalahan saat memperbarui status.'
        this.error = msg
        toast.error(`Error: ${msg}`)
        return null
      } finally {
        this.loading = false
      }
    },

    async updateBookingAddOns(
      id: string,
      payload: BookingUpdateAddOnsPayload,
    ): Promise<Booking | null> {
      this.loading = true
      this.error = null
      try {
        const url = `${baseBookingUrl}/${id}/update-addons`
        const { data } = await axios.put<CommonResponseInterface<Booking>>(url, payload)

        if (data.status === 200 && data.data) {
          const index = this.bookings.findIndex((b) => b.id === id)
          if (index !== -1) this.bookings[index] = data.data
          if (this.currentBooking?.id === id) this.currentBooking = data.data

          toast.success(`Add-ons untuk pesanan ${id} berhasil diperbarui.`)
          return data.data
        } else {
          throw new Error(data.message || 'Gagal memperbarui add-ons.')
        }
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Terjadi kesalahan saat memperbarui add-ons.'
        this.error = msg
        toast.error(`Error: ${msg}`)
        return null
      } finally {
        this.loading = false
      }
    },

    async cancelBooking(id: string): Promise<boolean> {
      this.loading = true
      this.error = null
      try {
        const url = `${baseBookingUrl}/${id}/delete`
        const { data } = await axios.delete<CommonResponseInterface<Booking>>(url)

        if (data.status === 200) {
          this.bookings = this.bookings.filter((b) => b.id !== id)
          if (this.currentBooking?.id === id) this.currentBooking = null

          toast.success(`Pesanan ${id} berhasil dibatalkan.`)
          return true
        } else {
          throw new Error(data.message || 'Gagal membatalkan pesanan.')
        }
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Terjadi kesalahan saat membatalkan pesanan.'
        this.error = msg
        toast.error(`Error: ${msg}`)
        return false
      } finally {
        this.loading = false
      }
    },
  },
})
