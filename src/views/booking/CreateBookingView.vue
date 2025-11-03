<template>
  <div class="p-4 md:p-8 max-w-3xl mx-auto">
    <div v-if="step < 3" class="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h1 class="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Create a New Booking</h1>

      <BookingSearchForm :loading="bookingStore.loadingSearch" @search="handleSearch" />

      <div v-if="showResults" class="space-y-4 mt-6">
        <h2 class="text-xl font-semibold text-gray-700">Available Vehicles</h2>

        <div v-if="bookingStore.loadingSearch" class="text-center py-6 text-gray-500">
          Searching for available vehicles...
        </div>

        <div v-else>
          <div
            v-if="!bookingStore.availableVehicles.length"
            class="text-center py-6 bg-gray-50 rounded-lg"
          >
            <p class="text-gray-500">No available vehicles match your criteria.</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="vehicle in bookingStore.availableVehicles"
              :key="vehicle.id"
              @click="handleSelectVehicle(vehicle)"
              :class="[
                'p-4 border rounded-lg cursor-pointer hover:bg-green-50 hover:border-green-400 transition-all',
                selectedVehicle?.id === vehicle.id
                  ? 'bg-green-100 border-green-500 ring-2 ring-green-300'
                  : 'bg-white',
              ]"
            >
              <div class="font-bold text-lg text-green-800">
                {{ vehicle.brand }} {{ vehicle.model }} ({{ vehicle.type }})
              </div>
              <div class="text-md text-gray-600">
                Total Price: Rp {{ calculateVehicleTotalPrice(vehicle).toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedVehicle" class="pt-6 border-t space-y-4">
        <h2 class="text-xl font-semibold text-gray-700">Booking Price Details</h2>
        <div class="bg-gray-50 p-4 rounded-lg space-y-2">
          <div class="flex justify-between">
            <span>Price ({{ rentalDays }} day(s))</span>
            <span>Rp {{ (selectedVehicle.price * rentalDays).toLocaleString() }}</span>
          </div>
          <div v-if="currentSearchCriteria?.includeDriver" class="flex justify-between">
            <span>Driver Cost</span>
            <span>Rp {{ (100000 * rentalDays).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between font-bold text-lg">
            <span>Grand Total</span>
            <span>Rp {{ calculateVehicleTotalPrice(selectedVehicle).toLocaleString() }}</span>
          </div>
        </div>
        <button
          @click="proceedToAddOns"
          class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold text-lg transition-colors"
        >
          Proceed to Add-ons
        </button>
      </div>
    </div>

    <div v-if="step === 3 && selectedVehicle" class="bg-white p-6 rounded-lg shadow-md">
      <AddOnSelector
        :base-price="calculateVehicleTotalPrice(selectedVehicle)"
        :rental-days="rentalDays"
        @addons-selected="handleFinalizeBooking"
        @back="step = 2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useBookingStore } from '@/stores/booking.store'
import { useLocationStore } from '@/stores/location.store'
import BookingSearchForm from '@/components/booking/BookingSearchForm.vue'
import AddOnSelector from '@/components/booking/AddOnSelector.vue'
import type { BookingSearchPayload, BookingCreatePayload } from '@/interfaces/booking.interface'
import type { Vehicle } from '@/interfaces/vehicle.interface'

const router = useRouter()
const bookingStore = useBookingStore()
const locationStore = useLocationStore()

const step = ref(1)
const showResults = ref(false)
const currentSearchCriteria = ref<BookingSearchPayload | null>(null)
const selectedVehicle = ref<Vehicle | null>(null)

onMounted(() => {
  locationStore.fetchProvinces()
})

const rentalDays = computed(() => {
  if (!currentSearchCriteria.value?.pickUpTime || !currentSearchCriteria.value?.dropOffTime)
    return 1
  const start = new Date(currentSearchCriteria.value.pickUpTime)
  const end = new Date(currentSearchCriteria.value.dropOffTime)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays)
})

const calculateVehicleTotalPrice = (vehicle: Vehicle) => {
  if (!currentSearchCriteria.value) return vehicle.price || 0

  const vehiclePrice = vehicle.price || 0
  const vehicleCost = rentalDays.value * vehiclePrice
  const driverCost = currentSearchCriteria.value.includeDriver ? rentalDays.value * 100000 : 0

  return vehicleCost + driverCost
}

const handleSearch = async (payload: BookingSearchPayload) => {
  selectedVehicle.value = null
  currentSearchCriteria.value = payload
  showResults.value = true
  step.value = 2
  await bookingStore.searchAvailableVehicles(payload)
}

const handleSelectVehicle = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle
  toast.success(`${vehicle.brand} ${vehicle.model} selected.`)
}

const proceedToAddOns = () => {
  step.value = 3
}

const handleFinalizeBooking = async (addOnIds: number[]) => {
  if (!selectedVehicle.value || !currentSearchCriteria.value) {
    toast.error('An error occurred. Please select a vehicle first.')
    return
  }
  const payload: BookingCreatePayload = {
    vehicleId: selectedVehicle.value.id,
    pickUpLocation: currentSearchCriteria.value.pickUpLocation,
    dropOffLocation: currentSearchCriteria.value.dropOffLocation,
    pickUpTime: currentSearchCriteria.value.pickUpTime,
    dropOffTime: currentSearchCriteria.value.dropOffTime,
    includeDriver: currentSearchCriteria.value.includeDriver ?? false,
    addOnIds: addOnIds,
  }
  const newBooking = await bookingStore.createBooking(payload)
  if (newBooking) {
    router.push(`/bookings/${newBooking.id}`)
  }
}
</script>
