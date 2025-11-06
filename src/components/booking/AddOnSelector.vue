<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-gray-700 border-b pb-4">Choose Your Add-ons</h2>

    <div v-if="addOnStore.loading" class="text-center text-gray-500 py-8">Loading add-ons...</div>

    <div v-else class="space-y-4">
      <div
        v-for="addOn in addOnStore.addOns"
        :key="addOn.id"
        class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center">
          <input
            :id="`addon-${addOn.id}`"
            v-model="selectedAddOns"
            :value="addOn"
            type="checkbox"
            class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label :for="`addon-${addOn.id}`" class="ml-3 block text-md font-medium text-gray-800">
            {{ addOn.name }}
          </label>
        </div>
        <span class="text-md text-gray-600"> Rp {{ addOn.price.toLocaleString() }} </span>
      </div>
    </div>

    <div class="pt-6 border-t space-y-3">
      <h3 class="text-lg font-semibold text-gray-700">Final Price Details</h3>
      <div class="flex justify-between text-gray-600">
        <span>Vehicle + Driver Price</span>
        <span>Rp {{ basePrice.toLocaleString() }}</span>
      </div>
      <div class="flex justify-between text-gray-600">
        <span>Add-ons Total</span>
        <span>Rp {{ addOnsTotalPrice.toLocaleString() }}</span>
      </div>
      <div class="flex justify-between font-bold text-xl text-gray-900 mt-2">
        <span>Grand Total</span>
        <span>Rp {{ grandTotalPrice.toLocaleString() }}</span>
      </div>
    </div>

    <div class="flex justify-between pt-6 border-t mt-4">
      <button
        @click="goBack"
        class="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 font-semibold"
      >
        Previous
      </button>
      <button
        @click="finalizeBooking"
        class="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 font-semibold"
      >
        Save Booking
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAddOnStore } from '@/stores/addon.store'
import type { RentalAddOn } from '@/interfaces/addon.interface'

const props = defineProps<{
  basePrice: number
  rentalDays: number
}>()

const emit = defineEmits<{
  (e: 'addons-selected', ids: number[]): void
  (e: 'back'): void
}>()

const addOnStore = useAddOnStore()
const selectedAddOns = ref<RentalAddOn[]>([])

onMounted(() => {
  if (addOnStore.addOns.length === 0) {
    addOnStore.fetchAddOns()
  }
})

const addOnsTotalPrice = computed(() => {
  return selectedAddOns.value.reduce((total, addon) => total + addon.price, 0)
})

const grandTotalPrice = computed(() => {
  return props.basePrice + addOnsTotalPrice.value
})

const goBack = () => {
  emit('back')
}

const finalizeBooking = () => {
  const selectedIds = selectedAddOns.value.map((addon) => addon.id)
  emit('addons-selected', selectedIds)
}
</script>
