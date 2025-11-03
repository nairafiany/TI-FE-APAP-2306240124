<template>
  <div class="p-4 md:p-8 max-w-2xl mx-auto">
    <div v-if="loading" class="text-center py-10 text-gray-500">
      Loading booking and add-on data...
    </div>
    <div v-else-if="error" class="text-center py-10 text-red-500">
      {{ error }}
    </div>

    <div v-else-if="booking" class="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h1 class="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">
        Update Booking Add-Ons ({{ booking.id }})
      </h1>

      <form @submit.prevent="handleSaveAddOns" class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-700">Choose Add-Ons</h3>

        <div v-if="addOnStore.loading" class="text-center text-gray-500 py-4">
          Loading add-ons...
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="addOn in addOnStore.addOns"
            :key="addOn.id"
            class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center">
              <input
                :id="`addon-${addOn.id}`"
                v-model="selectedAddOnIds"
                :value="addOn.id"
                type="checkbox"
                class="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label
                :for="`addon-${addOn.id}`"
                class="ml-3 block text-md font-medium text-gray-800"
              >
                {{ addOn.name }}
              </label>
            </div>
            <span class="text-md text-gray-600 font-semibold">
              Rp {{ addOn.price.toLocaleString() }}
            </span>
          </div>
        </div>

        <div class="flex space-x-4 pt-4 border-t">
          <button
            type="button"
            @click="router.push(`/bookings/${bookingId}`)"
            class="w-1/2 bg-gray-300 text-gray-800 py-2.5 rounded-md hover:bg-gray-400 font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="bookingStore.loading || addOnStore.loading"
            class="w-1/2 bg-green-600 text-white py-2.5 rounded-md hover:bg-green-700 font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ bookingStore.loading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useBookingStore } from '@/stores/booking.store'
import { useAddOnStore } from '@/stores/addon.store'
import type { BookingUpdateAddOnsPayload } from '@/interfaces/booking.interface'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()
const addOnStore = useAddOnStore()

const bookingId = ref(route.params.id as string)
const selectedAddOnIds = ref<number[]>([])

const booking = computed(() => bookingStore.currentBooking)
const loading = computed(() => bookingStore.loading || addOnStore.loading)
const error = computed(() => bookingStore.error || addOnStore.error)

onMounted(async () => {
  await bookingStore.getBookingById(bookingId.value)
  if (addOnStore.addOns.length === 0) {
    await addOnStore.fetchAddOns()
  }
})

watch(
  booking,
  (currentBooking) => {
    if (currentBooking) {
      if (currentBooking.status.toLowerCase() !== 'upcoming') {
        toast.error("Add-ons can only be updated when booking status is 'Upcoming'.")
        router.push(`/bookings/${currentBooking.id}`)
        return
      }

      const currentIds = currentBooking.listOfAddOns?.map((addon) => addon.id) || []
      selectedAddOnIds.value = currentIds
    }
  },
  { immediate: true },
)

const handleSaveAddOns = async () => {
  const payload: BookingUpdateAddOnsPayload = {
    addOnIds: selectedAddOnIds.value,
  }

  const updatedBooking = await bookingStore.updateBookingAddOns(bookingId.value, payload)
  if (updatedBooking) {
    router.push(`/bookings/${updatedBooking.id}`)
  }
}
</script>
