import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
})

export function getApiError(error, fallback = "Something went wrong") {
  return error?.response?.data?.message || fallback
}
