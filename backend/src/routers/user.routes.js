const express = require('express')
const userController = require('../controllers/user.controller')
const identifyUser = require('../middlewares/auth.middleware')
const userRouter = express.Router()


userRouter.post('/follow/:username',identifyUser,userController.followUserController)

userRouter.post('/unfollow/:username',identifyUser,userController.unfollowUserController)
userRouter.get('/search',identifyUser,userController.searchUsersController)
userRouter.get('/:username',identifyUser,userController.getProfileController)
userRouter.patch('/me/profile',identifyUser,userController.updateProfileController)
userRouter.post('/block/:username',identifyUser,userController.blockUserController)
userRouter.post('/unblock/:username',identifyUser,userController.unblockUserController)



module.exports = userRouter
