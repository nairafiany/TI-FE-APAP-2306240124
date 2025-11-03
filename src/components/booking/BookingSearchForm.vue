<template>
  <fieldset :disabled="locationStore.loading" class="w-full">
    <form @submit.prevent="onSearch" class="flex flex-col space-y-6">
      <div class="flex items-center">
        <input
          id="includeDriver"
          v-model="form.includeDriver"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label for="includeDriver" class="ml-3 block text-sm font-medium text-gray-800"
          >Include Driver? <span class="text-gray-500 font-normal">(Rp 100.000/day)</span></label
        >
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div>
          <label for="pickUpLocation" class="block text-sm font-medium text-gray-800 mb-1"
            >Pick-up Location</label
          >
          <select
            id="pickUpLocation"
            v-model="form.pickUpLocation"
            required
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100"
          >
            <option v-if="locationStore.loading" value="" disabled>Loading locations...</option>
            <option v-else value="" disabled>--Select--</option>
            <option
              v-for="province in locationStore.provinces"
              :key="province.code"
              :value="province.name"
            >
              {{ province.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="dropOffLocation" class="block text-sm font-medium text-gray-800 mb-1"
            >Drop-off Location</label
          >
          <select
            id="dropOffLocation"
            v-model="form.dropOffLocation"
            required
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100"
          >
            <option v-if="locationStore.loading" value="" disabled>Loading locations...</option>
            <option v-else value="" disabled>--Select--</option>
            <option
              v-for="province in locationStore.provinces"
              :key="province.code"
              :value="province.name"
            >
              {{ province.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div>
          <label for="pickUpTime" class="block text-sm font-medium text-gray-800 mb-1"
            >Pick-up Time</label
          >
          <input
            type="datetime-local"
            id="pickUpTime"
            v-model="form.pickUpTime"
            :min="minDateTime"
            required
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label for="dropOffTime" class="block text-sm font-medium text-gray-800 mb-1"
            >Drop-off Time</label
          >
          <input
            type="datetime-local"
            id="dropOffTime"
            v-model="form.dropOffTime"
            :min="form.pickUpTime || minDateTime"
            required
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100"
          />
        </div>
      </div>
      <div>
        <label for="capacityNeeded" class="block text-sm font-medium text-gray-800 mb-1"
          >Capacity Needed</label
        >
        <input
          type="number"
          id="capacityNeeded"
          v-model.number="form.capacityNeeded"
          required
          min="1"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-800 mb-2">Transmission</label>
        <div class="flex items-center space-x-6">
          <div class="flex items-center">
            <input
              id="manual"
              v-model="form.transmissionNeeded"
              value="Manual"
              type="radio"
              name="transmission"
              class="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label for="manual" class="ml-2 block text-sm text-gray-900">Manual</label>
          </div>
          <div class="flex items-center">
            <input
              id="automatic"
              v-model="form.transmissionNeeded"
              value="Automatic"
              type="radio"
              name="transmission"
              class="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label for="automatic" class="ml-2 block text-sm text-gray-900">Automatic</label>
          </div>
        </div>
      </div>
      <div class="pt-2">
        <button
          type="submit"
          :disabled="locationStore.loading || loading"
          class="w-full bg-green-600 text-white py-2.5 rounded-md hover:bg-green-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? 'Searching...' : 'Search for Vehicles' }}
        </button>
      </div>
    </form>
  </fieldset>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, type PropType } from 'vue'
import { useLocationStore } from '@/stores/location.store'
import type { BookingSearchPayload } from '@/interfaces/booking.interface'
import { toast } from 'vue-sonner'

const props = defineProps({
  loading: Boolean,
  prefilledData: {
    type: Object as PropType<BookingSearchPayload | null>,
    default: null,
  },
})

const emit = defineEmits<{ (e: 'search', payload: BookingSearchPayload): void }>()
const locationStore = useLocationStore()
const form = ref<BookingSearchPayload>({
  includeDriver: false,
  pickUpLocation: '',
  dropOffLocation: '',
  pickUpTime: '',
  dropOffTime: '',
  capacityNeeded: 1,
  transmissionNeeded: 'Automatic',
})

const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
})

watchEffect(() => {
  if (props.prefilledData) {
    form.value = { ...props.prefilledData }
  }
})

const onSearch = () => {
  if (!form.value.pickUpTime || !form.value.dropOffTime) {
    toast.error('Please select both pick-up and drop-off times.')
    return
  }
  const pickUpDate = new Date(form.value.pickUpTime)
  const dropOffDate = new Date(form.value.dropOffTime)
  if (dropOffDate <= pickUpDate) {
    toast.error('Drop-off time must be after the pick-up time.')
    return
  }
  emit('search', form.value)
}
</script>
