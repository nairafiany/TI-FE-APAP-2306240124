<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Daftar Kendaraan</h1>

    <!-- 🔹 Action Bar -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex gap-2">
        <!-- DIUBAH: Menggunakan VButton -->
        <VButton to="/vehicles/create" variant="primary"> Add A New Vehicle </VButton>
      </div>

      <!-- 🔹 Search and Filter (Sesuai Fitur 2) -->
      <div class="flex gap-2 items-end">
        <!-- DIUBAH: Menggunakan VInput -->
        <VInput
          v-model="keyword"
          @keyup.enter="applyFilter"
          placeholder="Cari brand, model, plat..."
          class="w-64"
        />

        <!-- DIUBAH: Menggunakan VSelect -->
        <VSelect v-model="filterType" :options="vehicleTypeOptions" class="w-48" />

        <!-- DIUBAH: Menggunakan VButton -->
        <VButton @click="applyFilter" :disabled="store.loading" variant="secondary">
          Filter
        </VButton>
      </div>
    </div>

    <!-- 🔹 Vehicles Table -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Loading State -->
      <div v-if="store.loading" class="text-center p-10 text-gray-500">
        Memuat data kendaraan... ⏳
      </div>

      <!-- Error State -->
      <div v-else-if="store.error" class="text-center p-10 text-red-600">
        <strong>Error:</strong> {{ store.error }}
      </div>

      <!-- No Data State -->
      <div v-else-if="!store.vehicles.length" class="text-center p-10 text-gray-500">
        Tidak ada kendaraan yang ditemukan.
      </div>

      <!-- Table Data (Tidak berubah) -->
      <table v-else class="min-w-full text-left border-collapse">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="p-4 border-b">No</th>
            <th class="p-4 border-b">ID</th>
            <th class="p-4 border-b">Type</th>
            <th class="p-4 border-b">Brand</th>
            <th class="p-4 border-b">Model</th>
            <th class="p-4 border-b">Capacity</th>
            <th class="p-4 border-b">Status</th>
            <th class="p-4 border-b">Price per Day</th>
            <th class="p-4 border-b text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(v, index) in store.vehicles"
            :key="v.id"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="p-4">{{ index + 1 }}</td>
            <td class="p-4 font-mono text-sm">{{ v.id }}</td>
            <td class="p-4">{{ v.type }}</td>
            <td class="p-4 font-medium text-gray-800">{{ v.brand }}</td>
            <td class="p-4">{{ v.model }}</td>
            <td class="p-4 text-center">{{ v.capacity }}</td>
            <td class="p-4">
              <span
                class="px-2 py-1 font-semibold leading-tight rounded-full text-xs"
                :class="{
                  'bg-green-100 text-green-800': v.status === 'Available',
                  'bg-yellow-100 text-yellow-800': v.status === 'In Use',
                  'bg-red-100 text-red-800': v.status === 'Unavailable',
                }"
              >
                {{ v.status }}
              </span>
            </td>
            <td class="p-4">
              Rp {{ v.price.toLocaleString('id-ID', { minimumFractionDigits: 2 }) }}
            </td>
            <td class="p-4 text-center">
              <!-- DIUBAH: Menggunakan VButton -->
              <VButton :to="`/vehicles/${v.id}`" variant="secondary" size="sm"> Detail </VButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVehicleStore } from '@/stores/vehicle.store'

// DITAMBAHKAN: Impor komponen common Anda
import VButton from '@/components/common/VButton.vue'
import VInput from '@/components/common/VInput.vue'
import VSelect from '@/components/common/VSelect.vue'

const store = useVehicleStore()
const filterType = ref('')
const keyword = ref('')

// DITAMBAHKAN: Definisikan options untuk VSelect
const vehicleTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'Sedan', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'MPV', label: 'MPV' },
  { value: 'Luxury', label: 'Luxury' },
]

// Memanggil store action yang benar
onMounted(() => {
  store.fetchAllVehicles()
})

// Memanggil store action yang benar
const applyFilter = () => {
  store.fetchFilteredVehicles(filterType.value, keyword.value)
}
</script>
