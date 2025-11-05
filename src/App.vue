<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import VNavbar from '@/components/common/VNavbar.vue' // ✅ import komponen navbar
</script>

<template>
  <!-- ✅ Toast Notification -->
  <Toaster position="top-center" rich-colors />

  <!-- ✅ Navbar -->
  <VNavbar />

  <!-- ✅ Main Content -->
  <main class="bg-gray-50 min-h-screen p-6">
    <RouterView />
  </main>
</template>

<style scoped>
* {
  font-family: 'Inter', system-ui, sans-serif;
}
</style>
