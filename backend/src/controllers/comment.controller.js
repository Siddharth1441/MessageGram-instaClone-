const commentModel = require("../models/comment.model")
const postModel = require("../models/post.model")
const notificationModel = require("../models/notification.model")
const asyncHandler = require("../utils/asyncHandler")

const listCommentsController = asyncHandler(async function listCommentsController(req,res) {
    const comments = await commentModel.find({
        post:req.params.postId,
        parent:req.query.parent || null
    })
        .populate("user","username name profileImage")
        .sort({ createdAt:req.query.parent ? 1 : -1 })
        .limit(Math.min(Number(req.query.limit) || 50, 100))
        .lean()

    res.status(200).json({ comments })
})

const createCommentController = asyncHandler(async function createCommentController(req,res) {
    const { text, parent } = req.body

    if (!text?.trim()) {
        return res.status(400).json({ message:"Comment text is required" })
    }

    const post = await postModel.findById(req.params.postId)
    if (!post) {
        return res.status(404).json({ message:"Post not found" })
    }

    if (post.commentsDisabled) {
        return res.status(403).json({ message:"Comments are disabled for this post" })
    }

    const comment = await commentModel.create({
        post:post._id,
        user:req.user.id,
        parent:parent || null,
        text
    })

    if (post.user.toString() !== req.user.id) {
        await notificationModel.create({
            recipient:post.user,
            actor:req.user.id,
            type:"comment",
            post:post._id
        })
    }

    const populated = await comment.populate("user","username name profileImage")
    res.status(201).json({ message:"Comment created", comment:populated })
})

const deleteCommentController = asyncHandler(async function deleteCommentController(req,res) {
    const comment = await commentModel.findById(req.params.commentId)

    if (!comment) {
        return res.status(404).json({ message:"Comment not found" })
    }

    const post = await postModel.findById(comment.post)
    const canDelete = comment.user.toString() === req.user.id || post?.user.toString() === req.user.id

    if (!canDelete) {
        return res.status(403).json({ message:"You cannot delete this comment" })
    }

    await commentModel.deleteMany({
        $or:[{ _id:comment._id }, { parent:comment._id }]
    })

    res.status(200).json({ message:"Comment deleted" })
})

module.exports = {
    listCommentsController,
    createCommentController,
    deleteCommentController
}
