import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RentalAddOn } from '@/interfaces/addon.interface'
import { addOnService } from '@/services/addon.service' // <-- Impor service singleton

export const useAddOnStore = defineStore('addon', () => {
  // --- State ---
  const addOns = ref<RentalAddOn[]>([])
  const loading = ref(false)

  // --- Actions ---
  async function fetchAddOns() {
    loading.value = true
    try {
      // Panggil method dari service yang sudah dibuat
      const data = await addOnService.getAllAddOns()
      addOns.value = data
    } finally {
      loading.value = false
    }
  }

  return {
    addOns,
    loading,
    fetchAddOns,
  }
})
