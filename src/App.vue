<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
</script>

<template>
  <!-- ✅ Toast Notification -->
  <Toaster position="top-center" rich-colors />

  <!-- ✅ Navbar -->
  <nav class="bg-green-700 text-white px-8 py-4 flex justify-between items-center shadow-md">
    <div class="text-lg font-bold">Vehicle Rental App</div>

    <div class="flex gap-6 font-medium">
      <RouterLink
        to="/vehicles"
        class="hover:text-yellow-200 transition"
        active-class="underline underline-offset-4 text-yellow-200"
      >
        Vehicles
      </RouterLink>
      <RouterLink
        to="/bookings"
        class="hover:text-yellow-200 transition"
        active-class="underline underline-offset-4 text-yellow-200"
      >
        Bookings
      </RouterLink>
    </div>
  </nav>

  <!-- ✅ Main Content -->
  <main class="bg-gray-50 min-h-screen p-6">
    <RouterView />
  </main>
</template>

<style scoped>
* {
  font-family: 'Inter', system-ui, sans-serif;
}

.router-link-active {
  color: #fef08a;
}
</style>
