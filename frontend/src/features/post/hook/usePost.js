import { useContext } from "react";
import { createComment, createPost, getComments, getFeed, likePost, savePost, unlikePost, unsavePost } from "../services/post.api";
import { PostContext } from "../post.context";
import { getApiError } from "../../shared/services/api";


export const usePost = ()=>{
    const context = useContext(PostContext)
    const { loading, setLoading, post, feed, setFeed, error, setError}  = context

    const updateFeedPost = (postId, updater) => {
        setFeed((currentFeed = []) => currentFeed.map((item) => {
            if (item._id !== postId) return item
            return updater(item)
        }))
    }
    
    const handleGetfeed = async () => {
        try {
            setError("")
            setLoading(true)
            const data = await getFeed()
            const feedData = Array.isArray(data) ? data : (data?.posts || data?.feed || [])
            setFeed(feedData)
        } catch (error) {
            console.error('Failed to fetch feed:', error)
            setError(getApiError(error, "Failed to fetch feed"))
            setFeed([])
        } finally {
            setLoading(false)
        }
    }

    const handleCreatePost = async (imageFiles,caption) => {
        try {
            setError("")
            setLoading(true)
            const data = await createPost(imageFiles,caption)
            setFeed((currentFeed = []) => [data.post,...currentFeed])
            return data.post
        } catch (error) {
            const message = getApiError(error, "Failed to create post")
            setError(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const handleLike = async (postId) => {
        updateFeedPost(postId, (item) => ({ ...item, isLiked:true, likesCount:(item.likesCount || 0) + 1 }))
        try {
            await likePost(postId)
        } catch (error) {
            updateFeedPost(postId, (item) => ({ ...item, isLiked:false, likesCount:Math.max((item.likesCount || 1) - 1, 0) }))
            setError(getApiError(error, "Failed to like post"))
        }
    }

    const handleUnlike = async (postId) => {
        updateFeedPost(postId, (item) => ({ ...item, isLiked:false, likesCount:Math.max((item.likesCount || 1) - 1, 0) }))
        try {
            await unlikePost(postId)
        } catch (error) {
            updateFeedPost(postId, (item) => ({ ...item, isLiked:true, likesCount:(item.likesCount || 0) + 1 }))
            setError(getApiError(error, "Failed to unlike post"))
        }
    }

    const handleSaveToggle = async (postId, isSaved) => {
        updateFeedPost(postId, (item) => ({ ...item, isSaved:!isSaved }))
        try {
            if (isSaved) await unsavePost(postId)
            else await savePost(postId)
        } catch (error) {
            updateFeedPost(postId, (item) => ({ ...item, isSaved }))
            setError(getApiError(error, "Failed to update saved post"))
        }
    }

    const handleGetComments = async (postId) => {
        const data = await getComments(postId)
        return data.comments || []
    }

    const handleCreateComment = async (postId, text) => {
        const data = await createComment(postId, text)
        updateFeedPost(postId, (item) => ({ ...item, commentsCount:(item.commentsCount || 0) + 1 }))
        return data.comment
    }

    return { loading,error,feed,post,handleGetfeed,handleCreatePost,handleLike,handleUnlike,handleSaveToggle,handleGetComments,handleCreateComment}

}
