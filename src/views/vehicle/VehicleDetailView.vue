<template>
  <div class="p-8 max-w-4xl mx-auto">
    <!-- State Loading -->
    <div v-if="loading" class="text-center p-10 text-gray-500">Loading vehicle details... ⏳</div>

    <!-- State Error -->
    <div v-else-if="error" class="text-center p-10 text-red-600">
      <strong>Error:</strong> {{ error }}
    </div>

    <!-- Konten Utama (Tampilan Baru) -->
    <div v-else-if="vehicle" class="space-y-6">
      <!-- Header: Hanya Judul & Tombol Aksi -->
      <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <!-- ✅ Brand/Model dipindah ke grid -->
          <h1 class="text-3xl font-bold text-gray-800">Vehicle Details</h1>
        </div>

        <!-- Tombol Aksi (Fitur 5 & 6) -->
        <div class="flex gap-2 flex-shrink-0">
          <VButton
            v-if="vehicle.status !== 'In Use'"
            :to="`/vehicles/${vehicle.id}/update`"
            variant="primary"
          >
            Update Vehicle Details
          </VButton>
          <VButton v-if="vehicle.status !== 'In Use'" variant="danger" @click="handleDelete">
            Delete Vehicle
          </VButton>
        </div>
      </div>

      <!-- 
        ✅ PERUBAHAN BESAR: 
        Detail Grid (2-kolom) 
        Sekarang berisi SEMUA 14 data field.
      -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <!-- Kolom 1 -->
          <div>
            <dt class="text-sm font-medium text-gray-500">Vehicle ID</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">{{ vehicle.id }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Rental Vendor</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">{{ vehicle.rentalVendorName }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Brand</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">{{ vehicle.brand }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Model</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">{{ vehicle.model }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">License Plate</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">{{ vehicle.licensePlate }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Vehicle Type</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">{{ vehicle.type }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Production Year</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">{{ vehicle.year }}</dd>
          </div>

          <!-- Kolom 2 -->
          <div>
            <dt class="text-sm font-medium text-gray-500">Location</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">{{ vehicle.location }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Capacity</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">
              {{ vehicle.capacity }} passengers
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Transmission</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">{{ vehicle.transmission }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Fuel Type</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">{{ vehicle.fuelType }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Price per Day</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">
              {{ formatCurrency(vehicle.price) }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Rental Vendor ID</dt>
            <dd class="mt-1 text-lg font-semibold text-gray-900">{{ vehicle.rentalVendorId }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="mt-1">
              <span
                class="px-2 py-1 font-semibold leading-tight rounded-full text-xs"
                :class="getStatusClass(vehicle.status)"
              >
                {{ vehicle.status }}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <!-- ✅ PERUBAHAN: Tombol Back sekarang di luar card, full-width -->
      <div class="pt-4">
        <VButton variant="outline" @click="handleBack" class="w-full">
          &larr; Back to List
        </VButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// ... (sisa script setup tidak berubah, biarkan saja) ...
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { vehicleService } from '@/services/vehicle.service'
import type { Vehicle } from '@/interfaces/vehicle.interface'
import VButton from '@/components/common/VButton.vue'
// ✅ Import DetailItem.vue sudah dihapus

const route = useRoute()
const router = useRouter()

const vehicle = ref<Vehicle | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// --- Data Fetching ---
onMounted(async () => {
  const vehicleId = route.params.id as string
  if (!vehicleId) {
    error.value = 'No vehicle ID provided.'
    loading.value = false
    return
  }

  try {
    const data = await vehicleService.getVehicleById(vehicleId)
    if (data) {
      vehicle.value = data
    } else {
      error.value = 'Vehicle not found.'
      toast.error('Vehicle not found.')
      router.push('/vehicles') // Kembali ke list jika tidak ketemu
    }
  } catch (err: any) {
    // <-- KURUNG KURAWAL YANG HILANG DITAMBAHKAN DI SINI
    error.value = err.message || 'Failed to fetch vehicle details.'
  } finally {
    loading.value = false
  }
})

// --- Handlers ---
const handleDelete = async () => {
  if (!vehicle.value) return

  // Fitur 6: Konfirmasi pop-up
  const isConfirmed = window.confirm(
    `Are you sure you want to delete ${vehicle.value.brand} ${vehicle.value.model}? This action cannot be undone.`,
  )

  if (isConfirmed) {
    const success = await vehicleService.deleteVehicle(vehicle.value.id)
    if (success) {
      toast.success('Vehicle successfully deleted.')
      router.push('/vehicles')
    }
    // toast.error() sudah di-handle oleh service
  }
}

const handleBack = () => {
  router.push('/vehicles')
}

// --- Helpers ---
const formatCurrency = (value: number) => {
  if (!value) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const getStatusClass = (status: Vehicle['status']) => {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800'
    case 'In Use':
      return 'bg-yellow-100 text-yellow-800'
    case 'Unavailable':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>
