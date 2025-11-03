<template>
  <div class="p-8 max-w-4xl mx-auto">
    <!-- Header Halaman -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Booking Details</h1>
      <!-- Tombol Aksi di Kanan Atas (Kondisional) -->
      <div v-if="booking" class="flex gap-2">
        <VButton
          v-if="booking.status === 'Upcoming'"
          :to="`/bookings/${bookingId}/update-details`"
          variant="primary"
        >
          Update Booking Details
        </VButton>
        <VButton v-if="booking.status === 'Upcoming'" :to="`/bookings/${bookingId}/update-addons`">
          Update Add-Ons
        </VButton>
        <VButton
          v-if="booking.status === 'Upcoming' || booking.status === 'Ongoing'"
          :to="`/bookings/${bookingId}/update-status`"
        >
          Update Status
        </VButton>
        <VButton
          v-if="booking.status === 'Upcoming'"
          variant="danger"
          @click="handleCancelBooking"
          :disabled="loadingAction"
        >
          Cancel Booking
        </VButton>
      </div>
    </div>

    <!-- Loading & Error State -->
    <div v-if="loading" class="text-center p-10 text-gray-500">Loading booking details... ⏳</div>
    <div v-else-if="error" class="text-center p-10 text-red-600">
      <strong>Error:</strong> {{ error }}
    </div>

    <!-- Konten Detail Booking -->
    <div v-else-if="booking" class="bg-white rounded-xl shadow-lg p-8">
      <!-- Grid Detail 2 Kolom -->
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
        <div>
          <dt class="text-sm font-medium text-gray-500">Booking ID</dt>
          <dd class="mt-1 text-lg font-semibold text-gray-900 font-mono">{{ booking.id }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Vehicle ID</dt>
          <!-- ID Kendaraan sebagai Hyperlink -->
          <dd class="mt-1 text-lg font-semibold">
            <RouterLink
              :to="`/vehicles/${booking.vehicleId}`"
              class="text-blue-600 hover:underline"
            >
              {{ booking.vehicleId }}
            </RouterLink>
            <span class="text-gray-600 text-sm ml-2">({{ booking.vehicleName }})</span>
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Pick-up Time</dt>
          <dd class="mt-1 text-lg font-semibold text-gray-900">
            {{ formatDate(booking.pickUpTime) }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Drop-off Time</dt>
          <dd class="mt-1 text-lg font-semibold text-gray-900">
            {{ formatDate(booking.dropOffTime) }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Pick-up Location</dt>
          <dd class="mt-1 text-lg font-semibold text-gray-900">{{ booking.pickUpLocation }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Drop-off Location</dt>
          <dd class="mt-1 text-lg font-semibold text-gray-900">{{ booking.dropOffLocation }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Include Driver?</dt>
          <dd class="mt-1 text-lg font-semibold text-gray-900">
            {{ booking.includeDriver ? 'Yes' : 'No' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Status</dt>
          <dd class="mt-1 text-lg font-semibold">
            <span
              :class="getStatusClass(booking.status)"
              class="px-3 py-1 leading-tight rounded-full text-sm font-bold"
            >
              {{ booking.status }}
            </span>
          </dd>
        </div>
        <div class="md:col-span-2">
          <!-- Total Price full width -->
          <dt class="text-sm font-medium text-gray-500">Total Price</dt>
          <dd class="mt-1 text-2xl font-bold text-green-700">
            Rp {{ formatCurrency(booking.totalPrice) }}
          </dd>
        </div>
      </dl>

      <!-- Tombol View Add-Ons -->
      <VButton variant="secondary" class="w-full mb-4" @click="showAddOnsPopup">
        View Add-Ons
      </VButton>

      <!-- Tombol Back -->
      <VButton variant="outline" class="w-full" @click="goBack"> Back </VButton>
    </div>

    <!-- Fallback jika booking tidak ditemukan -->
    <div v-else class="text-center p-10 text-gray-500">Booking not found.</div>

    <!-- TODO: Implement Add-Ons Popup/Modal -->
    <div
      v-if="isAddOnsPopupVisible"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 class="text-xl font-bold mb-4">Selected Add-Ons</h3>
        <p class="text-gray-700 mb-4">
          <!-- Ganti ini dengan data add-ons asli jika sudah ada di DTO/Service -->
          Placeholder: Add-on details will appear here. Fetching add-on data for booking
          {{ bookingId }} is not yet implemented.
        </p>
        <VButton variant="primary" @click="isAddOnsPopupVisible = false" class="w-full">
          Close
        </VButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { bookingService } from '@/services/booking.service'
import type { Booking } from '@/interfaces/booking.interface'
import VButton from '@/components/common/VButton.vue' // Gunakan VButton

const route = useRoute()
const router = useRouter()
const bookingId = route.params.id as string

// State
const booking = ref<Booking | null>(null)
const loading = ref(true)
const loadingAction = ref(false) // Loading untuk tombol cancel/update status
const error = ref<string | null>(null)
const isAddOnsPopupVisible = ref(false) // State untuk popup add-ons

// Helper function (sama seperti di BookingView)
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (e) {
    return dateString
  }
}
const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) return '0.00'
  return amount.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
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

// Ambil data saat komponen dimuat
onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const fetchedBooking = await bookingService.getBookingById(bookingId)
    if (fetchedBooking) {
      booking.value = fetchedBooking
    } else {
      // Error sudah dihandle oleh service (toast), set error lokal
      error.value = `Booking with ID ${bookingId} not found.`
      // Redirect back to list after a short delay
      setTimeout(() => router.push('/bookings'), 2000)
    }
  } catch (err: any) {
    // Tangkap error tak terduga (meski service sudah handle)
    error.value = err.message || 'An unexpected error occurred.'
    toast.error(error.value ?? 'An unexpected error occurred')
  } finally {
    loading.value = false
  }
})

// Handler untuk tombol Cancel Booking
const handleCancelBooking = async () => {
  // Sesuai spek: pop-up konfirmasi
  const isConfirmed = window.confirm(
    'Are you sure you want to cancel this booking? This action might be irreversible depending on the timing.',
  )

  if (isConfirmed && booking.value) {
    loadingAction.value = true
    const success = await bookingService.cancelBooking(booking.value.id)
    if (success) {
      // Jika berhasil, kembali ke halaman list
      router.push('/bookings')
    }
    // Jika gagal, toast error sudah muncul dari service
    loadingAction.value = false
  }
}

// Handler untuk tombol View Add-Ons (Placeholder)
const showAddOnsPopup = () => {
  // TODO: Fetch add-on details if not included in the main booking DTO
  // Untuk sekarang, hanya tampilkan popup
  isAddOnsPopupVisible.value = true
  // Jika Anda sudah punya data add-ons di 'booking.value.listOfAddOns' (misalnya),
  // Anda bisa menampilkannya di dalam popup.
}

// Handler untuk tombol Back
const goBack = () => {
  router.push('/bookings') // Kembali ke halaman daftar pesanan
}
</script>

<style scoped>
/* Tambahkan styling khusus jika diperlukan */
dl div {
  /* Sedikit padding bawah untuk setiap item detail */
  padding-bottom: 0.5rem;
}
</style>
