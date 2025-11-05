<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div v-if="loading" class="text-center p-10 text-gray-500">Loading booking details... ⏳</div>
    <div v-else-if="error" class="text-center p-10 text-red-600">
      <strong>Error:</strong> {{ error }}
    </div>

    <div v-else-if="booking" class="space-y-6">
      <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Booking Details</h1>
        </div>

        <div class="flex flex-wrap gap-2 flex-shrink-0">
          <VButton
            v-if="booking.status.toLowerCase() === 'upcoming'"
            :to="`/bookings/${bookingId}/update-details`"
            variant="primary"
            >Update Booking Details</VButton
          >
          <VButton
            v-if="booking.status.toLowerCase() === 'upcoming'"
            :to="`/bookings/${bookingId}/update-addons`"
            >Update Add-Ons</VButton
          >
          <VButton
            v-if="
              booking.status.toLowerCase() === 'upcoming' ||
              booking.status.toLowerCase() === 'ongoing'
            "
            :to="`/bookings/${bookingId}/update-status`"
            >Update Status</VButton
          >
          <VButton
            v-if="booking.status.toLowerCase() === 'upcoming'"
            variant="danger"
            @click="handleCancelBooking"
            :disabled="loadingAction"
            >Cancel Booking</VButton
          >
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-8">
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
          <div>
            <dt class="text-sm font-medium text-gray-500">Booking ID</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900 font-mono">{{ booking.id }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Vehicle</dt>
            <dd class="mt-1 text-lg font-semibold">
              <RouterLink
                :to="`/vehicles/${booking.vehicleId}`"
                class="text-blue-600 hover:underline"
                >{{ booking.vehicleName }}</RouterLink
              >
              <span class="text-gray-600 text-sm ml-2">({{ booking.vehicleId }})</span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Pick-up Time</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">
              {{ formatDate(booking.pickUpTime) }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Pick-up Location</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">{{ booking.pickUpLocation }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Include Driver?</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">
              {{ booking.includeDriver ? 'Yes' : 'No' }}
            </dd>
          </div>
          <div class="md:col-span-2">
            <dt class="text-sm font-medium text-gray-500">Total Price</dt>
            <dd class="mt-1 text-2xl font-bold text-green-700">
              Rp {{ formatCurrency(booking.totalPrice) }}
            </dd>
          </div>

          <div>
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="mt-1">
              <span
                :class="getStatusClass(booking.status)"
                class="px-3 py-1 leading-tight rounded-full text-sm font-bold"
                >{{ booking.status }}</span
              >
            </dd>
          </div>
          <div></div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Drop-off Time</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">
              {{ formatDate(booking.dropOffTime) }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Drop-off Location</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">{{ booking.dropOffLocation }}</dd>
          </div>
        </dl>

        <VButton variant="secondary" class="w-full" @click="isAddOnsPopupVisible = true"
          >View Add-Ons</VButton
        >
      </div>

      <div class="pt-4">
        <VButton variant="outline" @click="goBack" class="w-full">&larr; Back to List</VButton>
      </div>
    </div>

    <div v-else class="text-center p-10 text-gray-500">Booking not found.</div>

    <!-- 🌿 Modern Popup Add-Ons -->
    <transition name="fade">
      <div
        v-if="isAddOnsPopupVisible"
        class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30"
      >
        <transition name="scale">
          <div
            class="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100"
          >
            <h3 class="text-xl font-bold mb-4 text-center text-gray-800">Selected Add-Ons</h3>

            <ul v-if="booking?.listOfAddOns && booking.listOfAddOns.length" class="space-y-3 mb-6">
              <li
                v-for="addon in booking.listOfAddOns"
                :key="addon.id"
                class="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                <span>{{ addon.name }}</span>
                <span class="font-semibold text-green-700">
                  Rp {{ formatCurrency(addon.price) }}
                </span>
              </li>
            </ul>

            <p v-else class="text-gray-500 mb-6 text-center italic">
              No add-ons were selected for this booking.
            </p>

            <div class="flex justify-end">
              <VButton variant="secondary" @click="isAddOnsPopupVisible = false"> Close </VButton>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/booking.store'
import VButton from '@/components/common/VButton.vue'

const route = useRoute()
const router = useRouter()
const bookingId = route.params.id as string
const bookingStore = useBookingStore()

const loadingAction = ref(false)
const isAddOnsPopupVisible = ref(false)

const booking = computed(() => bookingStore.currentBooking)
const loading = computed(() => bookingStore.loading)
const error = computed(() => bookingStore.error)

// Helper Functions
const formatDate = (dateString: string | Date | undefined): string => {
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
    return String(dateString)
  }
}

const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) return '0.00'
  return amount.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getStatusClass = (status: string | undefined) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800'
    case 'ongoing':
      return 'bg-yellow-100 text-yellow-800'
    case 'done':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Data Fetching
onMounted(async () => {
  await bookingStore.getBookingById(bookingId)
  if (bookingStore.error) {
    setTimeout(() => router.push('/bookings'), 2000)
  }
})

// Handlers
const handleCancelBooking = async () => {
  const isConfirmed = window.confirm('Are you sure you want to cancel this booking?')
  if (isConfirmed && booking.value) {
    loadingAction.value = true
    const success = await bookingStore.cancelBooking(booking.value.id)
    if (success) {
      router.push('/bookings')
    }
    loadingAction.value = false
  }
}

const goBack = () => {
  router.push('/bookings')
}
</script>

<style scoped>
dl div {
  padding-bottom: 0.5rem;
}
</style>
