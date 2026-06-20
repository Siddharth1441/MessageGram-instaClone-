const express = require("express")
const identifyUser = require("../middlewares/auth.middleware")
const notificationController = require("../controllers/notification.controller")

const notificationRouter = express.Router()

notificationRouter.get("/", identifyUser, notificationController.listNotificationsController)
notificationRouter.patch("/read", identifyUser, notificationController.markNotificationsReadController)

module.exports = notificationRouter
