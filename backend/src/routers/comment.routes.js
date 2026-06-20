const express = require("express")
const identifyUser = require("../middlewares/auth.middleware")
const commentController = require("../controllers/comment.controller")

const commentRouter = express.Router()

commentRouter.get("/:postId", identifyUser, commentController.listCommentsController)
commentRouter.post("/:postId", identifyUser, commentController.createCommentController)
commentRouter.delete("/:commentId", identifyUser, commentController.deleteCommentController)

module.exports = commentRouter
