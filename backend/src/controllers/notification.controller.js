const notificationModel = require("../models/notification.model")
const asyncHandler = require("../utils/asyncHandler")

const listNotificationsController = asyncHandler(async function listNotificationsController(req,res) {
    const notifications = await notificationModel.find({ recipient:req.user.id })
        .populate("actor","username name profileImage")
        .populate("post","caption imageUrl")
        .sort({ createdAt:-1 })
        .limit(50)
        .lean()

    res.status(200).json({ notifications })
})

const markNotificationsReadController = asyncHandler(async function markNotificationsReadController(req,res) {
    await notificationModel.updateMany({ recipient:req.user.id, read:false }, { read:true })
    res.status(200).json({ message:"Notifications marked as read" })
})

module.exports = {
    listNotificationsController,
    markNotificationsReadController
}
