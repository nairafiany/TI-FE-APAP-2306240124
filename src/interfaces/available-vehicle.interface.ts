export interface AvailableVehicle {
  id: string // vehicleId
  type: string
  brand: string
  model: string
  vendorName: string
  transmission: string
  pricePerDay: number
  rentalDays: number
  driverCost: number
  totalPriceNow: number // Harga total sudah dihitung oleh backend
}
