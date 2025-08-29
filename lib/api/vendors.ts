import { apiClient } from "./client"
import { API_ENDPOINTS } from "./config"

export interface Vendor {
  id: number
  name: string
  login: string
  contact_email: string
  contact_phone: string
  terms: string
  commission_percent: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateVendorPayload {
  name: string
  contact_email: string
  contact_phone: string
  terms: string
  commission_percent: number
  is_active: boolean
}

export interface UpdateVendorPayload {
  name?: string
  login?: string
  contact_email?: string
  contact_phone?: string
  terms?: string
  commission_percent?: number
  is_active?: boolean
}

export interface CreateVendorResponse {
  vendor: Vendor
  login: string
  password: string
}

export interface ResetPasswordResponse {
  login: string
  password: string
}

export const vendorsApi = {
  list: async (): Promise<Vendor[]> => {
    return apiClient.get<Vendor[]>(API_ENDPOINTS.VENDORS.LIST)
  },
  get: async (id: number): Promise<Vendor> => {
    return apiClient.get<Vendor>(API_ENDPOINTS.VENDORS.DETAIL(id))
  },
  create: async (payload: CreateVendorPayload): Promise<CreateVendorResponse> => {
    return apiClient.post<CreateVendorResponse>(API_ENDPOINTS.VENDORS.CREATE, payload)
  },
  update: async (id: number, payload: UpdateVendorPayload): Promise<Vendor> => {
    return apiClient.patch<Vendor>(API_ENDPOINTS.VENDORS.UPDATE(id), payload)
  },
  resetPassword: async (id: number): Promise<ResetPasswordResponse> => {
    return apiClient.post<ResetPasswordResponse>(API_ENDPOINTS.VENDORS.RESET_PASSWORD(id))
  },
}

export type { Vendor as TVendor }

