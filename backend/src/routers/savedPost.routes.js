const express = require("express")
const identifyUser = require("../middlewares/auth.middleware")
const savedPostController = require("../controllers/savedPost.controller")

const savedPostRouter = express.Router()

savedPostRouter.get("/", identifyUser, savedPostController.listSavedPostsController)
savedPostRouter.post("/:postId", identifyUser, savedPostController.savePostController)
savedPostRouter.delete("/:postId", identifyUser, savedPostController.unsavePostController)

module.exports = savedPostRouter
