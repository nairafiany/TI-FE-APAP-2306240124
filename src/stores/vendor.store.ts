import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { vendorService } from '@/services/vendor.service'
import type { Vendor } from '@/interfaces/vendor.interface'

export const useVendorStore = defineStore('vendor', () => {
  // --- STATE ---
  const vendors = ref<Vendor[]>([])
  // ✅ INI STATE PENTING UNTUK LOKASI YANG DIPILIH
  const selectedVendorLocations = ref<string[]>([])

  const loading = ref(false)
  const error = ref<string | null>(null)

  // --- ACTIONS ---

  // Ambil SEMUA vendors
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

  // Ambil LOKASI untuk SATU vendor
  async function fetchVendorLocations(vendorId: number) {
    // Tidak perlu set loading.value = true agar tidak mengganggu UI
    error.value = null
    try {
      const data = await vendorService.getVendorLocations(vendorId)
      // ✅ INI BARIS PALING PENTING:
      // Pastikan state di-update dengan data lokasi yang baru
      selectedVendorLocations.value = data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch locations.'
      toast.error(error.value ?? 'Unknown error occurred')
      selectedVendorLocations.value = [] // Reset jika error
    }
  }

  // --- RETURN ---
  return {
    vendors,
    selectedVendorLocations,
    loading,
    error,
    fetchAllVendors,
    fetchVendorLocations,
  }
})
