export interface ApiResponse<T = any> {
  data?: T
  message?: string
  success?: boolean
}

export interface User {
  id: number
  username: string
  avatar: string
  phone: string
  first_name: string
  last_name: string
  email: string
  is_active: boolean
  status: string
  role: string
  balance: number
  points: number
  level: number
  bottle_count: number
  aluminum_bottle_count: number
  total_payout: number
  total_bottles_submitted: number
  created_at: string
}

export interface UsersStats {
  total: number
  active: number
  blocked: number
  new_this_month: number
}

export interface UsersApiResponse {
  users: User[]
  stats: UsersStats
}

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
}

export interface ApiErrorResponse {
  error: string
  message?: string
  details?: any
}
