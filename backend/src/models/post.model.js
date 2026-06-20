const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:"",
        maxlength:2200
    },
    media:[{
        url:{ type:String, required:true },
        type:{ type:String, enum:["image","video"], default:"image" },
        thumbnailUrl:String,
        fileId:String
    }],
    imageUrl:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true,"User id required"]
    },
    hashtags:[{
        type:String,
        lowercase:true,
        trim:true
    }],
    mentions:[{
        type:String,
        lowercase:true,
        trim:true
    }],
    visibility:{
        type:String,
        enum:["public","followers","private"],
        default:"public"
    },
    commentsDisabled:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

postSchema.index({ user:1, createdAt:-1 })
postSchema.index({ hashtags:1 })
postSchema.index({ caption:"text", hashtags:"text" })


const postModel = mongoose.model("Posts",postSchema)


module.exports = postModel
