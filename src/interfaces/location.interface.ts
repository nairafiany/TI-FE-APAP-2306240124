export interface Province {
  code: string
  name: string
}

export interface WilayahApiResponse {
  data: Province[]
  // Anda bisa menambahkan meta jika diperlukan
}
