<template>
  <div class="p-8">
    <!-- 🔹 Header -->
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Daftar Pesanan</h1>

    <!-- 🔹 Action Bar -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex gap-2">
        <VButton to="/bookings/create" variant="primary"> + Create A New Booking </VButton>
        <VButton to="/bookings/chart" variant="secondary"> 📊 Statistics </VButton>
      </div>

      <!-- 🔹 Search Bar Placeholder (future extensibility) -->
      <div class="flex gap-2 items-end">
        <VButton @click="fetchData" variant="secondary">🔄 Refresh</VButton>
      </div>
    </div>

    <!-- 🔹 Booking Table -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Loading -->
      <div v-if="loading" class="text-center p-10 text-gray-500">Memuat data pesanan... ⏳</div>

      <!-- Error -->
      <div v-else-if="error" class="text-center p-10 text-red-600">
        <strong>Error:</strong> {{ error }}
      </div>

      <!-- Empty -->
      <div v-else-if="!bookings.length" class="text-center p-10 text-gray-500">
        Tidak ada pesanan yang ditemukan.
      </div>

      <!-- Table -->
      <table v-else ref="bookingTableRef" class="min-w-full text-left border-collapse">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="p-4 border-b">No</th>
            <th class="p-4 border-b">ID</th>
            <th class="p-4 border-b">Vehicle ID</th>
            <th class="p-4 border-b">Waktu Mulai Sewa</th>
            <th class="p-4 border-b">Waktu Akhir Sewa</th>
            <th class="p-4 border-b">Lokasi Awal</th>
            <th class="p-4 border-b">Status</th>
            <th class="p-4 border-b">Total Harga</th>
            <th class="p-4 border-b text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(b, index) in bookings"
            :key="b.id"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="p-4">{{ index + 1 }}</td>
            <td class="p-4 font-mono text-sm">{{ b.id }}</td>
            <td class="p-4 font-mono text-sm">{{ b.vehicleId }}</td>
            <td class="p-4">{{ formatDate(b.pickUpTime) }}</td>
            <td class="p-4">{{ formatDate(b.dropOffTime) }}</td>
            <td class="p-4">{{ b.pickUpLocation }}</td>
            <td class="p-4">
              <span
                :class="getStatusClass(b.status)"
                class="px-2 py-1 font-semibold leading-tight rounded-full text-xs"
              >
                {{ b.status }}
              </span>
            </td>
            <td class="p-4">Rp {{ formatCurrency(b.totalPrice) }}</td>
            <td class="p-4 text-center">
              <VButton :to="`/bookings/${b.id}`" variant="secondary" size="sm"> Detail </VButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { bookingService } from '@/services/booking.service'
import type { Booking } from '@/interfaces/booking.interface'
import { DataTable } from 'simple-datatables'
import 'simple-datatables/dist/style.css'

// Common UI components
import VButton from '@/components/common/VButton.vue'

// =================== STATE ===================
const bookings = ref<Booking[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const bookingTablf = ref<HTMLTableElement | null>(null)
let dataTableInstance: DataTable | null = null

// =================== UTIL FUNCTIONS ===================
const formatDate = (dateValue: string | Date | undefined): string => {
  if (!dateValue) return 'N/A'
  try {
    const dateObj = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
    return dateObj.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (e) {
    return String(dateValue)
  }
}

const formatCurrency = (amount: number): string =>
  amount.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const getStatusClass = (status: string) => {
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

// =================== FETCH ===================
const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    bookings.value = await bookingService.getAllBookings()
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat data pesanan.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

// =================== DATATABLE INIT ===================
watch(
  bookings,
  (newBookings) => {
    nextTick(() => {
      if (bookingTableRef.value) {
        if (dataTableInstance) dataTableInstance.destroy()
        if (newBookings && newBookings.length > 0) {
          dataTableInstance = new DataTable(bookingTableRef.value, {
            searchable: true,
            perPage: 10,
            perPageSelect: [5, 10, 20],
            labels: {
              placeholder: 'Cari pesanan...',
              perPage: '{select} data per halaman',
              noRows: 'Tidak ada data ditemukan',
              info: 'Menampilkan {start}–{end} dari {rows} data',
            },
          })
        }
      }
    })
  },
  { deep: true },
)
</script>

<style>
.dataTable-selector {
  margin-right: 0.5rem;
}
.dataTable-input {
  margin-left: 0.5rem;
}
</style>
