const express = require("express")
const postRouter = express.Router()
const postController = require("../controllers/post.controller")
const multer = require("multer")
const upload = multer({
    storage: multer.memoryStorage(),
    limits:{ fileSize:25 * 1024 * 1024, files:10 }
})
const identifyUser = require('../middlewares/auth.middleware')

postRouter.post('/', identifyUser, upload.array("media", 10), postController.createPostController)
postRouter.get('/',identifyUser,postController.getPostController)
postRouter.get('/feed',identifyUser,postController.getFeedController)
postRouter.get('/search',identifyUser,postController.searchPostsController)
postRouter.get('/details/:postId',identifyUser,postController.getPostDetails)
postRouter.patch('/:postId',identifyUser,postController.updatePostController)
postRouter.delete('/:postId',identifyUser,postController.deletePostController)

postRouter.post('/like/:postId',identifyUser,postController.likePostController)
postRouter.post('/unlike/:postId',identifyUser,postController.unlikePostController)


module.exports = postRouter
