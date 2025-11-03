<template>
  <div class="p-4 md:p-8 max-w-2xl mx-auto">
    <div v-if="loading" class="text-center py-10 text-gray-500">Loading booking details...</div>
    <div v-else-if="error" class="text-center py-10 text-red-500">
      {{ error }}
    </div>

    <div v-else-if="booking" class="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h1 class="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Update Booking Status</h1>

      <div class="space-y-3 bg-gray-50 p-4 rounded-lg">
        <div class="flex justify-between">
          <span class="font-medium text-gray-600">Booking ID</span>
          <span class="font-mono text-gray-800">{{ booking.id }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium text-gray-600">Current Status</span>
          <span
            :class="['font-bold px-2 py-1 rounded-full text-sm', getStatusClass(booking.status)]"
            >{{ booking.status }}</span
          >
        </div>
      </div>

      <form @submit.prevent="handleSaveStatus" class="space-y-4">
        <div>
          <label for="newStatus" class="block text-sm font-medium text-gray-800 mb-1"
            >Select New Status</label
          >
          <select
            id="newStatus"
            v-model="newStatus"
            :disabled="!statusOptions.length"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="" disabled>
              {{ statusOptions.length ? 'Choose a status...' : 'No status change available' }}
            </option>
            <option v-for="option in statusOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>

        <div
          v-if="!statusOptions.length"
          class="text-center text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md"
        >
          This booking's status cannot be changed at this moment.
          <span v-if="booking.status === 'Done'"><br />The booking is already completed.</span>
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
            :disabled="bookingStore.loading || !newStatus"
            class="w-1/2 bg-green-600 text-white py-2.5 rounded-md hover:bg-green-700 font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ bookingStore.loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/booking.store'
import type { BookingUpdateStatusPayload } from '@/interfaces/booking.interface'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()

const bookingId = ref(route.params.id as string)
const newStatus = ref<'Ongoing' | 'Done' | ''>('')

// Ambil state dari store menggunakan computed properties
const booking = computed(() => bookingStore.currentBooking)
const loading = computed(() => bookingStore.loading)
const error = computed(() => bookingStore.error)

// Ambil data booking saat komponen dimuat
onMounted(async () => {
  await bookingStore.getBookingById(bookingId.value)
})

// Tentukan pilihan status berikutnya berdasarkan status saat ini
const statusOptions = computed(() => {
  const currentStatus = booking.value?.status
  if (currentStatus === 'Upcoming') {
    return ['Ongoing']
  }
  if (currentStatus === 'Ongoing') {
    return ['Done']
  }
  return [] // Jika status 'Done' atau lainnya, tidak ada pilihan
})

// Helper untuk styling warna status
const getStatusClass = (status: string | undefined) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  switch (status) {
    case 'Upcoming':
      return 'bg-blue-100 text-blue-800'
    case 'Ongoing':
      return 'bg-yellow-100 text-yellow-800'
    case 'Done':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Fungsi untuk menyimpan perubahan
const handleSaveStatus = async () => {
  if (!newStatus.value) return

  const payload: BookingUpdateStatusPayload = {
    newStatus: newStatus.value,
  }

  const updatedBooking = await bookingStore.updateBookingStatus(bookingId.value, payload)
  if (updatedBooking) {
    // Kembali ke halaman detail setelah berhasil
    router.push(`/bookings/${updatedBooking.id}`)
  }
}
</script>
