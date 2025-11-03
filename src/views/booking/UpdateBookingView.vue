<!-- <template>
  <div class="p-4 md:p-8 max-w-3xl mx-auto">
    <div v-if="!isDataLoaded" class="text-center py-10">Loading booking details...</div>

    <div v-else class="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h1 class="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">
        Update Booking ({{ bookingId }})
      </h1>

      <BookingSearchForm
        :loading="bookingStore.loadingSearch"
        :prefilled-data="prefillData"
        @search="handleSearch"
      />

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

        <div class="flex space-x-4 pt-2">
          <button
            @click="router.push(`/bookings/${bookingId}`)"
            class="w-1/2 bg-gray-300 text-gray-800 py-3 rounded-md hover:bg-gray-400 font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleSaveChanges"
            :disabled="bookingStore.loading"
            class="w-1/2 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 font-semibold transition-colors disabled:bg-gray-400"
          >
            {{ bookingStore.loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useBookingStore } from '@/stores/booking.store'
import { useLocationStore } from '@/stores/location.store'
import BookingSearchForm from '@/components/booking/BookingSearchForm.vue'
import type {
  BookingSearchPayload,
  BookingUpdateDetailsPayload,
} from '@/interfaces/booking.interface'
import type { Vehicle } from '@/interfaces/vehicle.interface'

const formatDateTimeForInput = (isoString: string | Date | undefined): string => {
  // [FIX] Handle undefined case
  if (!isoString) return ''
  const date = new Date(isoString)
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 16)
}

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()
const locationStore = useLocationStore()

const bookingId = ref(route.params.id as string)
const isDataLoaded = ref(false)

const prefillData = ref<BookingSearchPayload | null>(null)
const currentSearchCriteria = ref<BookingSearchPayload | null>(null)
const selectedVehicle = ref<Vehicle | null>(null)
const showResults = ref(false)

onMounted(async () => {
  await locationStore.fetchProvinces()
  await bookingStore.getBookingById(bookingId.value)
})

watch(
  () => bookingStore.currentBooking,
  (booking) => {
    if (booking) {
      if (booking.status !== 'Upcoming') {
        toast.error('You can only update bookings with "Upcoming" status.')
        router.push(`/bookings/${booking.id}`)
        return
      }

      const data: BookingSearchPayload = {
        includeDriver: booking.includeDriver,
        pickUpLocation: booking.pickUpLocation,
        dropOffLocation: booking.dropOffLocation,
        pickUpTime: formatDateTimeForInput(booking.pickUpTime), // Aman karena sudah dihandle
        dropOffTime: formatDateTimeForInput(booking.dropOffTime), // Aman karena sudah dihandle
        capacityNeeded: booking.capacityNeeded || 1,
        transmissionNeeded: booking.transmissionNeeded || 'Automatic',
      }

      prefillData.value = data
      currentSearchCriteria.value = data
      isDataLoaded.value = true
    }
  },
)

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
  await bookingStore.searchAvailableVehicles(payload)

  const oldVehicleStillAvailable = bookingStore.availableVehicles.find(
    (v) => v.id === bookingStore.currentBooking?.vehicleId,
  )
  if (oldVehicleStillAvailable) {
    selectedVehicle.value = oldVehicleStillAvailable
  }
}

const handleSelectVehicle = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle
  toast.success(`${vehicle.brand} ${vehicle.model} selected.`)
}

const handleSaveChanges = async () => {
  if (!selectedVehicle.value || !currentSearchCriteria.value) {
    toast.error('Please select a vehicle before saving.')
    return
  }

  // [FIX] Sekarang payload cocok dengan interface yang diperbarui
  const payload: BookingUpdateDetailsPayload = {
    ...currentSearchCriteria.value,
    vehicleId: selectedVehicle.value.id,
  }

  const updatedBooking = await bookingStore.updateBookingDetails(bookingId.value, payload)
  if (updatedBooking) {
    router.push(`/bookings/${updatedBooking.id}`)
  }
}
</script> -->
