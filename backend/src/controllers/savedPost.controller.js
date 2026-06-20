const savedPostModel = require("../models/savedPost.model")
const postModel = require("../models/post.model")
const asyncHandler = require("../utils/asyncHandler")

const savePostController = asyncHandler(async function savePostController(req,res) {
    const post = await postModel.findById(req.params.postId)
    if (!post) {
        return res.status(404).json({ message:"Post not found" })
    }

    const savedPost = await savedPostModel.findOneAndUpdate(
        { post:req.params.postId, user:req.user.id },
        { post:req.params.postId, user:req.user.id },
        { upsert:true, new:true, setDefaultsOnInsert:true }
    )

    res.status(200).json({ message:"Post saved", savedPost })
})

const unsavePostController = asyncHandler(async function unsavePostController(req,res) {
    await savedPostModel.findOneAndDelete({ post:req.params.postId, user:req.user.id })
    res.status(200).json({ message:"Post removed from saved" })
})

const listSavedPostsController = asyncHandler(async function listSavedPostsController(req,res) {
    const savedPosts = await savedPostModel.find({ user:req.user.id })
        .populate({
            path:"post",
            populate:{ path:"user", select:"username name profileImage" }
        })
        .sort({ createdAt:-1 })
        .lean()

    res.status(200).json({ posts:savedPosts.map(item => item.post).filter(Boolean) })
})

module.exports = {
    savePostController,
    unsavePostController,
    listSavedPostsController
}
