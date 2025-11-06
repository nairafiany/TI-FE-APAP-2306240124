import type { Vehicle } from './vehicle.interface'

/**
 * Interface untuk DTO Add-On yang dikirim backend
 * Sesuai dengan RentalAddOnResponseDTO.java
 */
export interface AddOnDetail {
  id: number // Long di Java menjadi number di JSON/TS
  name: string
  price: number // Double di Java menjadi number di JSON/TS
}

/**
 * [FINAL] Sesuai dengan RentalBookingResponseDTO.java Anda yang sudah lengkap
 */
export interface Booking {
  id: string
  vehicleId: string
  vehicleName: string
  pickUpLocation: string
  dropOffLocation: string
  pickUpTime: string | Date
  dropOffTime: string | Date
  totalPrice: number
  status: 'Upcoming' | 'Ongoing' | 'Done'
  includeDriver: boolean

  capacityNeeded?: number
  transmissionNeeded?: 'Manual' | 'Automatic'
  listOfAddOns?: AddOnDetail[]
}

export interface BookingSearchPayload {
  includeDriver: boolean
  pickUpLocation: string
  dropOffLocation: string
  pickUpTime: string
  dropOffTime: string
  capacityNeeded: number
  transmissionNeeded: 'Manual' | 'Automatic'
  bookingIdToExclude?: string // Diperlukan untuk alur update
}

/**
 * Payload untuk MEMBUAT booking baru.
 */
export interface BookingCreatePayload extends BookingSearchPayload {
  vehicleId: string
  addOnIds: number[]
}

/**
 * [FIX] Payload untuk MENGUBAH DETAIL booking.
 * Sekarang kembali membutuhkan semua kriteria pencarian + ID kendaraan baru.
 */
export interface BookingUpdateDetailsPayload extends BookingSearchPayload {
  vehicleId: string
}
/**
 * Payload untuk MENGUBAH STATUS booking.
 */
export interface BookingUpdateStatusPayload {
  newStatus: 'Ongoing' | 'Done'
}

/**
 * Payload untuk MENGUBAH ADD-ONS booking.
 */
export interface BookingUpdateAddOnsPayload {
  addOnIds: number[]
}

export interface BookingChartResponse {
  period: 'monthly' | 'quarterly'
  year: number
  data: Record<string, number> // contoh: { "January": 2, "February": 0, "March": 1 }
}
