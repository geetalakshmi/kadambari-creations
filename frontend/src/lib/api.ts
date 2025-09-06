import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export const api = axios.create({
  baseURL: BASE_URL,
})

export type Category = { id: string; name: string }
export type Product = { id: string; name: string; price: number; category: string; description: string; image_url: string; subcategory?: string }

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get('/api/categories')
  return data.categories
}

export async function fetchProducts(params?: { category?: string; q?: string; subcategory?: string }) {
  const { data } = await api.get('/api/products', { params })
  return data.products
}
export async function createProduct(form: FormData, adminToken: string) {
  const { data } = await api.post('/api/admin/products', form, { headers: { 'x-admin-token': adminToken } })
  return data as Product
}
