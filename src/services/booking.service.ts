import axios from 'axios'
import { toast } from 'vue-sonner'
import type {
  Booking,
  BookingCreatePayload,
  BookingSearchPayload,
  BookingUpdateDetailsPayload,
  BookingUpdateStatusPayload,
  BookingUpdateAddOnsPayload,
} from '@/interfaces/booking.interface'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'
import type { Vehicle } from '@/interfaces/vehicle.interface'

// Base URL from environment variables
const baseBookingUrl = `${import.meta.env.VITE_API_URL}/bookings`

export class BookingService {
  private static instance: BookingService

  public static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService()
    }
    return BookingService.instance
  }

  // ===================== 🔹 GET ALL BOOKINGS =====================
  async getAllBookings(): Promise<Booking[]> {
    try {
      const { data } = await axios.get<CommonResponseInterface<Booking[]>>(baseBookingUrl)
      console.log('✅ [GET ALL BOOKINGS]', data)

      const sortedBookings = (data.data || []).sort((a, b) => b.id.localeCompare(a.id))
      if (sortedBookings.length === 0) {
        toast.info('Belum ada data pesanan 📖')
      } else {
        toast.success('Data pesanan berhasil dimuat ✅')
      }
      return sortedBookings
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Gagal memuat pesanan.'
      console.error('❌ [GET ALL BOOKINGS]', error)
      toast.error(`Error: ${msg}`)
      return []
    }
  }

  // ===================== 🔹 GET BOOKING BY ID =====================
  async getBookingById(id: string): Promise<Booking | null> {
    try {
      const { data } = await axios.get<CommonResponseInterface<Booking>>(`${baseBookingUrl}/${id}`)
      console.log(`✅ [GET BOOKING BY ID ${id}]`, data)
      if (data.status === 200 && data.data) {
        toast.success(`Detail pesanan ${id} berhasil dimuat.`)
        return data.data
      } else {
        throw new Error(data.message || 'Booking not found')
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || `Gagal memuat detail pesanan ${id}.`
      console.error(`❌ [GET BOOKING BY ID ${id}]`, error)
      toast.error(msg)
      return null
    }
  }

  // ===================== 🔹 CREATE BOOKING =====================
  async createBooking(payload: BookingCreatePayload): Promise<Booking | null> {
    try {
      const { data } = await axios.post<CommonResponseInterface<Booking>>(baseBookingUrl, payload)
      console.log('✅ [CREATE BOOKING]', data)
      if (data.status === 201 && data.data) {
        toast.success(`Pesanan ${data.data.id} berhasil dibuat! 🎉`)
        return data.data
      } else {
        throw new Error(data.message || 'Gagal membuat pesanan.')
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Terjadi kesalahan saat membuat pesanan.'
      console.error('❌ [CREATE BOOKING]', error)
      toast.error(`Error: ${msg}`)
      return null
    }
  }

  // ===================== 🔹 SEARCH AVAILABLE VEHICLES =====================
  async searchAvailableVehicles(payload: BookingSearchPayload): Promise<Vehicle[]> {
    try {
      const { data } = await axios.post<CommonResponseInterface<Vehicle[]>>(
        `${baseBookingUrl}/search`,
        payload,
      )
      console.log('✅ [SEARCH VEHICLES]', data)
      if (data.status === 200) {
        const vehicles = data.data || []
        if (vehicles.length === 0) {
          toast.info('Tidak ada kendaraan yang tersedia sesuai kriteria.')
        } else {
          toast.success(`${vehicles.length} kendaraan tersedia ditemukan.`)
        }
        return vehicles
      } else {
        throw new Error(data.message || 'Gagal mencari kendaraan.')
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Terjadi kesalahan saat mencari kendaraan.'
      console.error('❌ [SEARCH VEHICLES]', error)
      toast.error(`Error: ${msg}`)
      return []
    }
  }

  // ===================== 🔹 UPDATE BOOKING DETAILS =====================
  async updateBookingDetails(
    id: string,
    payload: BookingUpdateDetailsPayload,
  ): Promise<Booking | null> {
    try {
      const url = `${baseBookingUrl}/${id}/update-details`
      const { data } = await axios.put<CommonResponseInterface<Booking>>(url, payload)
      console.log(`✅ [UPDATE DETAILS ${id}]`, data)
      if (data.status === 200 && data.data) {
        toast.success(`Detail pesanan ${id} berhasil diperbarui.`)
        return data.data
      } else {
        throw new Error(data.message || 'Gagal memperbarui detail pesanan.')
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Terjadi kesalahan saat memperbarui detail.'
      console.error(`❌ [UPDATE DETAILS ${id}]`, error)
      toast.error(`Error: ${msg}`)
      return null
    }
  }

  // ===================== 🔹 UPDATE BOOKING STATUS =====================
  async updateBookingStatus(
    id: string,
    payload: BookingUpdateStatusPayload,
  ): Promise<Booking | null> {
    try {
      const url = `${baseBookingUrl}/${id}/update-status`
      const response = await axios.put<CommonResponseInterface<Booking>>(url, payload)
      console.log(`✅ [UPDATE STATUS ${id}]`, response.data)

      if (response.data?.status === 200 && response.data.data) {
        toast.success(`Status pesanan ${id} berhasil diubah menjadi ${payload.newStatus}.`)
        return response.data.data
      } else {
        throw new Error(response.data?.message || 'Gagal memperbarui status pesanan.')
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Terjadi kesalahan saat memperbarui status.'
      console.error(`❌ [UPDATE STATUS ${id}]`, error)
      toast.error(`Error: ${msg}`)
      return null
    }
  }

  // ===================== 🔹 UPDATE BOOKING ADD-ONS =====================
  async updateBookingAddOns(
    id: string,
    payload: BookingUpdateAddOnsPayload,
  ): Promise<Booking | null> {
    try {
      const url = `${baseBookingUrl}/${id}/update-addons`
      const { data } = await axios.put<CommonResponseInterface<Booking>>(url, payload)
      console.log(`✅ [UPDATE ADDONS ${id}]`, data)
      if (data.status === 200 && data.data) {
        toast.success(`Add-ons untuk pesanan ${id} berhasil diperbarui.`)
        return data.data
      } else {
        throw new Error(data.message || 'Gagal memperbarui add-ons.')
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Terjadi kesalahan saat memperbarui add-ons.'
      console.error(`❌ [UPDATE ADDONS ${id}]`, error)
      toast.error(`Error: ${msg}`)
      return null
    }
  }

  // ===================== 🔹 CANCEL BOOKING (SOFT DELETE) =====================
  async cancelBooking(id: string): Promise<boolean> {
    try {
      const url = `${baseBookingUrl}/${id}/delete`
      const { data } = await axios.delete<CommonResponseInterface<Booking>>(url)
      console.log(`✅ [CANCEL BOOKING ${id}]`, data)
      if (data.status === 200) {
        toast.success(`Pesanan ${id} berhasil dibatalkan.`)
        return true
      } else {
        throw new Error(data.message || 'Gagal membatalkan pesanan.')
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Terjadi kesalahan saat membatalkan pesanan.'
      console.error(`❌ [CANCEL BOOKING ${id}]`, error)
      toast.error(`Error: ${msg}`)
      return false
    }
  }
}

// Export the singleton instance for easy import
export const bookingService = BookingService.getInstance()
