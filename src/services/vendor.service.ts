import axios from 'axios'
import { toast } from 'vue-sonner'
import type { Vendor } from '@/interfaces/vendor.interface'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'

const baseVendorUrl = `${import.meta.env.VITE_API_URL}/vendors`

export class VendorService {
  private static instance: VendorService

  public static getInstance(): VendorService {
    if (!VendorService.instance) {
      VendorService.instance = new VendorService()
    }
    return VendorService.instance
  }

  async getAllVendors(): Promise<Vendor[]> {
    try {
      const { data } = await axios.get<CommonResponseInterface<Vendor[]>>(baseVendorUrl)
      console.log('✅ [GET ALL VENDORS]', data)
      return data.data || []
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Gagal memuat vendor.'
      console.error('❌ [GET ALL VENDORS]', error)
      toast.error(msg)
      throw new Error(msg)
    }
  }

  async getVendorLocations(vendorId: number): Promise<string[]> {
    try {
      const { data } = await axios.get<CommonResponseInterface<string[]>>(
        `${baseVendorUrl}/${vendorId}/locations`,
      )
      console.log('✅ [GET LOCATIONS]', data)
      return data.data || []
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Gagal memuat lokasi vendor.'
      console.error('❌ [GET LOCATIONS]', error)
      toast.error(msg)
      throw new Error(msg)
    }
  }
}

export const vendorService = VendorService.getInstance()
