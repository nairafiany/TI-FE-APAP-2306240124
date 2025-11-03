<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Update Vehicle</h1>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center p-10">Loading vehicle data... ⏳</div>

    <!-- Error -->
    <div v-else-if="error" class="text-center p-10 text-red-600">
      <strong>Failed to load data:</strong> {{ error }}
    </div>

    <!-- Form -->
    <VVehicleForm
      v-else-if="vehicleData"
      :initial-data="vehicleData"
      :vendors="vendors"
      :fetched-locations="fetchedLocations"
      :is-update-mode="true"
      :loading="isSubmitting"
      @submit="handleUpdateVehicle"
      @cancel="handleCancel"
      @vendor-id-changed="handleVendorChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import VVehicleForm from '@/components/vehicle/VVehicleForm.vue'
import { vehicleService } from '@/services/vehicle.service'
import { vendorService } from '@/services/vendor.service'
import type { VehiclePayload } from '@/interfaces/vehicle.interface'
import type { Vendor } from '@/interfaces/vendor.interface'

const route = useRoute()
const router = useRouter()
const vehicleId = route.params.id as string

type VehicleUpdateFormData = VehiclePayload & { status?: string }

const vendors = ref<Vendor[]>([])
const vehicleData = ref<VehicleUpdateFormData | null>(null)
const fetchedLocations = ref<string[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  console.log('🟡 [MOUNT] Fetching data for vehicle:', vehicleId)

  isLoading.value = true
  error.value = null

  try {
    const [fetchedVehicle, fetchedVendors] = await Promise.all([
      vehicleService.getVehicleById(vehicleId),
      vendorService.getAllVendors(),
    ])

    console.log('🚗 [VEHICLE FETCHED]', fetchedVehicle)
    console.log('🏢 [ALL VENDORS FETCHED]', fetchedVendors.length)

    if (!fetchedVehicle) throw new Error(`Vehicle with ID ${vehicleId} not found.`)
    vendors.value = fetchedVendors || []

    // 🔥 Fetch vendor locations FIRST
    if (fetchedVehicle.rentalVendorId) {
      console.log('📡 Fetching locations for vendor:', fetchedVehicle.rentalVendorId)
      fetchedLocations.value = await vendorService.getVendorLocations(fetchedVehicle.rentalVendorId)
      console.log('📍 [LOCATIONS FETCHED]', fetchedLocations.value)
    }

    // ✅ Set full vehicle data *after* locations are fetched
    vehicleData.value = {
      rentalVendorId: fetchedVehicle.rentalVendorId,
      type: fetchedVehicle.type,
      brand: fetchedVehicle.brand,
      model: fetchedVehicle.model,
      year: fetchedVehicle.year,
      location: fetchedVehicle.location, // preselected precise location
      licensePlate: fetchedVehicle.licensePlate,
      capacity: fetchedVehicle.capacity,
      transmission: fetchedVehicle.transmission,
      fuelType: fetchedVehicle.fuelType,
      price: fetchedVehicle.price,
      status: fetchedVehicle.status,
    }

    console.log('✅ [FORM READY] VehicleData:', vehicleData.value)
    console.log('🎯 [PRESELECTED LOCATION]', vehicleData.value.location)
  } catch (err: any) {
    const msg = err.message || 'Failed to fetch initial data.'
    console.error('❌ [ERROR FETCHING DATA]', msg)
    error.value = msg
    toast.error(msg)
  } finally {
    isLoading.value = false
    console.log('🟢 [DONE] Initial load finished.')
  }
})

const handleVendorChange = async (vendorId: number) => {
  console.log('🟠 [VENDOR CHANGE] New vendor ID:', vendorId)
  fetchedLocations.value = []

  if (vendorId && vendorId !== 0) {
    try {
      const locations = await vendorService.getVendorLocations(vendorId)
      fetchedLocations.value = locations || []
      console.log('📍 [LOCATIONS UPDATED] for vendor', vendorId, ':', fetchedLocations.value)
    } catch (err: any) {
      console.error('❌ [LOCATION FETCH ERROR]', err)
      toast.error(`Failed to fetch locations for vendor ${vendorId}`)
      fetchedLocations.value = []
    }
  } else {
    console.warn('⚠️ Vendor reset to 0/null, clearing locations.')
    fetchedLocations.value = []
  }
}

const handleUpdateVehicle = async (formData: VehicleUpdateFormData) => {
  console.log('💾 [SUBMIT UPDATE]', formData)
  isSubmitting.value = true
  try {
    const updated = await vehicleService.updateVehicle(vehicleId, formData)
    if (updated) {
      // toast.success(`✅ Vehicle ${updated.brand} ${updated.model} updated!`)
      console.log('🎉 [UPDATE SUCCESS]', updated)
      router.push(`/vehicles/${updated.id}`)
    }
  } catch (err: any) {
    console.error('❌ [UPDATE FAILED]', err)
    toast.error(err.message || 'Failed to update vehicle.')
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  console.log('🔙 [CANCEL] Returning to vehicle detail.')
  router.push(`/vehicles/${vehicleId}`)
}
</script>
