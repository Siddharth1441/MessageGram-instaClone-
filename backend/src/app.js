const express = require("express")
const cookieParser = require('cookie-parser')
const authRouter = require("./routers/auth.routes")
const postRouter = require("./routers/post.routes")
const cors = require('cors')

const userRouter= require('./routers/user.routes')
const commentRouter = require("./routers/comment.routes")
const savedPostRouter = require("./routers/savedPost.routes")
const notificationRouter = require("./routers/notification.routes")
const reportRouter = require("./routers/report.routes")
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware")
const app = express()
app.use(express.json({ limit:"1mb" }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true
}))

app.use('/api/auth',authRouter)
app.use('/api/posts',postRouter)
app.use('/api/users',userRouter)
app.use('/api/comments',commentRouter)
app.use('/api/saved-posts',savedPostRouter)
app.use('/api/notifications',notificationRouter)
app.use('/api/reports',reportRouter)

app.use(notFoundHandler)
app.use(errorHandler)


module.exports = app
