import axios from 'axios'
import { toast } from 'vue-sonner'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface' // Asumsi Anda punya file ini
import type { RentalAddOn } from '@/interfaces/addon.interface'

const baseAddOnUrl = `${import.meta.env.VITE_API_URL}/addons`

export class AddOnService {
  private static instance: AddOnService

  public static getInstance(): AddOnService {
    if (!AddOnService.instance) {
      AddOnService.instance = new AddOnService()
    }
    return AddOnService.instance
  }

  async getAllAddOns(): Promise<RentalAddOn[]> {
    try {
      const { data } = await axios.get<CommonResponseInterface<RentalAddOn[]>>(baseAddOnUrl)
      console.log('✅ [GET ALL ADD-ONS]', data)

      if (data.status === 200) {
        const addOns = data.data || []

        if (addOns.length > 0) {
          toast.success('Data add-ons berhasil dimuat.')
        } else {
          toast.info('Tidak ada add-ons yang tersedia saat ini.')
        }

        return addOns
      } else {
        throw new Error(data.message || 'Gagal memuat add-ons.')
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Terjadi kesalahan saat memuat add-ons.'
      console.error('❌ [GET ALL ADD-ONS]', error)
      toast.error(`Error: ${msg}`)
      return [] // Kembalikan array kosong jika gagal
    }
  }
}

export const addOnService = AddOnService.getInstance()
