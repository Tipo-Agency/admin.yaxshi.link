import { apiClient } from "./client"

export interface Reward {
  id: number
  vendor_id: number
  name: string
  description: string
  image: string
  points_required: number
  price_uzs: string
  quantity: number
  issued_total: number
  popularity: number
  created_at: string
  updated_at: string
}

export interface RewardsStats {
  total_issued: number
}

export interface RewardsResponse {
  rewards: Reward[]
  stats: RewardsStats
}

export interface CreateRewardData {
  name: string
  description: string | null
  points_required: number
  price_uzs: string
  quantity: number
  image: File
}

export interface UpdateRewardData {
  name?: string
  description?: string | null
  points_required?: number
  price_uzs?: string
  quantity?: number
  image?: File
}

export const rewardsApi = {
  getRewards: async (): Promise<RewardsResponse> => {
    return apiClient.get<RewardsResponse>("/rewards/")
  },

  createReward: async (data: CreateRewardData): Promise<Reward> => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description || "")
    formData.append("points_required", data.points_required.toString())
    formData.append("price_uzs", data.price_uzs)
    formData.append("quantity", data.quantity.toString())
    formData.append("image", data.image)

    try {
      const response = await fetch("https://api.yaxshi.link/admin/api/v1/rewards/", {
        method: "POST",
        body: formData,
      })

      console.log("API Response status:", response.status)
      console.log("API Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorText = await response.text()
          console.error("API Error Response:", errorText)

          if (errorText.startsWith("{")) {
            const errorData = JSON.parse(errorText)
            errorMessage = errorData.message || errorData.detail || errorMessage
          } else if (errorText.includes("<!DOCTYPE")) {
            errorMessage = `Server returned HTML error page (status: ${response.status}). Check if API endpoint is correct.`
          } else {
            errorMessage = errorText || errorMessage
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError)
        }
        throw new Error(errorMessage)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text()
        console.error("Non-JSON response:", responseText)
        throw new Error("Server returned non-JSON response")
      }

      const result = await response.json()
      console.log("Successfully created reward:", result)
      return result
    } catch (error) {
      console.error("Create reward error:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Failed to create reward")
    }
  },

  updateReward: async (id: number, data: UpdateRewardData): Promise<Reward> => {
    const formData = new FormData()

    if (data.name !== undefined) formData.append("name", data.name)
    if (data.description !== undefined) formData.append("description", data.description || "")
    if (data.points_required !== undefined) formData.append("points_required", data.points_required.toString())
    if (data.price_uzs !== undefined) formData.append("price_uzs", data.price_uzs)
    if (data.quantity !== undefined) formData.append("quantity", data.quantity.toString())
    if (data.image !== undefined) formData.append("image", data.image)

    try {
      const response = await fetch(`https://api.yaxshi.link/admin/api/v1/rewards/${id}`, {
        method: "PATCH",
        body: formData,
      })

      console.log("Update API Response status:", response.status)

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorText = await response.text()
          console.error("Update API Error Response:", errorText)

          if (errorText.startsWith("{")) {
            const errorData = JSON.parse(errorText)
            errorMessage = errorData.message || errorData.detail || errorMessage
          } else if (errorText.includes("<!DOCTYPE")) {
            errorMessage = `Server returned HTML error page (status: ${response.status}). Check if API endpoint is correct.`
          } else {
            errorMessage = errorText || errorMessage
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError)
        }
        throw new Error(errorMessage)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text()
        console.error("Non-JSON response:", responseText)
        throw new Error("Server returned non-JSON response")
      }

      const result = await response.json()
      console.log("Successfully updated reward:", result)
      return result
    } catch (error) {
      console.error("Update reward error:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Failed to update reward")
    }
  },

  deleteReward: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`https://api.yaxshi.link/admin/api/v1/rewards/${id}`, {
        method: "DELETE",
      })

      console.log("Delete API Response status:", response.status)

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorText = await response.text()
          console.error("Delete API Error Response:", errorText)

          if (errorText.startsWith("{")) {
            const errorData = JSON.parse(errorText)
            errorMessage = errorData.message || errorData.detail || errorMessage
          } else if (errorText.includes("<!DOCTYPE")) {
            errorMessage = `Server returned HTML error page (status: ${response.status}). Check if API endpoint is correct.`
          } else {
            errorMessage = errorText || errorMessage
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError)
        }
        throw new Error(errorMessage)
      }

      console.log("Successfully deleted reward")
    } catch (error) {
      console.error("Delete reward error:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Failed to delete reward")
    }
  },
}

export const getRewards = rewardsApi.getRewards
export const createReward = rewardsApi.createReward
export const updateReward = rewardsApi.updateReward
export const deleteReward = rewardsApi.deleteReward
