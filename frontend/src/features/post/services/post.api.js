import { api } from "../../shared/services/api"

export async function getFeed() {
    const response = await api.get('/posts/feed')
    return response.data
}
export async function createPost (imageFiles,caption) {
    const formData = new FormData()
    const files = Array.isArray(imageFiles) ? imageFiles : [imageFiles]
    files.forEach((file) => formData.append("media", file))
    formData.append("caption",caption)

    const response = await api.post("/posts",formData)
    return response.data
}


export async function likePost(postId) {
    const response = await api.post("/posts/like/"+postId)
    return response.data
}
export async function unlikePost(postId) {
    const response = await api.post("/posts/unlike/"+postId)
    return response.data
}

export async function savePost(postId) {
    const response = await api.post("/saved-posts/"+postId)
    return response.data
}

export async function unsavePost(postId) {
    const response = await api.delete("/saved-posts/"+postId)
    return response.data
}

export async function getComments(postId) {
    const response = await api.get("/comments/"+postId)
    return response.data
}

export async function createComment(postId, text, parent = null) {
    const response = await api.post("/comments/"+postId, { text, parent })
    return response.data
}

export async function searchPosts(query) {
    const response = await api.get("/posts/search", { params:{ q:query } })
    return response.data
}
