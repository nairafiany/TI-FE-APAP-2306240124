import { defineStore } from 'pinia'
import { locationService } from '@/services/location.service'
import type { Province } from '@/interfaces/location.interface'
import { toast } from 'vue-sonner'

export const useLocationStore = defineStore('location', {
  state: () => ({
    provinces: [] as Province[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchProvinces() {
      if (this.provinces.length > 0) return

      this.loading = true
      this.error = null
      try {
        const provinceData = await locationService.getProvinces()
        this.provinces = provinceData.sort((a, b) => a.name.localeCompare(b.name)) // Sortir berdasarkan abjad

        if (this.provinces.length > 0) {
          toast.success('Data provinsi berhasil dimuat.')
        }
      } catch (err: any) {
        this.error = err.message || 'Terjadi kesalahan saat memuat provinsi.'
        toast.error(this.error ?? 'Terjadi kesalahan saat memuat provinsi.')
      } finally {
        this.loading = false
      }
    },
  },
})
