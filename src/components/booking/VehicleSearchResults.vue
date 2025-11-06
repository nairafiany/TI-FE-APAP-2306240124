<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold text-gray-700">Available Vehicles</h2>
      <button @click="$emit('back')" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
        &larr; Back to Search
      </button>
    </div>

    <div v-if="loading" class="text-center p-10">Loading results...</div>
    <div v-else-if="vehicles.length === 0" class="text-center p-10 bg-gray-50 rounded-lg">
      <p class="text-gray-500">
        No vehicles found matching your criteria. Try adjusting your search.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="vehicle in vehicles"
        :key="vehicle.id"
        class="border rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow bg-white flex flex-col"
      >
        <div class="flex-grow">
          <h3 class="text-xl font-bold text-gray-800">{{ vehicle.brand }} {{ vehicle.model }}</h3>
          <p class="text-sm text-gray-500">{{ vehicle.type }} &bull; {{ vehicle.year }}</p>
          <div class="mt-4 space-y-2">
            <p><strong>Capacity:</strong> {{ vehicle.capacity }} people</p>
            <p><strong>Transmission:</strong> {{ vehicle.transmission }}</p>
            <p><strong>Fuel:</strong> {{ vehicle.fuelType }}</p>
            <p><strong>Base Price/Day:</strong> Rp {{ vehicle.price.toLocaleString() }}</p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t">
          <p class="text-lg font-semibold">
            Total Price Est:
            <span class="text-blue-600"
              >Rp {{ calculateTotalPrice(vehicle).toLocaleString() }}</span
            >
          </p>
          <p class="text-xs text-gray-500">for {{ rentalDays }} day(s)</p>
          <button
            @click="$emit('select', vehicle)"
            class="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Select Vehicle
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

import type { BookingSearchPayload } from '@/interfaces/booking.interface'

import type { Vehicle } from '@/interfaces/vehicle.interface'

const props = defineProps<{
  vehicles: Vehicle[]
  searchCriteria: BookingSearchPayload | null
  loading: boolean
}>()

defineEmits<{
  (e: 'select', vehicle: Vehicle): void
  (e: 'back'): void
}>()

const rentalDays = computed(() => {
  if (!props.searchCriteria?.pickUpTime || !props.searchCriteria?.dropOffTime) return 1
  const start = new Date(props.searchCriteria.pickUpTime)
  const end = new Date(props.searchCriteria.dropOffTime)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays) // Minimum 1 day
})

const calculateTotalPrice = (vehicle: Vehicle) => {
  if (!props.searchCriteria) return vehicle.price
  const vehicleCost = rentalDays.value * vehicle.price
  const driverCost = props.searchCriteria.includeDriver ? rentalDays.value * 100000 : 0
  return vehicleCost + driverCost
}
</script>
