<template>
  <div class="min-h-screen bg-green-50 flex flex-col items-center justify-center px-6 py-10">
    <!-- Header App -->
    <h1 class="text-3xl md:text-4xl font-bold text-center mb-2">
      Welcome to <span class="text-green-600">Vehicle Rentals</span>
    </h1>
    <p class="text-gray-600 text-center max-w-xl mb-10">
      Find and book your ideal vehicle easily. Quick, reliable, and ready for your next adventure!
    </p>

    <!-- Statistik Section -->
    <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-3xl text-center">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Platform Statistics</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Vehicles -->
        <div class="flex flex-col items-center bg-green-50 rounded-xl p-5 shadow-sm">
          <div class="text-4xl mb-2">🚗</div>
          <h3 class="text-gray-600 text-sm font-medium mb-1">Registered Vehicles</h3>
          <p class="text-2xl font-bold text-green-700">{{ stats.totalVehicles }}</p>
        </div>

        <!-- Vendors -->
        <div class="flex flex-col items-center bg-green-50 rounded-xl p-5 shadow-sm">
          <div class="text-4xl mb-2">👤</div>
          <h3 class="text-gray-600 text-sm font-medium mb-1">Registered Vendors</h3>
          <p class="text-2xl font-bold text-green-700">{{ stats.totalVendors }}</p>
        </div>

        <!-- Bookings -->
        <div class="flex flex-col items-center bg-green-50 rounded-xl p-5 shadow-sm">
          <div class="text-4xl mb-2">📅</div>
          <h3 class="text-gray-600 text-sm font-medium mb-1">Bookings Made</h3>
          <p class="text-2xl font-bold text-green-700">{{ stats.totalBookings }}</p>
        </div>
      </div>

      <!-- Tombol Navigasi -->
      <div class="flex flex-wrap justify-center gap-4">
        <VButton
          to="/vehicles"
          variant="primary"
          class="bg-green-600 hover:bg-green-700 px-6 py-3 text-lg"
        >
          See Vehicles
        </VButton>
        <VButton
          to="/bookings"
          variant="primary"
          class="bg-green-600 hover:bg-green-700 px-6 py-3 text-lg"
        >
          Book Rentals
        </VButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VButton from '@/components/common/VButton.vue'
import { homeService } from '@/services/home.service'

const stats = ref({
  totalVehicles: 0,
  totalVendors: 0,
  totalBookings: 0,
})

const fetchSummary = async () => {
  try {
    stats.value = await homeService.getSummary()
  } catch (err) {
    console.error('Failed to load summary:', err)
  }
}

onMounted(fetchSummary)
</script>

<style scoped>
h1 span {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
