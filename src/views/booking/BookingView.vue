<template>
  <div class="p-8">
    <!-- Header dengan Tombol Aksi -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Daftar Pesanan</h1>
      <div class="flex gap-2">
        <!-- Tombol Create Booking -->
        <VButton to="/bookings/create" variant="primary"> + Create A New Booking </VButton>
        <!-- Tombol Statistics -->
        <VButton to="/bookings/chart" variant="secondary"> 📊 Statistics </VButton>
      </div>
    </div>

    <!-- Container Tabel -->
    <div class="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
      <!-- Loading & Error State -->
      <div v-if="loading" class="text-center p-4 text-gray-500">Loading data... ⏳</div>
      <div v-else-if="error" class="text-center p-4 text-red-600">
        <strong>Error:</strong> {{ error }}
      </div>
      <div v-else-if="!bookings.length" class="text-center p-4 text-gray-500">
        Tidak ada pesanan ditemukan.
      </div>

      <!-- Tabel yang akan di-enhance oleh simple-datatables -->
      <table v-else ref="bookingTableRef" class="min-w-full">
        <thead class="bg-gray-100">
          <tr>
            <!-- Kolom sesuai spesifikasi -->
            <th class="p-3 text-left">No</th>
            <th class="p-3 text-left">ID</th>
            <th class="p-3 text-left">Vehicle ID</th>
            <th class="p-3 text-left">Waktu Mulai Sewa</th>
            <th class="p-3 text-left">Waktu Akhir Sewa</th>
            <th class="p-3 text-left">Lokasi Awal Sewa</th>
            <th class="p-3 text-left">Status</th>
            <th class="p-3 text-left">Total Harga</th>
            <th class="p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <!-- Data di-render di sini, simple-datatables akan mengambilnya -->
          <tr v-for="(b, index) in bookings" :key="b.id" class="border-t hover:bg-gray-50">
            <td class="p-3">{{ index + 1 }}</td>
            <td class="p-3 font-mono text-sm">{{ b.id }}</td>
            <td class="p-3 font-mono text-sm">{{ b.vehicleId }}</td>
            <!-- Menggunakan data dari DTO jika ada, jika tidak N/A -->
            <td class="p-3">{{ formatDate(b.pickUpTime) }}</td>
            <td class="p-3">{{ formatDate(b.dropOffTime) }}</td>
            <td class="p-3">{{ b.pickUpLocation }}</td>
            <td class="p-3">
              <span
                :class="getStatusClass(b.status)"
                class="px-2 py-1 font-semibold leading-tight rounded-full text-xs"
              >
                {{ b.status }}
              </span>
            </td>
            <td class="p-3">Rp {{ formatCurrency(b.totalPrice) }}</td>
            <td class="p-3 text-center">
              <!-- Tombol Detail menggunakan VButton -->
              <VButton :to="`/bookings/${b.id}`" variant="secondary"> Detail </VButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
// Gunakan Booking Service
import { bookingService } from '@/services/booking.service'
import type { Booking } from '@/interfaces/booking.interface'
import { DataTable } from 'simple-datatables'
import 'simple-datatables/dist/style.css' // Import CSS
import VButton from '@/components/common/VButton.vue' // Gunakan VButton

// State lokal untuk view ini
const bookings = ref<Booking[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const bookingTableRef = ref<HTMLTableElement | null>(null)
let dataTableInstance: DataTable | null = null

// Helper function untuk format tanggal
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A' // Jika API tidak mengembalikan waktu
  try {
    // Asumsi API mengembalikan ISO String atau format yang bisa diparse Date
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (e) {
    console.warn(`Could not format date: ${dateString}`, e)
    return dateString // Return original if formatting fails
  }
}

// Helper function untuk format mata uang
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Helper function untuk kelas status
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

// Fungsi untuk fetch data menggunakan service
const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    bookings.value = await bookingService.getAllBookings()
  } catch (err: any) {
    // Error sudah di-handle oleh toast di service, cukup set state error lokal
    error.value = err.message || 'Failed to fetch bookings.'
  } finally {
    loading.value = false
  }
}

// Ambil data saat komponen dimuat
onMounted(() => {
  fetchData()
})

// Inisialisasi atau update DataTable saat data bookings berubah
watch(
  bookings, // Watch state lokal 'bookings'
  (newBookings) => {
    nextTick(() => {
      // Tunggu DOM update
      if (bookingTableRef.value) {
        if (dataTableInstance) {
          dataTableInstance.destroy() // Hapus instance lama
        }
        // Buat instance baru jika ada data
        if (newBookings && newBookings.length > 0) {
          dataTableInstance = new DataTable(bookingTableRef.value, {
            searchable: true,
            perPage: 10, // Default 10 per halaman
            perPageSelect: [5, 10, 15, 20], // Opsi jumlah per halaman
            labels: {
              placeholder: 'Search...',
              perPage: '{select} entries per page',
              noRows: 'No bookings found',
              info: 'Showing {start} to {end} of {rows} entries',
            },
            // Anda bisa menambahkan konfigurasi sorting default di sini jika perlu
            // Contoh: sort by ID descending (kolom kedua)
            // sortable: true,
            // columns: [ { select: 1, sort: "desc" } ]
          })
        }
      }
    })
  },
  { deep: true }, // Perhatikan perubahan dalam array
)
</script>

<style>
/* Styling tambahan untuk simple-datatables jika perlu */
.dataTable-selector {
  margin-right: 0.5rem;
}
.dataTable-input {
  margin-left: 0.5rem;
}
</style>
