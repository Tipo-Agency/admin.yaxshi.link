export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://api.yaxshi.link"

export const API_URL = `${API_BASE_URL}/admin/api/v1`

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
  BOTTLES: {
    LIST: "/bottles/",
    DETAIL: (id: number) => `/bottles/${id}`,
    CREATE: "/bottles/",
    UPDATE: (id: number) => `/bottles/${id}`,
    DELETE: (id: number) => `/bottles/${id}`,
  },
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },
} as const
