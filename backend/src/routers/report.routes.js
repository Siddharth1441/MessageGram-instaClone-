const express = require("express")
const identifyUser = require("../middlewares/auth.middleware")
const reportController = require("../controllers/report.controller")

const reportRouter = express.Router()

reportRouter.post("/", identifyUser, reportController.createReportController)
reportRouter.get("/", identifyUser, reportController.listReportsController)

module.exports = reportRouter
