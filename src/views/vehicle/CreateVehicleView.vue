<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Create a New Vehicle</h1>

    <div v-if="vendorStore.loading" class="text-center p-10">Loading vendors... ⏳</div>
    <div v-else-if="vendorStore.error" class="text-center p-10 text-red-600">
      <strong>Failed to load data:</strong> {{ vendorStore.error }}
    </div>

    <VehicleForm
      v-else
      :initial-data="emptyForm"
      :vendors="vendorStore.vendors"
      :fetched-locations="vendorStore.selectedVendorLocations"
      :is-update-mode="false"
      :loading="isSubmitting"
      @submit="handleCreateVehicle"
      @cancel="handleCancel"
      @vendor-id-changed="handleVendorChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useVendorStore } from '@/stores/vendor.store'
import VehicleForm from '@/components/vehicle/VVehicleForm.vue'
import { vehicleService } from '@/services/vehicle.service'
import type { VehicleCreatePayload } from '@/interfaces/vehicle.interface'

const router = useRouter()
const vendorStore = useVendorStore()
const isSubmitting = ref(false)

// Default form
const emptyForm: VehicleCreatePayload = {
  rentalVendorId: null,
  type: '',
  brand: '',
  model: '',
  year: null,
  location: '',
  licensePlate: '',
  capacity: null,
  transmission: '',
  fuelType: '',
  price: null,
}

// Fetch all vendors when mounted
onMounted(async () => {
  await vendorStore.fetchAllVendors()
})

// 🔥 Handler untuk event vendor-id-changed
const handleVendorChange = async (vendorId: number) => {
  console.log('📡 Parent: vendor-id-changed received:', vendorId)
  if (vendorId && vendorId !== 0) {
    await vendorStore.fetchVendorLocations(vendorId)
    console.log(
      '✅ Parent: updated vendorStore.selectedVendorLocations:',
      vendorStore.selectedVendorLocations,
    )
  } else {
    vendorStore.selectedVendorLocations = [] // reset kalau vendor direset
  }
}

const handleCreateVehicle = async (formData: VehicleCreatePayload) => {
  isSubmitting.value = true
  try {
    const newVehicle = await vehicleService.createVehicle(formData)
    if (newVehicle) {
      toast.success(`Vehicle ${newVehicle.brand} ${newVehicle.model} created!`)
      router.push(`/vehicles/${newVehicle.id}`)
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => router.push('/vehicles')
</script>
