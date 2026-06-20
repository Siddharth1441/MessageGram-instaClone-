import { api } from "../../shared/services/api"

export async function getProfile(username) {
  const response = await api.get(`/users/${username}`)
  return response.data
}

export async function updateProfile(payload) {
  const response = await api.patch("/users/me/profile", payload)
  return response.data
}

export async function searchUsers(query) {
  const response = await api.get("/users/search", { params:{ q:query } })
  return response.data
}

export async function followUser(username) {
  const response = await api.post(`/users/follow/${username}`)
  return response.data
}

export async function unfollowUser(username) {
  const response = await api.post(`/users/unfollow/${username}`)
  return response.data
}
