import { apiClient } from "./client"

export interface DashboardStats {
  total_users: number
  active_fandomats: number
  total_issued_rewards: number
  rewards: Array<{
    id: number
    name: string
    issued_total: number
  }>
  total_income: string
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    return await apiClient.get<DashboardStats>("/dashboard/")
  },
}

export const { getStats } = dashboardApi
