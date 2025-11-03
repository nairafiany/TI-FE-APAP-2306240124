<template>
  <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-lg p-8 space-y-6">
    <!-- Baris 1: Status & Rental Vendor -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Status hanya muncul kalau update -->
      <VSelect
        v-if="isUpdateMode"
        label="Status"
        v-model="formData.status"
        :options="statusOptions"
        placeholder="Select a Status"
        required
      />

      <!-- Vendor dropdown -->
      <VSelect
        label="Rental Vendor"
        v-model="formData.rentalVendorId"
        :options="vendorOptions"
        placeholder="Select a Vendor"
        required
      />
    </div>

    <!-- Baris 2: Vehicle Type & Brand -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <VSelect
        label="Vehicle Type"
        v-model="formData.type"
        :options="typeOptions"
        placeholder="Select a Vehicle Type"
        required
      />
      <VInput label="Vehicle Brand" v-model="formData.brand" placeholder="e.g. Toyota" required />
    </div>

    <!-- Baris 3: Model & Production Year -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <VInput label="Vehicle Model" v-model="formData.model" placeholder="e.g. Avanza" required />
      <VInput
        label="Production Year"
        type="number"
        :model-value="formData.year"
        @update:modelValue="formData.year = $event ? parseInt($event, 10) : null"
        placeholder="e.g. 2020"
        required
        min="1900"
      />
    </div>

    <!-- Baris 4: Location & License Plate -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <VSelect
        label="Location"
        v-model="formData.location"
        :options="locationOptions"
        :disabled="!formData.rentalVendorId || formData.rentalVendorId === 0"
        placeholder="Select a Location"
        required
      />
      <VInput
        label="License Plate"
        v-model="formData.licensePlate"
        placeholder="e.g. B 1234 ABC"
        required
      />
    </div>

    <!-- Baris 5: Capacity & Transmission -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <VInput
        label="Capacity"
        type="number"
        :model-value="formData.capacity"
        @update:modelValue="formData.capacity = $event ? parseInt($event, 10) : null"
        placeholder="e.g. 4"
        required
        min="1"
      />
      <VSelect
        label="Transmission"
        v-model="formData.transmission"
        :options="transmissionOptions"
        placeholder="Select Transmission"
        required
      />
    </div>

    <!-- Baris 6: Fuel Type & Price -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <VSelect
        label="Fuel Type"
        v-model="formData.fuelType"
        :options="fuelOptions"
        placeholder="Select Fuel Type"
        required
      />
      <VInput
        label="Price per Day"
        type="number"
        :model-value="formData.price"
        @update:modelValue="formData.price = $event ? parseFloat($event) : null"
        placeholder="e.g. 750000"
        required
        min="1"
      />
    </div>

    <!-- Tombol Aksi -->
    <div class="flex justify-end gap-4 pt-4 border-t border-gray-200 mt-6">
      <VButton type="button" variant="outline" @click="onCancel">Cancel</VButton>
      <VButton type="submit" variant="primary" :disabled="loading">
        {{ isUpdateMode ? 'Save Changes' : 'Save' }}
      </VButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, computed, type PropType } from 'vue'
import VInput from '@/components/common/VInput.vue'
import VSelect from '@/components/common/VSelect.vue'
import VButton from '@/components/common/VButton.vue'
import type { Vendor } from '@/interfaces/vendor.interface'
import type { VehiclePayload } from '@/interfaces/vehicle.interface'
import { toast } from 'vue-sonner'

// --- TYPES ---
type VehicleFormData = VehiclePayload & { status?: string }

// --- PROPS ---
const props = defineProps({
  initialData: { type: Object as PropType<VehicleFormData>, required: true },
  vendors: { type: Array as PropType<Vendor[]>, default: () => [] },
  fetchedLocations: { type: Array as PropType<string[]>, default: () => [] },
  isUpdateMode: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel', 'vendor-id-changed'])
const formData = ref<VehicleFormData>({ ...props.initialData })

// --- OPTIONS ---
const typeOptions = [
  { value: 'Sedan', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'MPV', label: 'MPV' },
  { value: 'Luxury', label: 'Luxury' },
]
const transmissionOptions = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatic', label: 'Automatic' },
]
const fuelOptions = [
  { value: 'Bensin', label: 'Bensin' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'Listrik', label: 'Listrik' },
]
const statusOptions = [
  { value: 'Available', label: 'Available' },
  { value: 'Unavailable', label: 'Unavailable' },
]

// --- COMPUTED ---
const vendorOptions = computed(() => [
  ...props.vendors.map((v) => ({ label: v.name, value: v.id })),
])
const locationOptions = computed(() =>
  props.fetchedLocations.map((loc) => ({ value: loc, label: loc })),
)

// --- WATCHERS ---
// 1️⃣ Sync props.initialData → formData
watch(
  () => props.initialData,
  (newData) => {
    console.log('♻️ [RESET FORM]', newData)
    formData.value = { ...newData }
  },
  { deep: true },
)

// 2️⃣ Watch vendorId changes (avoid resetting location on initial load)
watch(
  () => formData.value.rentalVendorId,
  (newId, oldId) => {
    console.log('🏢 [VENDOR WATCH]', { oldId, newId })

    // Only trigger when user actually changes vendor (not on initial mount)
    if (oldId !== undefined && newId !== oldId && newId !== 0 && newId) {
      console.log('📡 Vendor changed → reset location & emit')
      formData.value.location = ''
      emit('vendor-id-changed', newId)
    }
  },
  { immediate: false },
)

// --- SUBMIT HANDLER ---
const handleSubmit = () => {
  const data = formData.value
  const errors: string[] = []

  // 🔍 VALIDATION
  if (!data.rentalVendorId || data.rentalVendorId === 0) errors.push('Rental Vendor')
  if (!data.type) errors.push('Vehicle Type')
  if (!data.brand) errors.push('Vehicle Brand')
  if (!data.model) errors.push('Vehicle Model')
  if (!data.location) errors.push('Location')
  if (!data.licensePlate) errors.push('License Plate')
  if (!data.transmission) errors.push('Transmission')
  if (!data.fuelType) errors.push('Fuel Type')
  if (props.isUpdateMode && !data.status) errors.push('Status')

  if (data.year === null || data.year < 1900) errors.push('Production Year (min 1900)')
  if (data.capacity === null || data.capacity <= 0) errors.push('Capacity (must be > 0)')
  if (data.price === null || data.price <= 0) errors.push('Price per Day (must be > 0)')

  if (errors.length > 0) {
    toast.error(`Please correct the following fields: ${errors.join(', ')}`)
    return
  }

  console.log('💾 [SUBMIT]', data)
  emit('submit', data)
}

const onCancel = () => emit('cancel')
</script>
