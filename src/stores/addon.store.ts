import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { toast } from 'vue-sonner'
import type { RentalAddOn } from '@/interfaces/addon.interface'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'

const baseAddOnUrl = `${import.meta.env.VITE_API_URL}/addons`

export const useAddOnStore = defineStore('addon', () => {
  const addOns = ref<RentalAddOn[]>([])
  const loading = ref(false)

  const error = ref<string | null>(null)

  // --- Actions ---
  async function fetchAddOns() {
    if (addOns.value.length > 0) return // Jangan fetch ulang jika data sudah ada

    loading.value = true
    error.value = null // Reset error setiap kali fetch
    try {
      const { data } = await axios.get<CommonResponseInterface<RentalAddOn[]>>(baseAddOnUrl)
      if (data.status === 200) {
        addOns.value = data.data || []
      } else {
        throw new Error(data.message || 'Gagal memuat add-ons.')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Terjadi kesalahan saat memuat add-ons.'
      error.value = msg // Set state error
      toast.error(`Error: ${msg}`)
    } finally {
      loading.value = false
    }
  }

  return {
    addOns,
    loading,
    error,
    fetchAddOns,
  }
})
