const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Posts",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    parent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comments",
        default:null
    },
    text:{
        type:String,
        required:true,
        trim:true,
        maxlength:500
    }
},{
    timestamps:true
})

commentSchema.index({ post:1, createdAt:-1 })
commentSchema.index({ parent:1, createdAt:1 })

module.exports = mongoose.model("comments", commentSchema)
