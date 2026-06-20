const reportModel = require("../models/report.model")
const asyncHandler = require("../utils/asyncHandler")

const createReportController = asyncHandler(async function createReportController(req,res) {
    const { targetType, targetId, reason, details } = req.body

    if (!targetType || !targetId || !reason) {
        return res.status(400).json({ message:"Target type, target id and reason are required" })
    }

    const report = await reportModel.create({
        reporter:req.user.id,
        targetType,
        targetId,
        reason,
        details
    })

    res.status(201).json({ message:"Report submitted", report })
})

const listReportsController = asyncHandler(async function listReportsController(req,res) {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message:"Admin access required" })
    }

    const reports = await reportModel.find({ status:req.query.status || "open" })
        .populate("reporter","username name profileImage")
        .sort({ createdAt:-1 })
        .limit(100)
        .lean()

    res.status(200).json({ reports })
})

module.exports = {
    createReportController,
    listReportsController
}
