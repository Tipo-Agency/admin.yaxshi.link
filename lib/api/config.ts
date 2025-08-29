export const API_BASE_URL = "https://api.yaxshi.link/admin/api/v1"

export const API_ENDPOINTS = {
  USERS: {
    LIST: "/users/",
    BLOCK: (id: number) => `/users/${id}/block`,
    UNBLOCK: (id: number) => `/users/${id}/unblock`,
  },
  VENDORS: {
    LIST: "/vendors/",
    DETAIL: (id: number) => `/vendors/${id}`,
    CREATE: "/vendors/",
    UPDATE: (id: number) => `/vendors/${id}`,
    RESET_PASSWORD: (id: number) => `/vendors/${id}/reset-password`,
  },
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },
} as const
