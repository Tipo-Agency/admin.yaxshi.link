import { apiClient } from "./client"
import { API_ENDPOINTS } from "./config"
import type { UsersApiResponse } from "./types"

export const usersApi = {
  /**
   * Получить список всех пользователей с статистикой
   */
  getUsers: async (): Promise<UsersApiResponse> => {
    return apiClient.get<UsersApiResponse>(API_ENDPOINTS.USERS.LIST)
  },

  /**
   * Заблокировать пользователя
   */
  blockUser: async (userId: number): Promise<void> => {
    return apiClient.post<void>(API_ENDPOINTS.USERS.BLOCK(userId))
  },

  /**
   * Разблокировать пользователя
   */
  unblockUser: async (userId: number): Promise<void> => {
    return apiClient.post<void>(API_ENDPOINTS.USERS.UNBLOCK(userId))
  },
}
