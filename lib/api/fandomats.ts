import { apiClient } from "./client"

export interface Fondomat {
  id: number
  name: string
  location: string
  latitude: string
  longitude: string
  is_active: boolean
  status: string
  collected_total: number
  total_income: string
  created_at: string
  qr_code?: string
}

export interface FondomatsStats {
  total: number
  active: number
  maintenance: number
  inactive: number
  total_income: string
}

export interface FondomatsResponse {
  fandomats: Fondomat[]
  stats: FondomatsStats
}

export interface CreateFondomat {
  name: string
  location: string
  latitude: number
  longitude: number
  is_active: boolean
  status: string
  model: string
  software_version: string
  serial_number: string
}

export interface UpdateFondomat {
  name?: string
  location?: string
  latitude?: number
  longitude?: number
  is_active?: boolean
  status?: string
  model?: string
  software_version?: string
  serial_number?: string
}

export interface DetailedFondomat extends Fondomat {
  model?: string
  software_version?: string
  serial_number?: string
  installation_date: string
  last_maintenance: string
  collected_today: number
  collected_week: number
  collected_month: number
  avg_collected_per_day: number
  peak_hour_start: string
  peak_hour_end: string
  min_activity_hour_start: string
  min_activity_hour_end: string
  points_issued: number
  capacity?: number
  qr_code?: string
}

export const fandomatsApi = {
  // Get all fandomats
  getFandomats: async (): Promise<FondomatsResponse> => {
    return apiClient.get<FondomatsResponse>("/fandomats/")
  },

  // Get detailed fondomat information
  getFondomat: async (id: number): Promise<DetailedFondomat> => {
    return apiClient.get<DetailedFondomat>(`/fandomats/${id}`)
  },

  createFondomat: async (data: CreateFondomat): Promise<Fondomat> => {
    return apiClient.post<Fondomat>("/fandomats/", data)
  },

  updateFondomat: async (id: number, data: UpdateFondomat): Promise<Fondomat> => {
    return apiClient.patch<Fondomat>(`/fandomats/${id}`, data)
  },

  deleteFondomat: async (id: number): Promise<void> => {
    return apiClient.delete(`/fandomats/${id}`)
  },

  // Generate new QR code for fondomat
  generateQRCode: async (id: number): Promise<{ qr_code: string }> => {
    return apiClient.post<{ qr_code: string }>(`/fandomats/${id}/regenerate-qr`)
  },
}

export const getFandomats = fandomatsApi.getFandomats
export const getFondomat = fandomatsApi.getFondomat
export const createFondomat = fandomatsApi.createFondomat
export const updateFondomat = fandomatsApi.updateFondomat
export const deleteFondomat = fandomatsApi.deleteFondomat
export const generateQRCode = fandomatsApi.generateQRCode
