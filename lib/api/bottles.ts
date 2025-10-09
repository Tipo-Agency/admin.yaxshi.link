import { API_URL } from "./config"

export type BottleMaterial = "plastic" | "aluminum"

export interface Bottle {
  id: number
  name: string
  size: string
  material: BottleMaterial
  sku: string
  image?: string
  created_at: string
  updated_at: string
}

export interface BottlesResponse {
  bottles: Bottle[]
  total: number
}

export interface BottlesListParams {
  skip?: number
  limit?: number
  material?: BottleMaterial | null
  search?: string | null
}

export interface CreateBottleData {
  name: string
  size: number
  material: BottleMaterial
  sku: string
  image?: File
}

export interface UpdateBottleData {
  name?: string
  size?: number
  material?: BottleMaterial
  sku?: string
  image?: File
}

class BottlesApi {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async list(params?: BottlesListParams): Promise<BottlesResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.skip !== undefined) searchParams.append("skip", params.skip.toString())
    if (params?.limit !== undefined) searchParams.append("limit", params.limit.toString())
    if (params?.material) searchParams.append("material", params.material)
    if (params?.search) searchParams.append("search", params.search)

    const url = `${this.baseUrl}/bottles/?${searchParams.toString()}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  async create(data: CreateBottleData): Promise<Bottle> {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("size", data.size.toString())
    formData.append("material", data.material)
    formData.append("sku", data.sku)
    
    if (data.image) {
      formData.append("image", data.image)
    }

    const response = await fetch(`${this.baseUrl}/bottles/`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async update(id: number, data: UpdateBottleData): Promise<Bottle> {
    const formData = new FormData()
    
    if (data.name !== undefined) formData.append("name", data.name)
    if (data.size !== undefined) formData.append("size", data.size.toString())
    if (data.material !== undefined) formData.append("material", data.material)
    if (data.sku !== undefined) formData.append("sku", data.sku)
    if (data.image) formData.append("image", data.image)

    const response = await fetch(`${this.baseUrl}/bottles/${id}`, {
      method: "PATCH",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/bottles/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  }

  async get(id: number): Promise<Bottle> {
    const response = await fetch(`${this.baseUrl}/bottles/${id}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }
}

export const bottlesApi = new BottlesApi(API_URL)

