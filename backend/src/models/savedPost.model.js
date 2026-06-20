const mongoose = require("mongoose")

const savedPostSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Posts",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    }
},{
    timestamps:true
})

savedPostSchema.index({ post:1, user:1 }, { unique:true })
savedPostSchema.index({ user:1, createdAt:-1 })

module.exports = mongoose.model("savedPosts", savedPostSchema)
