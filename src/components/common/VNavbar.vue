<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="bg-green-700 text-white px-8 py-4 flex justify-between items-center shadow-md">
    <!-- 🔗 Klik logo balik ke home -->
    <RouterLink to="/" class="text-lg font-bold hover:text-yellow-200 transition-colors">
      Vehicle Rental App
    </RouterLink>

    <!-- 🔗 Menu Navigasi -->
    <div class="flex gap-6 font-medium">
      <RouterLink
        to="/vehicles"
        class="hover:text-yellow-200 transition-colors"
        active-class="underline underline-offset-4 text-yellow-200"
      >
        Vehicles
      </RouterLink>
      <RouterLink
        to="/bookings"
        class="hover:text-yellow-200 transition-colors"
        active-class="underline underline-offset-4 text-yellow-200"
      >
        Bookings
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
* {
  font-family: 'Inter', system-ui, sans-serif;
}

.router-link-active {
  color: #fef08a;
}
</style>
