import type { Vehicle } from './vehicle.interface' // Asumsi Anda punya ini

/**
 * Sesuai dengan RentalBookingResponseDTO.java
 */
export interface Booking {
  id: string // Misal: VR000005
  vehicleId: string // Misal: VEH0003
  vehicleName: string // Misal: Toyota Avanza
  pickUpLocation: string
  dropOffLocation: string
  totalPrice: number
  status: 'Upcoming' | 'Ongoing' | 'Done' // Status yang mungkin
  includeDriver: boolean
  // Tambahkan createdAt jika API mengembalikannya untuk sorting
  // createdAt?: string;

  // Tambahkan pickUpTime dan dropOffTime jika diperlukan di detail
  pickUpTime?: string
  dropOffTime?: string
}

/**
 * Payload untuk membuat booking baru (RentalBookingCreateRequestDTO)
 */
export interface BookingCreatePayload {
  vehicleId: string
  pickUpLocation: string
  dropOffLocation: string
  pickUpTime: string // ISO String format (YYYY-MM-DDTHH:mm:ss)
  dropOffTime: string // ISO String format
  includeDriver: boolean
  addOnIds?: number[] // Asumsi ID AddOn adalah number (UUID di backend bisa string)
}

/**
 * Payload untuk mencari kendaraan (RentalBookingSearchRequestDTO)
 */
export interface BookingSearchPayload {
  pickUpLocation: string
  dropOffLocation: string
  pickUpTime: string // ISO String format
  dropOffTime: string // ISO String format
  capacityNeeded: number
  transmissionNeeded: 'Manual' | 'Automatic'
  includeDriver?: boolean // Optional, default false
}

/**
 * Payload untuk update detail booking (RentalBookingUpdateDetailsRequestDTO)
 */
export interface BookingUpdateDetailsPayload {
  pickUpLocation: string
  dropOffLocation: string
  pickUpTime: string // ISO String format
  dropOffTime: string // ISO String format
  includeDriver: boolean
}

/**
 * Payload untuk update status booking (RentalBookingUpdateStatusRequestDTO)
 */
export interface BookingUpdateStatusPayload {
  newStatus: 'Ongoing' | 'Done'
}

/**
 * Payload untuk update add-ons booking (RentalBookingUpdateAddOnsRequestDTO)
 */
export interface BookingUpdateAddOnsPayload {
  addOnIds: number[] // Asumsi ID AddOn adalah number
}

// Interface untuk hasil pencarian kendaraan (dari endpoint /search)
export type VehicleSearchResult = Vehicle // Gunakan interface Vehicle yang sudah ada
