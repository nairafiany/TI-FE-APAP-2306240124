import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { vendorService } from '@/services/vendor.service'
import type { Vendor } from '@/interfaces/vendor.interface'

export const useVendorStore = defineStore('vendor', () => {
  // --- STATE ---
  const vendors = ref<Vendor[]>([])
  const selectedVendorLocations = ref<string[]>([])

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAllVendors() {
    loading.value = true
    error.value = null
    try {
      const data = await vendorService.getAllVendors()
      vendors.value = data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch vendors.'
      toast.error(error.value ?? 'Unknown error occurred')
    } finally {
      loading.value = false
    }
  }

  async function fetchVendorLocations(vendorId: number) {
    error.value = null
    try {
      const data = await vendorService.getVendorLocations(vendorId)

      selectedVendorLocations.value = data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch locations.'
      toast.error(error.value ?? 'Unknown error occurred')
      selectedVendorLocations.value = [] // Reset jika error
    }
  }

  return {
    vendors,
    selectedVendorLocations,
    loading,
    error,
    fetchAllVendors,
    fetchVendorLocations,
  }
})
