export interface Vehicle {
  id: string
  rentalVendorId: number
  rentalVendorName: string
  type: string
  brand: string
  model: string
  year: number
  location: string
  licensePlate: string
  capacity: number
  transmission: string
  fuelType: string
  price: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface VehicleRequest {
  rentalVendorId: number | null
  type: string
  brand: string
  model: string
  year: number | null
  location: string
  licensePlate: string
  capacity: number | null
  transmission: string
  fuelType: string
  price: number | null
}

export interface UpdateVehicleRequest extends VehicleRequest {
  id: string
}

export interface VehicleCreatePayload {
  rentalVendorId: number | null
  type: string
  brand: string
  model: string
  year: number | null
  location: string
  licensePlate: string
  capacity: number | null
  transmission: string
  fuelType: string
  price: number | null
}

export interface VehicleUpdatePayload {
  type: string
  brand: string
  model: string
  year: number | null
  location: string
  capacity: number | null
  transmission: string
  fuelType: string
  price: number | null
  status: string
}

export interface VehiclePayload {
  rentalVendorId: number | null
  type: string
  brand: string
  model: string
  year: number | null
  location: string
  licensePlate: string
  capacity: number | null
  transmission: string
  fuelType: string
  price: number | null
}
